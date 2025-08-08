import { apiService } from './api.js'
import { auth } from '../utils/auth.js'

export class ChatService {
  constructor() {
    this.currentQuestion = null
    this.questionTimer = null
    this.answerTimer = null
    this.participants = new Set()
    this.questionHistory = []
    this.answersReceived = new Map()
    this.botInterval = null
    this.isActive = false
  }

  // Start the chat bot session
  async startBot() {
    if (this.isActive) return

    this.isActive = true
    console.log('🤖 Chat bot started')

    // Send welcome message
    this.sendBotMessage(
      'Xin chào! Tôi là EnglishBot. Tôi sẽ đưa ra các câu hỏi tiếng Anh định kỳ để các bạn trả lời.',
    )

    // Start asking questions every 30-60 seconds
    this.scheduleNextQuestion()
  }

  // Stop the chat bot
  stopBot() {
    this.isActive = false
    if (this.botInterval) {
      clearTimeout(this.botInterval)
      this.botInterval = null
    }
    if (this.questionTimer) {
      clearTimeout(this.questionTimer)
      this.questionTimer = null
    }
    if (this.answerTimer) {
      clearTimeout(this.answerTimer)
      this.answerTimer = null
    }
    console.log('🤖 Chat bot stopped')
  }

  // Schedule the next question
  scheduleNextQuestion() {
    if (!this.isActive) return

    // Random interval between 30-60 seconds
    const interval = Math.random() * 30000 + 30000

    this.botInterval = setTimeout(() => {
      if (this.isActive) {
        this.askQuestion()
      }
    }, interval)
  }

  // Ask a new question
  async askQuestion() {
    try {
      // Get a random question from API (works in demo mode too)
      const response = await apiService.getQuestions({ count: 1, difficulty: 'easy' })

      if (response.success && response.questions.length > 0) {
        this.currentQuestion = response.questions[0]
        this.answersReceived.clear()

        // Send question to chat
        this.sendBotMessage(this.currentQuestion.question, true)

        // Set timer for showing answer (20 seconds)
        this.answerTimer = setTimeout(() => {
          this.showCorrectAnswer()
        }, 20000)

        // Add to history
        this.addToHistory(this.currentQuestion)
      } else {
        // Use fallback question if no questions returned
        this.askFallbackQuestion()
      }
    } catch (error) {
      console.error('Failed to get question:', error)
      // Use fallback question
      this.askFallbackQuestion()
    }
  }

  // Ask fallback question if API fails
  askFallbackQuestion() {
    const fallbackQuestions = [
      {
        id: 'fallback_1',
        question: 'Dịch từ "Beautiful" sang tiếng Việt',
        correctAnswer: 'đẹp',
        answers: [
          { text: 'đẹp', correct: true },
          { text: 'xấu', correct: false },
          { text: 'cao', correct: false },
          { text: 'thấp', correct: false },
        ],
      },
      {
        id: 'fallback_2',
        question: 'Dịch từ "Happy" sang tiếng Việt',
        correctAnswer: 'hạnh phúc',
        answers: [
          { text: 'hạnh phúc', correct: true },
          { text: 'buồn', correct: false },
          { text: 'tức giận', correct: false },
          { text: 'sợ hãi', correct: false },
        ],
      },
    ]

    this.currentQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]
    this.answersReceived.clear()

    this.sendBotMessage(this.currentQuestion.question, true)

    this.answerTimer = setTimeout(() => {
      this.showCorrectAnswer()
    }, 20000)

