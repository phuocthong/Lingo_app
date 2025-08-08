import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  level: integer('level').default(1),
  xp: integer('xp').default(0),
  streak: integer('streak').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Vocabulary/Words table
export const vocabulary = sqliteTable('vocabulary', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  word: text('word').notNull(),
  meaning: text('meaning').notNull(),
  pronunciation: text('pronunciation'),
  example: text('example'),
  difficulty: text('difficulty').notNull(), // 'easy', 'medium', 'hard'
  category: text('category').notNull(), // 'basic', 'intermediate', 'advanced'
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Questions table
export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vocabularyId: integer('vocabulary_id').references(() => vocabulary.id),
  question: text('question').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  wrongAnswers: text('wrong_answers').notNull(), // JSON array of wrong answers
  type: text('type').notNull().default('multiple_choice'), // 'multiple_choice', 'fill_blank', etc.
  difficulty: text('difficulty').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Rooms table
export const rooms = sqliteTable('rooms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  ownerId: integer('owner_id').references(() => users.id),
  maxPlayers: integer('max_players').notNull().default(6),
  questionCount: integer('question_count').notNull().default(15),
  timePerQuestion: integer('time_per_question').notNull().default(30), // seconds
  status: text('status').notNull().default('waiting'), // 'waiting', 'playing', 'finished'
  currentQuestion: integer('current_question').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  finishedAt: integer('finished_at', { mode: 'timestamp' }),
})

// Room participants table
export const roomParticipants = sqliteTable('room_participants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').references(() => rooms.id),
  userId: integer('user_id').references(() => users.id),
  score: integer('score').default(0),
  streak: integer('streak').default(0),
  rank: integer('rank'),
  status: text('status').default('waiting'), // 'waiting', 'playing', 'finished'
  joinedAt: integer('joined_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// User answers table (for tracking individual answers in games)
export const userAnswers = sqliteTable('user_answers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').references(() => rooms.id),
  userId: integer('user_id').references(() => users.id),
  questionId: integer('question_id').references(() => questions.id),
  answer: text('answer').notNull(),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull(),
  timeSpent: integer('time_spent'), // milliseconds
  answeredAt: integer('answered_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Tasks table
export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  target: integer('target').notNull(),
  reward: integer('reward').notNull(), // XP points
  icon: text('icon').notNull(),
  type: text('type').notNull(), // 'daily', 'weekly', 'achievement'
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// User task progress table
export const userTaskProgress = sqliteTable('user_task_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  taskId: integer('task_id').references(() => tasks.id),
  current: integer('current').default(0),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  claimed: integer('claimed', { mode: 'boolean' }).default(false),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  claimedAt: integer('claimed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Friends table
export const friends = sqliteTable('friends', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  friendId: integer('friend_id').references(() => users.id),
  status: text('status').notNull().default('pending'), // 'pending', 'accepted', 'blocked'
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  acceptedAt: integer('accepted_at', { mode: 'timestamp' }),
})

// Rewards table
export const rewards = sqliteTable('rewards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  cost: integer('cost').notNull(), // points required
  stock: integer('stock').notNull(),
  category: text('category').notNull(), // 'vouchers', 'items', 'premium'
  image: text('image'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// User transactions table (for reward redemptions)
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  rewardId: integer('reward_id').references(() => rewards.id),
  cost: integer('cost').notNull(),
  status: text('status').notNull().default('completed'), // 'completed', 'pending', 'failed'
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// User progress tracking table
export const userProgress = sqliteTable('user_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  date: text('date').notNull(), // YYYY-MM-DD format
  questionsAnswered: integer('questions_answered').default(0),
  correctAnswers: integer('correct_answers').default(0),
  wrongAnswers: integer('wrong_answers').default(0),
  xpEarned: integer('xp_earned').default(0),
  timeSpent: integer('time_spent').default(0), // minutes
  streakMaintained: integer('streak_maintained', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  roomsOwned: many(rooms),
  roomParticipations: many(roomParticipants),
  userAnswers: many(userAnswers),
  taskProgress: many(userTaskProgress),
  friendsRequested: many(friends, { relationName: 'user' }),
  friendsReceived: many(friends, { relationName: 'friend' }),
  transactions: many(transactions),
  progress: many(userProgress),
}))

export const vocabularyRelations = relations(vocabulary, ({ many }) => ({
  questions: many(questions),
}))

export const questionsRelations = relations(questions, ({ one, many }) => ({
  vocabulary: one(vocabulary, {
    fields: [questions.vocabularyId],
    references: [vocabulary.id],
  }),
  userAnswers: many(userAnswers),
}))

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  owner: one(users, {
    fields: [rooms.ownerId],
    references: [users.id],
  }),
  participants: many(roomParticipants),
  userAnswers: many(userAnswers),
}))

export const roomParticipantsRelations = relations(roomParticipants, ({ one }) => ({
  room: one(rooms, {
    fields: [roomParticipants.roomId],
    references: [rooms.id],
  }),
  user: one(users, {
    fields: [roomParticipants.userId],
    references: [users.id],
  }),
}))

export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  room: one(rooms, {
    fields: [userAnswers.roomId],
    references: [rooms.id],
  }),
  user: one(users, {
    fields: [userAnswers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [userAnswers.questionId],
    references: [questions.id],
  }),
}))

export const tasksRelations = relations(tasks, ({ many }) => ({
  userProgress: many(userTaskProgress),
}))

export const userTaskProgressRelations = relations(userTaskProgress, ({ one }) => ({
  user: one(users, {
    fields: [userTaskProgress.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [userTaskProgress.taskId],
    references: [tasks.id],
  }),
}))

export const friendsRelations = relations(friends, ({ one }) => ({
  user: one(users, {
    fields: [friends.userId],
    references: [users.id],
    relationName: 'user',
  }),
  friend: one(users, {
    fields: [friends.friendId],
    references: [users.id],
    relationName: 'friend',
  }),
}))

export const rewardsRelations = relations(rewards, ({ many }) => ({
  transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  reward: one(rewards, {
    fields: [transactions.rewardId],
    references: [rewards.id],
  }),
}))

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}))
