import { Elysia, t } from 'elysia'
import { db } from '../db/index.js'
import { rewards, transactions, users } from '../db/schema.js'
import { eq, and, desc } from 'drizzle-orm'

const rewardRoutes = new Elysia({ prefix: '/rewards' })
  .get(
    '/',
    async ({ query }) => {
      try {
        const { category } = query

        let queryBuilder = db.select().from(rewards).where(eq(rewards.isActive, true))

        if (category) {
          queryBuilder = queryBuilder.where(eq(rewards.category, category))
        }

        const rewardsList = await queryBuilder.orderBy(rewards.cost)

        return {
          success: true,
          rewards: rewardsList,
        }
      } catch (error) {
        console.error('Rewards fetch error:', error)
        return { success: false, message: 'Failed to fetch rewards' }
      }
    },
    {
      query: t.Object({
        category: t.Optional(t.String()),
      }),
      detail: {
        tags: ['rewards'],
        summary: 'Get available rewards',
        description: 'Get list of available rewards for redemption',
      },
    },
  )

  .post(
    '/:id/redeem',
    async ({ params, user, set }) => {
      try {
        const rewardId = parseInt(params.id)

        // Get reward details
        const reward = await db
          .select()
          .from(rewards)
          .where(and(eq(rewards.id, rewardId), eq(rewards.isActive, true)))
          .get()

        if (!reward) {
          set.status = 404
          return { success: false, message: 'Reward not found' }
        }

        // Check if user has enough points (XP)
        if (user.xp < reward.cost) {
          set.status = 400
          return {
            success: false,
            message: `Insufficient points. You need ${reward.cost} points but have ${user.xp}`,
          }
        }

        // Check stock
        if (reward.stock <= 0) {
          set.status = 400
          return { success: false, message: 'Reward is out of stock' }
        }

        // Start transaction
        try {
          // Deduct points from user
          await db
            .update(users)
            .set({
              xp: user.xp - reward.cost,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))

          // Reduce stock
          await db
            .update(rewards)
            .set({
              stock: reward.stock - 1,
            })
            .where(eq(rewards.id, rewardId))

          // Create transaction record
          const transaction = await db
            .insert(transactions)
            .values({
              userId: user.id,
              rewardId,
              cost: reward.cost,
              status: 'completed',
              createdAt: new Date(),
            })
            .returning()
            .get()

          return {
            success: true,
            message: 'Reward redeemed successfully',
            transaction: {
              id: transaction.id,
              reward: {
                name: reward.name,
                description: reward.description,
                cost: reward.cost,
              },
              redeemedAt: transaction.createdAt,
            },
            newBalance: user.xp - reward.cost,
          }
        } catch (transactionError) {
          console.error('Transaction error:', transactionError)
          set.status = 500
          return { success: false, message: 'Transaction failed' }
        }
      } catch (error) {
        console.error('Reward redemption error:', error)
        set.status = 500
        return { success: false, message: 'Failed to redeem reward' }
      }
    },
    {
      detail: {
        tags: ['rewards'],
        summary: 'Redeem reward',
        description: 'Redeem a reward using points',
      },
    },
  )

  .get(
    '/transactions',
    async ({ user, query }) => {
      try {
        const { limit = 20, offset = 0 } = query

        const userTransactions = await db
          .select({
            id: transactions.id,
            cost: transactions.cost,
            status: transactions.status,
            createdAt: transactions.createdAt,
            reward: {
              id: rewards.id,
              name: rewards.name,
              description: rewards.description,
              category: rewards.category,
              image: rewards.image,
            },
          })
          .from(transactions)
          .leftJoin(rewards, eq(transactions.rewardId, rewards.id))
          .where(eq(transactions.userId, user.id))
          .orderBy(desc(transactions.createdAt))
          .limit(parseInt(limit))
          .offset(parseInt(offset))

        return {
          success: true,
          transactions: userTransactions,
        }
      } catch (error) {
        console.error('Transactions fetch error:', error)
        return { success: false, message: 'Failed to fetch transactions' }
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
      detail: {
        tags: ['rewards'],
        summary: 'Get user transactions',
        description: 'Get user reward redemption history',
      },
    },
  )

export default rewardRoutes