    this.addToHistory(this.currentQuestion)
  }

  // Handle user answer
  async handleAnswer(answer, userName = 'Người dùng') {
    if (!this.currentQuestion) return

    const user = auth.getCurrentUser()
    const timestamp = new Date()

    // Record answer locally
    this.answersReceived.set(userName, {
      answer,
      timestamp,
      user: userName,
      avatar:
        user?.name
          ?.split(' ')
          .map((n) => n[0])
          .join('') || 'ND',
    })

    // Try to submit to API if user is logged in
    if (user && this.currentQuestion.id) {
      try {
        const response = await apiService.submitAnswer(this.currentQuestion.id, {
          answer,
          timeSpent: 15000, // Approximate time
        })

        if (response.success) {
          // Update user progress
          await this.updateUserProgress(response.correct)
        }
      } catch (error) {
        console.error('Failed to submit answer to API:', error)
      }
    }

    // Show visual feedback
    this.showAnswerFeedback(userName, answer)
  }

  // Show correct answer
  showCorrectAnswer() {
    if (!this.currentQuestion) return

    const correctAnswer =
      this.currentQuestion.correctAnswer ||
      this.currentQuestion.answers?.find((a) => a.correct)?.text

    if (correctAnswer) {
      this.sendAnswerDisplay(`Đáp án đúng là: "${correctAnswer}"`)
    }

    // Update question history with results
    this.updateHistoryWithResults()

    // Schedule next question
    this.scheduleNextQuestion()

    // Clear current question
    this.currentQuestion = null
  }

  // Add question to history
  addToHistory(question) {
    const historyItem = {
      id: question.id || Date.now(),
      question: question.question,
      correctAnswer: question.correctAnswer || question.answers?.find((a) => a.correct)?.text,
      timestamp: new Date(),
      participants: [],
      stats: {
        totalAnswers: 0,
        correctAnswers: 0,
      },
    }

    this.questionHistory.unshift(historyItem)

    // Keep only last 20 questions
    if (this.questionHistory.length > 20) {
      this.questionHistory = this.questionHistory.slice(0, 20)
    }
  }

  // Update history with answer results
  updateHistoryWithResults() {
    if (this.questionHistory.length === 0) return

    const currentItem = this.questionHistory[0]
    const participants = Array.from(this.answersReceived.values())

    currentItem.participants = participants.map((p, index) => ({
      id: index + 1,
      name: p.user,
      avatar: p.avatar,
      time: this.formatResponseTime(p.timestamp),
      correct: this.isAnswerCorrect(p.answer),
    }))

    currentItem.stats = {
      totalAnswers: participants.length,
      correctAnswers: participants.filter((p) => this.isAnswerCorrect(p.answer)).length,
    }
  }

  // Check if answer is correct
  isAnswerCorrect(answer) {
    if (!this.currentQuestion) return false

    const correctAnswer =
      this.currentQuestion.correctAnswer ||
      this.currentQuestion.answers?.find((a) => a.correct)?.text

    return answer.toLowerCase().trim() === correctAnswer?.toLowerCase().trim()
  }

  // Format response time
  formatResponseTime(timestamp) {
    const now = new Date()
    const diff = Math.floor((now - timestamp) / 1000)
    return `${Math.max(1, 20 - diff)}.${Math.floor(Math.random() * 10)}s`
  }

  // Update user progress
  async updateUserProgress(isCorrect) {
    try {
      const user = auth.getCurrentUser()
      if (!user) return

      // Try to record progress (works in demo mode)
      try {
        await apiService.recordProgress({
          questionsAnswered: 1,
          correctAnswers: isCorrect ? 1 : 0,
          xpEarned: isCorrect ? 10 : 2,
          timeSpent: 1, // 1 minute
        })

        // Update task progress
        await apiService.updateTaskProgress(1) // Complete questions task
      } catch (apiError) {
        console.log('API not available, updating locally only')
      }

      if (isCorrect) {
        // Update user XP locally
        const updatedUser = { ...user, xp: user.xp + 10 }
        auth.updateLocalUser(updatedUser)
      }
    } catch (error) {
      console.error('Failed to update user progress:', error)
    }
  }

  // Send bot message (to be handled by chat component)
  sendBotMessage(message, isQuestion = false) {
    const event = new CustomEvent('botMessage', {
      detail: {
        message,
        isQuestion,
        timestamp: new Date(),
        participants: isQuestion ? this.generateMockParticipants() : null,
      },
    })
    window.dispatchEvent(event)
  }

  // Send answer display (to be handled by chat component)
  sendAnswerDisplay(message) {
    const event = new CustomEvent('answerDisplay', {
      detail: {
        message,
        timestamp: new Date(),
      },
    })
    window.dispatchEvent(event)
  }

  // Show answer feedback
  showAnswerFeedback(userName, answer) {
    const event = new CustomEvent('answerFeedback', {
      detail: {
        userName,
        answer,
        timestamp: new Date(),
      },
    })
    window.dispatchEvent(event)
  }

  // Generate mock participants for visual effect
  generateMockParticipants() {
    const mockUsers = [
      'https://api.builder.io/api/v1/image/assets/TEMP/94861390f9be0eb42544493a89935a3e8537e779?width=38',
      'https://api.builder.io/api/v1/image/assets/TEMP/808cc85b683761b4f2649b219713e811950b7da6?width=38',
      'https://api.builder.io/api/v1/image/assets/TEMP/d0b0d0d7bf9e895d63b544b8849b7b88a157a184?width=38',
    ]

    // Randomly select 2-3 participants
    const count = Math.floor(Math.random() * 2) + 2
    return mockUsers.slice(0, count)
  }

  // Get question history
  getHistory() {
    return this.questionHistory
  }

  // Get current question
  getCurrentQuestion() {
    return this.currentQuestion
  }

  // Check if bot is active
  isActive() {
    return this.isActive
  }
}

// Export singleton instance
export const chatService = new ChatService()
export default chatService
