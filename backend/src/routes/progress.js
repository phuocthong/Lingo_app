import { Elysia, t } from 'elysia'
import { db } from '../db/index.js'
import { userProgress, users } from '../db/schema.js'
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm'

const progressRoutes = new Elysia({ prefix: '/progress' })
  .get(
    '/',
    async ({ user, query }) => {
      try {
        const { startDate, endDate, period = 'week' } = query

        let dateFilter = {}
        if (startDate && endDate) {
          dateFilter = and(gte(userProgress.date, startDate), lte(userProgress.date, endDate))
        } else {
          // Default to last 30 days
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          dateFilter = gte(userProgress.date, thirtyDaysAgo.toISOString().split('T')[0])
        }

        const progressData = await db
          .select()
          .from(userProgress)
          .where(and(eq(userProgress.userId, user.id), dateFilter))
          .orderBy(desc(userProgress.date))

        // Calculate aggregated stats
        const totalStats = progressData.reduce(
          (acc, day) => ({
            questionsAnswered: acc.questionsAnswered + day.questionsAnswered,
            correctAnswers: acc.correctAnswers + day.correctAnswers,
            wrongAnswers: acc.wrongAnswers + day.wrongAnswers,
            xpEarned: acc.xpEarned + day.xpEarned,
            timeSpent: acc.timeSpent + day.timeSpent,
          }),
          {
            questionsAnswered: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            xpEarned: 0,
            timeSpent: 0,
          },
        )

        const accuracy =
          totalStats.questionsAnswered > 0
            ? (totalStats.correctAnswers / totalStats.questionsAnswered) * 100
            : 0

        const averageTime =
          totalStats.questionsAnswered > 0 ? totalStats.timeSpent / totalStats.questionsAnswered : 0

        return {
          success: true,
          progress: {
            daily: progressData,
            summary: {
              totalQuestions: totalStats.questionsAnswered,
              correctAnswers: totalStats.correctAnswers,
              accuracy: Math.round(accuracy * 100) / 100,
              totalXp: totalStats.xpEarned,
              totalTimeSpent: totalStats.timeSpent,
              averageTimePerQuestion: Math.round(averageTime * 100) / 100,
              streakDays: progressData.filter((d) => d.streakMaintained).length,
            },
          },
        }
      } catch (error) {
        console.error('Progress fetch error:', error)
        return { success: false, message: 'Failed to fetch progress' }
      }
    },
    {
      query: t.Object({
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
        period: t.Optional(t.String()),
      }),
      detail: {
        tags: ['progress'],
        summary: 'Get user progress',
        description: 'Get user learning progress and statistics',
      },
    },
  )

  .post(
    '/record',
    async ({ body, user, set }) => {
      try {
        const {
          questionsAnswered,
          correctAnswers,
          xpEarned,
          timeSpent,
          date = new Date().toISOString().split('T')[0],
        } = body

        const wrongAnswers = questionsAnswered - correctAnswers

        // Check if progress record exists for this date
        const existingProgress = await db
          .select()
          .from(userProgress)
          .where(and(eq(userProgress.userId, user.id), eq(userProgress.date, date)))
          .get()

        if (existingProgress) {
          // Update existing record
          await db
            .update(userProgress)
            .set({
              questionsAnswered: existingProgress.questionsAnswered + questionsAnswered,
              correctAnswers: existingProgress.correctAnswers + correctAnswers,
              wrongAnswers: existingProgress.wrongAnswers + wrongAnswers,
              xpEarned: existingProgress.xpEarned + xpEarned,
              timeSpent: existingProgress.timeSpent + timeSpent,
              streakMaintained: true, // Simple streak logic
            })
            .where(and(eq(userProgress.userId, user.id), eq(userProgress.date, date)))
        } else {
          // Create new record
          await db.insert(userProgress).values({
            userId: user.id,
            date,
            questionsAnswered,
            correctAnswers,
            wrongAnswers,
            xpEarned,
            timeSpent,
            streakMaintained: true,
            createdAt: new Date(),
          })
        }

        return {
          success: true,
          message: 'Progress recorded successfully',
        }
      } catch (error) {
        console.error('Progress record error:', error)
        set.status = 500
        return { success: false, message: 'Failed to record progress' }
      }
    },
    {
      body: t.Object({
        questionsAnswered: t.Number({ minimum: 0 }),
        correctAnswers: t.Number({ minimum: 0 }),
        xpEarned: t.Number({ minimum: 0 }),
        timeSpent: t.Number({ minimum: 0 }),
        date: t.Optional(t.String()),
      }),
      detail: {
        tags: ['progress'],
        summary: 'Record daily progress',
        description: 'Record user daily learning progress',
      },
    },
  )

  .get(
    '/leaderboard',
    async ({ query }) => {
      try {
        const { period = 'week', limit = 10 } = query

        // Calculate date range based on period
        let dateThreshold = new Date()
        switch (period) {
          case 'day':
            dateThreshold.setDate(dateThreshold.getDate() - 1)
            break
          case 'week':
            dateThreshold.setDate(dateThreshold.getDate() - 7)
            break
          case 'month':
            dateThreshold.setMonth(dateThreshold.getMonth() - 1)
            break
          default:
            dateThreshold.setDate(dateThreshold.getDate() - 7)
        }

        const leaderboardData = await db
          .select({
            userId: userProgress.userId,
            username: users.username,
            name: users.name,
            avatar: users.avatar,
            level: users.level,
            totalXp: sql`SUM(${userProgress.xpEarned})`,
            totalQuestions: sql`SUM(${userProgress.questionsAnswered})`,
            totalCorrect: sql`SUM(${userProgress.correctAnswers})`,
          })
          .from(userProgress)
          .leftJoin(users, eq(userProgress.userId, users.id))
          .where(gte(userProgress.date, dateThreshold.toISOString().split('T')[0]))
          .groupBy(userProgress.userId, users.username, users.name, users.avatar, users.level)
          .orderBy(desc(sql`SUM(${userProgress.xpEarned})`))
          .limit(parseInt(limit))

        const formattedLeaderboard = leaderboardData.map((entry, index) => ({
          rank: index + 1,
          user: {
            id: entry.userId,
            username: entry.username,
            name: entry.name,
            avatar: entry.avatar,
            level: entry.level,
          },
          stats: {
            totalXp: parseInt(entry.totalXp) || 0,
            totalQuestions: parseInt(entry.totalQuestions) || 0,
            totalCorrect: parseInt(entry.totalCorrect) || 0,
            accuracy:
              entry.totalQuestions > 0
                ? Math.round((entry.totalCorrect / entry.totalQuestions) * 100)
                : 0,
          },
        }))

        return {
          success: true,
          leaderboard: formattedLeaderboard,
          period,
        }
      } catch (error) {
        console.error('Leaderboard fetch error:', error)
        return { success: false, message: 'Failed to fetch leaderboard' }
      }
    },
    {
      query: t.Object({
        period: t.Optional(t.String()),
        limit: t.Optional(t.String()),
      }),
      detail: {
        tags: ['progress'],
        summary: 'Get leaderboard',
        description: 'Get leaderboard rankings based on XP earned',
      },
    },
  )

export default progressRoutes
