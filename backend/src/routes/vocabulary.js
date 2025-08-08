import { Elysia, t } from 'elysia'
import { db } from '../db/index.js'
import { vocabulary, questions, userAnswers } from '../db/schema.js'
import { eq, inArray, sql } from 'drizzle-orm'

const vocabularyRoutes = new Elysia({ prefix: '/vocabulary' })
  .get(
    '/',
    async ({ query }) => {
      try {
        const { difficulty, category, limit = 50 } = query

        let queryBuilder = db.select().from(vocabulary)

        if (difficulty) {
          queryBuilder = queryBuilder.where(eq(vocabulary.difficulty, difficulty))
        }

        if (category) {
          queryBuilder = queryBuilder.where(eq(vocabulary.category, category))
        }

        const words = await queryBuilder.limit(parseInt(limit))

        return {
          success: true,
          vocabulary: words,
        }
      } catch (error) {
        console.error('Vocabulary fetch error:', error)
        return { success: false, message: 'Failed to fetch vocabulary' }
      }
    },
    {
      query: t.Object({
        difficulty: t.Optional(t.String()),
        category: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['vocabulary'],
        summary: 'Get vocabulary list',
        description: 'Get vocabulary with optional filtering',
      },
    },
  )

  .get(
    '/questions',
    async ({ query }) => {
      try {
        const { difficulty, count = 15, type = 'multiple_choice' } = query

        let queryBuilder = db
          .select({
            id: questions.id,
            question: questions.question,
            correctAnswer: questions.correctAnswer,
            wrongAnswers: questions.wrongAnswers,
            type: questions.type,
            difficulty: questions.difficulty,
            word: vocabulary.word,
            meaning: vocabulary.meaning,
          })
          .from(questions)
          .leftJoin(vocabulary, eq(questions.vocabularyId, vocabulary.id))

        if (difficulty) {
          queryBuilder = queryBuilder.where(eq(questions.difficulty, difficulty))
        }

        if (type) {
          queryBuilder = queryBuilder.where(eq(questions.type, type))
        }

        // Get random questions
        const questionsData = await queryBuilder.orderBy(sql`RANDOM()`).limit(parseInt(count))

        // Format questions for frontend
        const formattedQuestions = questionsData.map((q) => {
          const wrongAnswers = JSON.parse(q.wrongAnswers || '[]')
          const allAnswers = [
            { text: q.correctAnswer, correct: true },
            ...wrongAnswers.map((answer) => ({ text: answer, correct: false })),
          ]

          // Shuffle answers
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5)

          return {
            id: q.id,
            question: q.question,
            word: q.word,
            meaning: q.meaning,
            answers: shuffledAnswers,
            difficulty: q.difficulty,
            type: q.type,
          }
        })

        return {
          success: true,
          questions: formattedQuestions,
        }
      } catch (error) {
        console.error('Questions fetch error:', error)
        return { success: false, message: 'Failed to fetch questions' }
      }
    },
    {
      query: t.Object({
        difficulty: t.Optional(t.String()),
        count: t.Optional(t.String()),
        type: t.Optional(t.String()),
      }),
      detail: {
        tags: ['vocabulary'],
        summary: 'Get quiz questions',
        description: 'Get random quiz questions for challenges',
      },
    },
  )

  .post(
    '/questions/:id/answer',
    async ({ params, body, user, set }) => {
      try {
        const { id } = params
        const { answer, timeSpent, roomId } = body

        // Get the question
        const question = await db
          .select()
          .from(questions)
          .where(eq(questions.id, parseInt(id)))
          .get()

        if (!question) {
          set.status = 404
          return { success: false, message: 'Question not found' }
        }

        const isCorrect = answer === question.correctAnswer

        // Save user answer (if roomId provided, it's part of a game)
        if (roomId) {
          await db.insert(userAnswers).values({
            roomId: parseInt(roomId),
            userId: user.id,
            questionId: parseInt(id),
            answer,
            isCorrect,
            timeSpent: timeSpent || 0,
            answeredAt: new Date(),
          })
        }

        return {
          success: true,
          correct: isCorrect,
          correctAnswer: question.correctAnswer,
          explanation: isCorrect ? 'Correct!' : `The correct answer is: ${question.correctAnswer}`,
        }
      } catch (error) {
        console.error('Answer submission error:', error)
        set.status = 500
        return { success: false, message: 'Failed to submit answer' }
      }
    },
    {
      body: t.Object({
        answer: t.String(),
        timeSpent: t.Optional(t.Number()),
        roomId: t.Optional(t.Number()),
      }),
      detail: {
        tags: ['vocabulary'],
        summary: 'Submit question answer',
        description: 'Submit answer for a question',
      },
    },
  )

export default vocabularyRoutes
