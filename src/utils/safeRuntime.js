// Safe runtime utilities for hosted environments

// Detect if running in hosted environment
export const isHosted = () => {
  if (typeof window === 'undefined') return false

  return (
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    window.location.hostname !== '0.0.0.0'
  )
}

// Safe WebSocket wrapper
export const createSafeWebSocket = (url, protocols) => {
  if (isHosted()) {
    console.log('WebSocket disabled in hosted environment')
    return {
      readyState: 3, // CLOSED
      send: () => {},
      close: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  }

  try {
    return new WebSocket(url, protocols)
  } catch (error) {
    console.log('WebSocket creation failed, using mock')
    return {
      readyState: 3,
      send: () => {},
      close: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  }
}

// Patch global WebSocket if needed
if (typeof window !== 'undefined' && isHosted()) {
  const originalWebSocket = window.WebSocket
  window.WebSocket = class SafeWebSocket {
    constructor(url, protocols) {
      return createSafeWebSocket(url, protocols)
    }

    static get CONNECTING() {
      return 0
    }
    static get OPEN() {
      return 1
    }
    static get CLOSING() {
      return 2
    }
    static get CLOSED() {
      return 3
    }
  }

  // Preserve static properties
  Object.assign(window.WebSocket, originalWebSocket)
}

// Safe HMR client wrapper
export const safeHMR = {
  send: (data) => {
    if (!isHosted()) {
      try {
        // Only try to send if not in hosted environment
        if (window.__vite_hmr_client && window.__vite_hmr_client.send) {
          window.__vite_hmr_client.send(data)
        }
      } catch (error) {
        console.log('HMR send failed safely:', error.message)
      }
    }
  },

  on: (event, callback) => {
    if (!isHosted()) {
      try {
        if (window.__vite_hmr_client && window.__vite_hmr_client.on) {
          window.__vite_hmr_client.on(event, callback)
        }
      } catch (error) {
        console.log('HMR event listener failed safely:', error.message)
      }
    }
  },
}

export default {
  isHosted,
  createSafeWebSocket,
  safeHMR,
}
