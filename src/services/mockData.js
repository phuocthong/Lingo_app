// Mock data for demo mode when backend is not available

export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    name: 'Admin User',
    avatar:
      'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
    level: 10,
    xp: 2500,
    streak: 15,
  },
  {
    id: 2,
    username: 'minhanh',
    name: 'Minh Anh',
    avatar:
      'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
    level: 8,
    xp: 1800,
    streak: 12,
  },
  {
    id: 3,
    username: 'thanhhoa',
    name: 'Thành Hòa',
    avatar:
      'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
    level: 6,
    xp: 1200,
    streak: 8,
  },
  {
    id: 4,
    username: 'vannam',
    name: 'Văn Nam',
    avatar:
      'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
    level: 7,
    xp: 1500,
    streak: 10,
  },
  {
    id: 5,
    username: 'thutrang',
    name: 'Thu Trang',
    avatar:
      'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
    level: 9,
    xp: 2100,
    streak: 18,
  },
]

export const mockLeaderboardData = {
  week: [
    {
      rank: 1,
      user: { id: 5, name: 'Thu Trang' },
      stats: { totalXp: 156, accuracy: 92, totalQuestions: 45, totalCorrect: 41 },
    },
    {
      rank: 2,
      user: { id: 2, name: 'Minh Anh' },
      stats: { totalXp: 142, accuracy: 88, totalQuestions: 52, totalCorrect: 46 },
    },
    {
      rank: 3,
      user: { id: 4, name: 'Văn Nam' },
      stats: { totalXp: 138, accuracy: 85, totalQuestions: 48, totalCorrect: 41 },
    },
    {
      rank: 4,
      user: { id: 3, name: 'Thành Hòa' },
      stats: { totalXp: 125, accuracy: 90, totalQuestions: 38, totalCorrect: 34 },
    },
    {
      rank: 5,
      user: { id: 1, name: 'Admin User' },
      stats: { totalXp: 98, accuracy: 87, totalQuestions: 35, totalCorrect: 30 },
    },
  ],
  month: [
    {
      rank: 1,
      user: { id: 3, name: 'Thành Hòa' },
      stats: { totalXp: 487, accuracy: 90, totalQuestions: 180, totalCorrect: 162 },
    },
    {
      rank: 2,
      user: { id: 2, name: 'Minh Anh' },
      stats: { totalXp: 445, accuracy: 88, totalQuestions: 195, totalCorrect: 172 },
    },
    {
      rank: 3,
      user: { id: 4, name: 'Văn Nam' },
      stats: { totalXp: 398, accuracy: 85, totalQuestions: 165, totalCorrect: 140 },
    },
    {
      rank: 4,
      user: { id: 5, name: 'Thu Trang' },
      stats: { totalXp: 367, accuracy: 92, totalQuestions: 148, totalCorrect: 136 },
    },
    {
      rank: 5,
      user: { id: 1, name: 'Admin User' },
      stats: { totalXp: 324, accuracy: 87, totalQuestions: 142, totalCorrect: 123 },
    },
  ],
  year: [
    {
      rank: 1,
      user: { id: 2, name: 'Minh Anh' },
      stats: { totalXp: 2456, accuracy: 88, totalQuestions: 1254, totalCorrect: 1103 },
    },
    {
      rank: 2,
      user: { id: 3, name: 'Thành Hòa' },
      stats: { totalXp: 2195, accuracy: 90, totalQuestions: 1098, totalCorrect: 988 },
    },
    {
      rank: 3,
      user: { id: 4, name: 'Văn Nam' },
      stats: { totalXp: 1957, accuracy: 85, totalQuestions: 1145, totalCorrect: 973 },
    },
    {
      rank: 4,
      user: { id: 5, name: 'Thu Trang' },
      stats: { totalXp: 1834, accuracy: 92, totalQuestions: 892, totalCorrect: 821 },
    },
    {
      rank: 5,
      user: { id: 1, name: 'Admin User' },
      stats: { totalXp: 1698, accuracy: 87, totalQuestions: 978, totalCorrect: 851 },
    },
  ],
}

