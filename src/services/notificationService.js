// Notification service that works with Quasar's Notify plugin
const getNotify = () => {
  // Try to get Quasar's Notify from global
  if (typeof window !== 'undefined' && window.$q && window.$q.notify) {
    return window.$q.notify
  }

  // Try to import from Quasar
  try {
    const { Notify } = require('quasar')
    return Notify
  } catch (e) {
    // Fallback to custom notifications
    return null
  }
}

export class NotificationService {
  // Success notifications
  static success(message, options = {}) {
    const notify = getNotify()
    if (notify && notify.create) {
      notify.create({
        type: 'positive',
        message,
        position: 'top',
        timeout: 3000,
        icon: 'check_circle',
        ...options,
      })
    } else {
      // Fallback to custom notification
      this.createCustomNotification(message, 'success', options.timeout || 3000)
    }
  }

  // Error notifications
  static error(message, options = {}) {
    const notify = getNotify()
    if (notify && notify.create) {
      notify.create({
        type: 'negative',
        message,
        position: 'top',
        timeout: 5000,
        icon: 'error',
        ...options,
      })
    } else {
      this.createCustomNotification(message, 'error', options.timeout || 5000)
    }
  }

  // Warning notifications
  static warning(message, options = {}) {
    const notify = getNotify()
    if (notify && notify.create) {
      notify.create({
        type: 'warning',
        message,
        position: 'top',
        timeout: 4000,
        icon: 'warning',
        ...options,
      })
    } else {
      this.createCustomNotification(message, 'warning', options.timeout || 4000)
    }
  }

  // Info notifications
  static info(message, options = {}) {
    const notify = getNotify()
    if (notify && notify.create) {
      notify.create({
        type: 'info',
        message,
        position: 'top',
        timeout: 3000,
        icon: 'info',
        ...options,
      })
    } else {
      this.createCustomNotification(message, 'info', options.timeout || 3000)
    }
  }

  // Loading notification
  static loading(message = 'Đang xử lý...', options = {}) {
    return Notify.create({
      type: 'ongoing',
      message,
      position: 'top',
      spinner: true,
      timeout: 0, // Don't auto-dismiss
      ...options,
    })
  }

  // Connection error
  static connectionError() {
    this.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.', {
      timeout: 6000,
      actions: [
        {
          label: 'Thử lại',
          color: 'white',
          handler: () => {
            window.location.reload()
          },
        },
      ],
    })
  }

  // API error
  static apiError(error, customMessage = null) {
    const message = customMessage || error.message || 'Đã xảy ra lỗi không mong muốn'

    this.error(message, {
      timeout: 5000,
      caption: error.code ? `Mã lỗi: ${error.code}` : undefined,
    })
  }

  // Authentication error
  static authError() {
    this.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
      timeout: 5000,
      actions: [
        {
          label: 'Đăng nhập',
          color: 'white',
          handler: () => {
            // Navigate to login page
            window.location.href = '/login'
          },
        },
      ],
    })
  }

  // Feature coming soon
  static comingSoon(feature = 'Tính năng này') {
    this.info(`${feature} sẽ sớm ra mắt!`, {
      icon: 'schedule',
      timeout: 3000,
    })
  }

  // Achievement unlocked
  static achievement(title, description) {
    this.success(`🏆 ${title}`, {
      caption: description,
      timeout: 5000,
      icon: 'emoji_events',
      color: 'amber',
    })
  }

  // XP gained
  static xpGained(amount) {
    this.success(`+${amount} XP`, {
      icon: 'star',
      timeout: 2000,
      position: 'center',
    })
  }

  // Answer feedback
  static correctAnswer() {
    this.success('Chính xác! 🎉', {
      timeout: 2000,
      position: 'center',
    })
  }

  static wrongAnswer(correctAnswer) {
    this.error('Sai rồi! 😔', {
      caption: `Đáp án đúng: ${correctAnswer}`,
      timeout: 3000,
      position: 'center',
    })
  }

  // Friend request notifications
  static friendRequestSent(friendName) {
    this.success(`Đã gửi lời mời kết bạn đến ${friendName}`)
  }

  static friendRequestReceived(friendName) {
    this.info(`${friendName} đã gửi lời mời kết bạn`, {
      timeout: 8000,
      actions: [
        {
          label: 'Xem',
          color: 'white',
          handler: () => {
            // Navigate to friends page
            window.location.href = '/dashboard/friends'
          },
        },
      ],
    })
  }

  // Room notifications
  static roomJoined(roomName) {
    this.success(`Đã tham gia phòng "${roomName}"`)
  }

  static roomLeft() {
    this.info('Đã rời khỏi phòng')
  }

  static roomFull() {
    this.warning('Phòng đã đầy, không thể tham gia')
  }

  // Reward notifications
  static rewardRedeemed(rewardName, pointsUsed) {
    this.success(`Đã đổi thành công "${rewardName}"`, {
      caption: `Sử dụng ${pointsUsed} điểm`,
      timeout: 5000,
    })
  }

  static insufficientPoints(required, current) {
    this.warning(`Không đủ điểm! Cần ${required} điểm, bạn có ${current} điểm`)
  }

  // Offline notification
  static offline() {
    this.warning('Mất kết nối mạng. Một số tính năng có thể bị hạn chế.', {
      timeout: 0,
      icon: 'wifi_off',
    })
  }

  static online() {
    this.success('Đã kết nối lại mạng', {
      timeout: 2000,
      icon: 'wifi',
    })
  }

  // Custom notification fallback
  static createCustomNotification(message, type, duration = 3000) {
    if (typeof window === 'undefined') return

    // Import and use the custom notification utility
    import('../utils/notifications.js')
      .then(({ createNotification }) => {
        createNotification(message, type, duration)
      })
      .catch(() => {
        // Final fallback to console
        console.log(`${type.toUpperCase()}: ${message}`)
      })
  }
}

// Export as default and named export
export default NotificationService
export const notify = NotificationService
