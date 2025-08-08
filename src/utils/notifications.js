// Simple notification system that works in any environment
export const createNotification = (message, type = 'info', duration = 3000) => {
  // Try Quasar first if available
  if (typeof window !== 'undefined' && window.$q && window.$q.notify) {
    const typeMap = {
      success: 'positive',
      error: 'negative',
      warning: 'warning',
      info: 'info',
    }

    window.$q.notify({
      message,
      type: typeMap[type] || 'info',
      position: 'top',
      timeout: duration,
    })
    return
  }

  // Fallback to custom notification
  createCustomNotification(message, type, duration)
}

const createCustomNotification = (message, type, duration) => {
  // Remove existing notifications
  const existing = document.querySelectorAll('.custom-notification')
  existing.forEach((el) => el.remove())

  // Create notification element
  const notification = document.createElement('div')
  notification.className = `custom-notification notification-${type}`

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  }

  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: white;
      border-left: 4px solid ${colors[type] || colors.info};
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 16px 20px;
      max-width: 400px;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 16px;">${icons[type] || icons.info}</span>
        <span style="color: #374151; line-height: 1.4;">${message}</span>
      </div>
    </div>
  `

  // Add CSS animation if not exists
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style')
    style.id = 'notification-styles'
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      .custom-notification.fade-out {
        animation: slideOut 0.3s ease-in forwards;
      }
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  // Auto remove
  setTimeout(() => {
    notification.classList.add('fade-out')
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, duration)

  // Click to dismiss
  notification.addEventListener('click', () => {
    notification.classList.add('fade-out')
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  })
}

// Export common notification functions
export const notifySuccess = (message) => createNotification(message, 'success')
export const notifyError = (message) => createNotification(message, 'error')
export const notifyWarning = (message) => createNotification(message, 'warning')
export const notifyInfo = (message) => createNotification(message, 'info')

export default {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  create: createNotification,
}
