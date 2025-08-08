import { Elysia, t } from 'elysia'
import { db } from '../db/index.js'
import { tasks, userTaskProgress, users } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const taskRoutes = new Elysia({ prefix: '/tasks' })
  .get(
    '/',
    async ({ user }) => {
      try {
        // Get all active tasks with user progress
        const tasksWithProgress = await db
          .select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            target: tasks.target,
            reward: tasks.reward,
            icon: tasks.icon,
            type: tasks.type,
            current: userTaskProgress.current,
            completed: userTaskProgress.completed,
            claimed: userTaskProgress.claimed,
            completedAt: userTaskProgress.completedAt,
            claimedAt: userTaskProgress.claimedAt,
          })
          .from(tasks)
          .leftJoin(
            userTaskProgress,
            and(eq(userTaskProgress.taskId, tasks.id), eq(userTaskProgress.userId, user.id)),
          )
          .where(eq(tasks.isActive, true))

        // Format tasks for frontend
        const formattedTasks = tasksWithProgress.map((task) => {
          const current = task.current || 0
          const progress = Math.min((current / task.target) * 100, 100)
          const canClaim = task.completed && !task.claimed

          return {
            id: task.id,
            title: task.title,
            description: task.description,
            current,
            target: task.target,
            progress: Math.round(progress),
            reward: task.reward,
            icon: task.icon,
            type: task.type,
            completed: task.completed || false,
            claimed: task.claimed || false,
            canClaim,
            completedAt: task.completedAt,
            claimedAt: task.claimedAt,
          }
        })

        return {
          success: true,
          tasks: formattedTasks,
        }
      } catch (error) {
        console.error('Tasks fetch error:', error)
        return { success: false, message: 'Failed to fetch tasks' }
      }
    },
    {
      detail: {
        tags: ['tasks'],
        summary: 'Get user tasks',
        description: 'Get all tasks with user progress',
      },
    },
  )

  .post(
    '/:id/claim',
    async ({ params, user, set }) => {
      try {
        const taskId = parseInt(params.id)

        // Get task and user progress
        const taskProgress = await db
          .select({
            taskId: userTaskProgress.taskId,
            current: userTaskProgress.current,
            completed: userTaskProgress.completed,
            claimed: userTaskProgress.claimed,
            reward: tasks.reward,
            target: tasks.target,
          })
          .from(userTaskProgress)
          .leftJoin(tasks, eq(userTaskProgress.taskId, tasks.id))
          .where(and(eq(userTaskProgress.taskId, taskId), eq(userTaskProgress.userId, user.id)))
          .get()

        if (!taskProgress) {
          set.status = 404
          return { success: false, message: 'Task progress not found' }
        }

        if (!taskProgress.completed) {
          set.status = 400
          return { success: false, message: 'Task not completed yet' }
        }

        if (taskProgress.claimed) {
          set.status = 400
          return { success: false, message: 'Reward already claimed' }
        }

        // Mark as claimed
        await db
          .update(userTaskProgress)
          .set({
            claimed: true,
            claimedAt: new Date(),
          })
          .where(and(eq(userTaskProgress.taskId, taskId), eq(userTaskProgress.userId, user.id)))

        // Add XP to user
        await db
          .update(users)
          .set({
            xp: user.xp + taskProgress.reward,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))

        return {
          success: true,
          message: 'Reward claimed successfully',
          reward: taskProgress.reward,
        }
      } catch (error) {
        console.error('Task claim error:', error)
        set.status = 500
        return { success: false, message: 'Failed to claim reward' }
      }
    },
    {
      detail: {
        tags: ['tasks'],
        summary: 'Claim task reward',
        description: 'Claim reward for completed task',
      },
    },
  )

  .post(
    '/:id/progress',
    async ({ params, body, user, set }) => {
      try {
        const taskId = parseInt(params.id)
        const { increment = 1 } = body

        // Get or create user task progress
        let progress = await db
          .select()
          .from(userTaskProgress)
          .where(and(eq(userTaskProgress.taskId, taskId), eq(userTaskProgress.userId, user.id)))
          .get()

        if (!progress) {
          // Create new progress entry
          progress = await db
            .insert(userTaskProgress)
            .values({
              userId: user.id,
              taskId,
              current: 0,
              completed: false,
              claimed: false,
              createdAt: new Date(),
            })
            .returning()
            .get()
        }

        // Get task details
        const task = await db.select().from(tasks).where(eq(tasks.id, taskId)).get()

        if (!task) {
          set.status = 404
          return { success: false, message: 'Task not found' }
        }

        // Update progress
        const newCurrent = Math.min(progress.current + increment, task.target)
        const completed = newCurrent >= task.target

        await db
          .update(userTaskProgress)
          .set({
            current: newCurrent,
            completed,
            completedAt: completed && !progress.completed ? new Date() : progress.completedAt,
          })
          .where(and(eq(userTaskProgress.taskId, taskId), eq(userTaskProgress.userId, user.id)))

        return {
          success: true,
          message: 'Progress updated',
          progress: {
            current: newCurrent,
            target: task.target,
            completed,
            percentage: Math.round((newCurrent / task.target) * 100),
          },
        }
      } catch (error) {
        console.error('Task progress update error:', error)
        set.status = 500
        return { success: false, message: 'Failed to update progress' }
      }
    },
    {
      body: t.Object({
        increment: t.Optional(t.Number({ minimum: 1 })),
      }),
      detail: {
        tags: ['tasks'],
        summary: 'Update task progress',
        description: 'Update progress for a specific task',
      },
    },
  )

export default taskRoutes
