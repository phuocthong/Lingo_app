import { Elysia, t } from 'elysia'
import bcrypt from 'bcryptjs'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { generateToken } from '../middleware/auth.js'

const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/register',
    async ({ body, set }) => {
      try {
        const { username, email, password, name } = body

        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).get()

        if (existingUser) {
          set.status = 400
          return { success: false, message: 'Email already registered' }
        }

        const existingUsername = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .get()

        if (existingUsername) {
          set.status = 400
          return { success: false, message: 'Username already taken' }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const newUser = await db
          .insert(users)
          .values({
            username,
            email,
            password: hashedPassword,
            name: name || username,
            avatar: `https://cdn.builder.io/o/assets%2Ff046890c17ca436cab38cffc651fb9cb%2Fd0e1a2af26da485f8609e3080da7d7b8?alt=media&token=aca82dee-2b72-4297-9d9d-7921d490a327&apiKey=f046890c17ca436cab38cffc651fb9cb`,
            level: 1,
            xp: 0,
            streak: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()
          .get()

        // Generate token
        const token = generateToken(newUser.id)

        return {
          success: true,
          message: 'User registered successfully',
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            name: newUser.name,
            avatar: newUser.avatar,
            level: newUser.level,
            xp: newUser.xp,
            streak: newUser.streak,
          },
          token,
        }
      } catch (error) {
        console.error('Registration error:', error)
        set.status = 500
        return { success: false, message: 'Registration failed' }
      }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3, maxLength: 20 }),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
        name: t.Optional(t.String()),
      }),
      detail: {
        tags: ['auth'],
        summary: 'Register a new user',
        description: 'Register a new user account',
      },
    },
  )

  .post(
    '/login',
    async ({ body, set }) => {
      try {
        const { username, password } = body

        // Find user by username or email
        const user =
          (await db.select().from(users).where(eq(users.username, username)).get()) ||
          (await db.select().from(users).where(eq(users.email, username)).get())

        if (!user) {
          set.status = 401
          return { success: false, message: 'Invalid credentials' }
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          set.status = 401
          return { success: false, message: 'Invalid credentials' }
        }

        // Generate token
        const token = generateToken(user.id)

        return {
          success: true,
          message: 'Login successful',
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
          token,
        }
      } catch (error) {
        console.error('Login error:', error)
        set.status = 500
        return { success: false, message: 'Login failed' }
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      detail: {
        tags: ['auth'],
        summary: 'User login',
        description: 'Login with username/email and password',
      },
    },
  )

  .post(
    '/forgot-password',
    async ({ body, set }) => {
      try {
        const { email } = body

        // Check if user exists
        const user = await db.select().from(users).where(eq(users.email, email)).get()

        if (!user) {
          // Don't reveal if email exists or not for security
          return {
            success: true,
            message: 'If the email exists, a password reset link has been sent',
          }
        }

        // In a real app, you would:
        // 1. Generate a reset token
        // 2. Save it to database with expiration
        // 3. Send email with reset link

        // For demo purposes, just return success
        return {
          success: true,
          message: 'Password reset email sent',
        }
      } catch (error) {
        console.error('Password reset error:', error)
        set.status = 500
        return { success: false, message: 'Password reset failed' }
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
      detail: {
        tags: ['auth'],
        summary: 'Request password reset',
        description: 'Send password reset email',
      },
    },
  )

  .post(
    '/logout',
    async () => {
      // In a real app with refresh tokens, you'd invalidate the token here
      return {
        success: true,
        message: 'Logged out successfully',
      }
    },
    {
      detail: {
        tags: ['auth'],
        summary: 'User logout',
        description: 'Logout user (client should remove token)',
      },
    },
  )

export default authRoutes