export const mockQuestions = [
  {
    id: 1,
    question: "What does 'beautiful' mean?",
    word: 'beautiful',
    meaning: 'đẹp, xinh đẹp',
    answers: [
      { text: 'đẹp, xinh đẹp', correct: true },
      { text: 'xấu xí', correct: false },
      { text: 'buồn bã', correct: false },
      { text: 'tức giận', correct: false },
    ],
    difficulty: 'easy',
    type: 'multiple_choice',
  },
  {
    id: 2,
    question: "What does 'intelligent' mean?",
    word: 'intelligent',
    meaning: 'thông minh',
    answers: [
      { text: 'thông minh', correct: true },
      { text: 'ngu ngốc', correct: false },
      { text: 'lười biếng', correct: false },
      { text: 'yếu đuối', correct: false },
    ],
    difficulty: 'medium',
    type: 'multiple_choice',
  },
  {
    id: 3,
    question: "What does 'happy' mean?",
    word: 'happy',
    meaning: 'vui vẻ, hạnh phúc',
    answers: [
      { text: 'vui vẻ, hạnh phúc', correct: true },
      { text: 'buồn bã', correct: false },
      { text: 'tức giận', correct: false },
      { text: 'sợ hãi', correct: false },
    ],
    difficulty: 'easy',
    type: 'multiple_choice',
  },
  {
    id: 4,
    question: "What does 'wonderful' mean?",
    word: 'wonderful',
    meaning: 'tuyệt vời',
    answers: [
      { text: 'tuyệt vời', correct: true },
      { text: 'tệ hại', correct: false },
      { text: 'bình thường', correct: false },
      { text: 'khó hiểu', correct: false },
    ],
    difficulty: 'easy',
    type: 'multiple_choice',
  },
]

export const mockTasks = [
  {
    id: 1,
    title: 'Hoàn thành 5 câu hỏi',
    description: 'Trả lời đúng 5 câu hỏi từ vựng',
    current: 3,
    target: 5,
    progress: 60,
    reward: 50,
    icon: 'quiz',
    type: 'daily',
    completed: false,
    claimed: false,
    canClaim: false,
  },
  {
    id: 2,
    title: 'Đạt điểm hoàn hảo',
    description: 'Trả lời đúng 100% câu hỏi trong một thử thách',
    current: 0,
    target: 1,
    progress: 0,
    reward: 100,
    icon: 'star',
    type: 'achievement',
    completed: false,
    claimed: false,
    canClaim: false,
  },
  {
    id: 3,
    title: 'Duy trì chuỗi ngày học',
    description: 'Học liên tục trong 7 ngày',
    current: 3,
    target: 7,
    progress: 43,
    reward: 200,
    icon: 'local_fire_department',
    type: 'weekly',
    completed: false,
    claimed: false,
    canClaim: false,
  },
]

// Mock API response functions
export const getMockLeaderboard = (period = 'week', limit = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = mockLeaderboardData[period] || mockLeaderboardData.week
      resolve({
        success: true,
        leaderboard: data.slice(0, limit),
        period,
      })
    }, 300) // Simulate network delay
  })
}

export const getMockQuestions = (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { count = 1, difficulty, type = 'multiple_choice' } = params
      let questions = [...mockQuestions]

      if (difficulty) {
        questions = questions.filter((q) => q.difficulty === difficulty)
      }

      if (type) {
        questions = questions.filter((q) => q.type === type)
      }

      // Shuffle and limit
      questions = questions.sort(() => Math.random() - 0.5).slice(0, parseInt(count))

      resolve({
        success: true,
        questions,
      })
    }, 200)
  })
}

export const getMockTasks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        tasks: mockTasks,
      })
    }, 200)
  })
}

export const mockSubmitAnswer = (questionId, answerData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const question = mockQuestions.find((q) => q.id === parseInt(questionId))
      if (!question) {
        resolve({ success: false, message: 'Question not found' })
        return
      }

      const isCorrect = answerData.answer === question.answers.find((a) => a.correct)?.text

      resolve({
        success: true,
        correct: isCorrect,
        correctAnswer: question.answers.find((a) => a.correct)?.text,
        explanation: isCorrect
          ? 'Correct!'
          : `The correct answer is: ${question.answers.find((a) => a.correct)?.text}`,
      })
    }, 100)
  })
}
