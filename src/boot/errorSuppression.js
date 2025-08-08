// Boot file to immediately suppress ResizeObserver errors
// This runs before the Vue app is created

// Immediate ResizeObserver error suppression
;(function () {
  // Override console.error immediately
  const originalConsoleError = console.error
  console.error = function (...args) {
    const errorMessage = args[0]

    if (typeof errorMessage === 'string') {
      // Suppress ResizeObserver errors
      if (errorMessage.includes('ResizeObserver loop completed with undelivered notifications')) {
        return
      }

      // Suppress Vite HMR errors in hosted environments
      if (
        errorMessage.includes('Cannot read properties of undefined') &&
        errorMessage.includes('send')
      ) {
        return
      }

      if (
        errorMessage.includes('WebSocket connection') ||
        errorMessage.includes('HMR') ||
        errorMessage.includes('@vite/client')
      ) {
        return
      }
    }

    originalConsoleError.apply(console, args)
  }

  // Handle window errors immediately
  window.addEventListener(
    'error',
    (event) => {
      if (event.message) {
        // Suppress ResizeObserver errors
        if (event.message.includes('ResizeObserver loop completed')) {
          event.preventDefault()
          event.stopPropagation()
          return false
        }

        // Suppress Vite HMR errors
        if (
          event.message.includes('Cannot read properties of undefined') &&
          event.message.includes('send')
        ) {
          event.preventDefault()
          event.stopPropagation()
          return false
        }

        // Suppress WebSocket/HMR related errors
        if (
          event.message.includes('WebSocket') ||
          event.message.includes('HMR') ||
          (event.filename && event.filename.includes('@vite/client'))
        ) {
          event.preventDefault()
          event.stopPropagation()
          return false
        }
      }
    },
    true,
  ) // Capture phase

  // Handle unhandled rejections
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (event.reason && event.reason.message) {
        // Suppress ResizeObserver errors
        if (event.reason.message.includes('ResizeObserver')) {
          event.preventDefault()
          return false
        }

        // Suppress HMR/WebSocket errors
        if (
          event.reason.message.includes('WebSocket') ||
          event.reason.message.includes('HMR') ||
          (event.reason.message.includes('Cannot read properties of undefined') &&
            event.reason.message.includes('send'))
        ) {
          event.preventDefault()
          return false
        }
      }
    },
    true,
  )

  // Patch ResizeObserver constructor to add error handling
  if (window.ResizeObserver) {
    const OriginalResizeObserver = window.ResizeObserver
    window.ResizeObserver = class extends OriginalResizeObserver {
      constructor(callback) {
        const wrappedCallback = (entries, observer) => {
          try {
            callback(entries, observer)
          } catch (error) {
            if (!error.message.includes('ResizeObserver loop completed')) {
              throw error
            }
            // Silently catch and ignore ResizeObserver loop errors
          }
        }
        super(wrappedCallback)
      }
    }
  }
})()

export default () => {
  // Additional cleanup for development
  if (process.env.DEV) {
    const cleanupOverlays = () => {
      const selectors = [
        '#webpack-dev-server-client-overlay',
        '#webpack-dev-server-client-overlay-div',
        '.webpack-dev-server-client-overlay',
        '[data-vite-dev-client-overlay]',
      ]

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((element) => {
          if (element.textContent && element.textContent.includes('ResizeObserver')) {
            element.style.display = 'none'
            element.remove()
          }
        })
      })
    }

    // Clean overlays immediately and periodically
    cleanupOverlays()
    setInterval(cleanupOverlays, 100)
  }
}
