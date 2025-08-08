import jwt from 'jsonwebtoken'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const JWT_SECRET = process.env.JWT_SECRET || 'lingo-challenge-secret-key'

export const authMiddleware = (app) => {
  return app.derive(async ({ headers, set }) => {
    // Skip auth for non-protected routes
    const authHeader = headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401
      throw new Error('Authorization header required')
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await db.select().from(users).where(eq(users.id, decoded.userId)).get()

      if (!user) {
        set.status = 401
        throw new Error('User not found')
      }

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
        },
      }
    } catch (error) {
      set.status = 401
      throw new Error('Invalid token')
    }
  })
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}
