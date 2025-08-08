import { db } from '../db/index.js'
import { users, vocabulary, questions, tasks, rewards, userTaskProgress } from '../db/schema.js'
import bcrypt from 'bcryptjs'

console.log('Seeding database...')

try {
  // Clear existing data (in development)
  console.log('Clearing existing data...')
  await db.delete(rewards)
  await db.delete(userTaskProgress)
  await db.delete(tasks)
  await db.delete(questions)
  await db.delete(vocabulary)
  await db.delete(users)

  // Seed users
  console.log('Seeding users...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  const seedUsers = await db
    .insert(users)
    .values([
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        avatar:
          'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
        level: 10,
        xp: 2500,
        streak: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'minhanh',
        email: 'minhanh@example.com',
        password: hashedPassword,
        name: 'Minh Anh',
        avatar:
          'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
        level: 8,
        xp: 1800,
        streak: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'thanhhoa',
        email: 'thanhhoa@example.com',
        password: hashedPassword,
        name: 'Thành Hòa',
        avatar:
          'https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb',
        level: 6,
        xp: 1200,
        streak: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    .returning()

  // Seed vocabulary
  console.log('Seeding vocabulary...')
  const seedVocabulary = await db
    .insert(vocabulary)
    .values([
      {
        word: 'beautiful',
        meaning: 'đẹp, xinh đẹp',
        pronunciation: '/ˈbjuːtɪf(ə)l/',
        example: 'She has beautiful eyes.',
        difficulty: 'easy',
        category: 'basic',
        createdAt: new Date(),
      },
      {
        word: 'intelligent',
        meaning: 'thông minh',
        pronunciation: '/ɪnˈtelɪdʒ(ə)nt/',
        example: 'He is a very intelligent student.',
        difficulty: 'medium',
        category: 'intermediate',
        createdAt: new Date(),
      },
      {
        word: 'magnificent',
        meaning: 'tuyệt vời, lộng lẫy',
        pronunciation: '/mæɡˈnɪfɪs(ə)nt/',
        example: 'The view from the mountain was magnificent.',
        difficulty: 'hard',
        category: 'advanced',
        createdAt: new Date(),
      },
      {
        word: 'happy',
        meaning: 'vui vẻ, hạnh phúc',
        pronunciation: '/ˈhæpi/',
        example: 'I am happy to see you.',
        difficulty: 'easy',
        category: 'basic',
        createdAt: new Date(),
      },
      {
        word: 'difficult',
        meaning: 'khó khăn',
        pronunciation: '/ˈdɪfɪk(ə)lt/',
        example: 'This problem is very difficult.',
        difficulty: 'medium',
        category: 'intermediate',
        createdAt: new Date(),
      },
      {
        word: 'extraordinary',
        meaning: 'phi thường, đặc biệt',
        pronunciation: '/ɪkˈstrɔːd(ɪ)n(ə)ri/',
        example: 'She has extraordinary talent.',
        difficulty: 'hard',
        category: 'advanced',
        createdAt: new Date(),
      },
    ])
    .returning()

  // Seed questions
  console.log('Seeding questions...')
  await db.insert(questions).values([
    {
      vocabularyId: seedVocabulary[0].id,
      question: "What does 'beautiful' mean?",
      correctAnswer: 'đẹp, xinh đẹp',
      wrongAnswers: JSON.stringify(['xấu xí', 'buồn bã', 'tức giận']),
      type: 'multiple_choice',
      difficulty: 'easy',
      createdAt: new Date(),
    },
    {
      vocabularyId: seedVocabulary[1].id,
      question: "What does 'intelligent' mean?",
      correctAnswer: 'thông minh',
      wrongAnswers: JSON.stringify(['ngu ngốc', 'lười biếng', 'yếu đuối']),
      type: 'multiple_choice',
      difficulty: 'medium',
      createdAt: new Date(),
    },
    {
      vocabularyId: seedVocabulary[2].id,
      question: "What does 'magnificent' mean?",
      correctAnswer: 'tuyệt vời, lộng lẫy',
      wrongAnswers: JSON.stringify(['tệ hại', 'bình thường', 'nhỏ bé']),
      type: 'multiple_choice',
      difficulty: 'hard',
      createdAt: new Date(),
    },
    {
      vocabularyId: seedVocabulary[3].id,
      question: "What does 'happy' mean?",
      correctAnswer: 'vui vẻ, hạnh phúc',
      wrongAnswers: JSON.stringify(['buồn bã', 'tức giận', 'sợ hãi']),
      type: 'multiple_choice',
      difficulty: 'easy',
      createdAt: new Date(),
    },
    {
      vocabularyId: seedVocabulary[4].id,
      question: "What does 'difficult' mean?",
      correctAnswer: 'khó khăn',
      wrongAnswers: JSON.stringify(['dễ dàng', 'đơn giản', 'nhanh chóng']),
      type: 'multiple_choice',
      difficulty: 'medium',
      createdAt: new Date(),
    },
    {
      vocabularyId: seedVocabulary[5].id,
      question: "What does 'extraordinary' mean?",
      correctAnswer: 'phi thường, đặc biệt',
      wrongAnswers: JSON.stringify(['bình thường', 'tệ hại', 'yếu ớt']),
      type: 'multiple_choice',
      difficulty: 'hard',
      createdAt: new Date(),
    },
  ])

  // Seed tasks
  console.log('Seeding tasks...')
  const seedTasks = await db
    .insert(tasks)
    .values([
      {
        title: 'Hoàn thành 5 câu hỏi',
        description: 'Trả lời đúng 5 câu hỏi từ vựng',
        target: 5,
        reward: 50,
        icon: 'quiz',
        type: 'daily',
        isActive: true,
        createdAt: new Date(),
      },
      {
        title: 'Đạt điểm hoàn hảo',
        description: 'Trả lời đúng 100% câu hỏi trong một thử thách',
        target: 1,
        reward: 100,
        icon: 'star',
        type: 'achievement',
        isActive: true,
        createdAt: new Date(),
      },
      {
        title: 'Duy trì chuỗi ngày học',
        description: 'Học liên tục trong 7 ngày',
        target: 7,
        reward: 200,
        icon: 'local_fire_department',
        type: 'weekly',
        isActive: true,
        createdAt: new Date(),
      },
      {
        title: 'Tham gia 3 thử thách',
        description: 'Tham gia và hoàn thành 3 thử thách trực tuyến',
        target: 3,
        reward: 75,
        icon: 'groups',
        type: 'daily',
        isActive: true,
        createdAt: new Date(),
      },
    ])
    .returning()

  // Seed task progress for first user
  await db.insert(userTaskProgress).values([
    {
      userId: seedUsers[0].id,
      taskId: seedTasks[0].id,
      current: 3,
      completed: false,
      claimed: false,
      createdAt: new Date(),
    },
    {
      userId: seedUsers[0].id,
      taskId: seedTasks[1].id,
      current: 0,
      completed: false,
      claimed: false,
      createdAt: new Date(),
    },
  ])

  // Seed rewards
  console.log('Seeding rewards...')
  await db.insert(rewards).values([
    {
      name: 'Voucher Shopee 50K',
      description: 'Phiếu mua hàng Shopee trị giá 50.000đ',
      cost: 500,
      stock: 25,
      category: 'vouchers',
      image: 'https://via.placeholder.com/200x150/FF6B35/FFFFFF?text=Shopee+50K',
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'Gói Premium 1 tháng',
      description: 'Truy cập không giới hạn tất cả tính năng premium',
      cost: 300,
      stock: 100,
      category: 'premium',
      image: 'https://via.placeholder.com/200x150/6366F1/FFFFFF?text=Premium',
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'Voucher Grab Food 30K',
      description: 'Phiếu giảm giá Grab Food trị giá 30.000đ',
      cost: 300,
      stock: 50,
      category: 'vouchers',
      image: 'https://via.placeholder.com/200x150/00B14F/FFFFFF?text=Grab+30K',
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'Sticker Pack Exclusive',
      description: 'Bộ sticker độc quyền cho ứng dụng',
      cost: 100,
      stock: 200,
      category: 'items',
      image: 'https://via.placeholder.com/200x150/F59E0B/FFFFFF?text=Stickers',
      isActive: true,
      createdAt: new Date(),
    },
  ])

  console.log('Database seeded successfully!')
  console.log(`Created ${seedUsers.length} users`)
  console.log(`Created ${seedVocabulary.length} vocabulary words`)
  console.log(`Created 6 questions`)
  console.log(`Created ${seedTasks.length} tasks`)
  console.log(`Created 4 rewards`)

  console.log('\nTest accounts:')
  console.log('Username: admin, Password: password123')
  console.log('Username: minhanh, Password: password123')
  console.log('Username: thanhhoa, Password: password123')
} catch (error) {
  console.error('Seeding failed:', error)
} finally {
  process.exit(0)
}
