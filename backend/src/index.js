import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'

// Import route modules
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import vocabularyRoutes from './routes/vocabulary.js'
import roomRoutes from './routes/rooms.js'
import taskRoutes from './routes/tasks.js'
import friendRoutes from './routes/friends.js'
import rewardRoutes from './routes/rewards.js'
import progressRoutes from './routes/progress.js'

// Import middleware
import { authMiddleware } from './middleware/auth.js'

const app = new Elysia()
  .use(
    cors({
      origin: true, // Allow all origins in development
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Lingo Challenge API',
          version: '1.0.0',
          description: 'REST API for Lingo Challenge vocabulary app',
        },
        tags: [
          { name: 'auth', description: 'Authentication endpoints' },
          { name: 'users', description: 'User management' },
          { name: 'vocabulary', description: 'Vocabulary and questions' },
          { name: 'rooms', description: 'Challenge rooms' },
          { name: 'tasks', description: 'User tasks and progress' },
          { name: 'friends', description: 'Friend management' },
          { name: 'rewards', description: 'Rewards and transactions' },
          { name: 'progress', description: 'User progress tracking' },
        ],
      },
    }),
  )
  .use(staticPlugin())

  // Health check endpoint
  .get('/', () => ({
    message: 'Lingo Challenge API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }))

  // Mount route modules
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(authMiddleware)
      .use(userRoutes)
      .use(vocabularyRoutes)
      .use(roomRoutes)
      .use(taskRoutes)
      .use(friendRoutes)
      .use(rewardRoutes)
      .use(progressRoutes),
  )

  // Error handling
  .onError(({ code, error, set }) => {
    console.error('API Error:', error)

    if (code === 'VALIDATION') {
      set.status = 400
      return {
        success: false,
        message: 'Validation error',
        errors: error.message,
      }
    }

    if (code === 'NOT_FOUND') {
      set.status = 404
      return {
        success: false,
        message: 'Endpoint not found',
      }
    }

    set.status = 500
    return {
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }
  })

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`🚀 Lingo Challenge API server running on http://localhost:${port}`)
  console.log(`📚 API Documentation available at http://localhost:${port}/swagger`)
})

export default app
