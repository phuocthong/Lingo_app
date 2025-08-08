import { Elysia, t } from 'elysia'
import { db } from '../db/index.js'
import { rooms, roomParticipants, users, userAnswers } from '../db/schema.js'
import { eq, and, desc, sql } from 'drizzle-orm'

const roomRoutes = new Elysia({ prefix: '/rooms' })
  .get(
    '/',
    async ({ query }) => {
      try {
        const { status = 'waiting' } = query

        const roomsWithDetails = await db
          .select({
            id: rooms.id,
            code: rooms.code,
            name: rooms.name,
            maxPlayers: rooms.maxPlayers,
            questionCount: rooms.questionCount,
            timePerQuestion: rooms.timePerQuestion,
            status: rooms.status,
            currentQuestion: rooms.currentQuestion,
            createdAt: rooms.createdAt,
            owner: {
              id: users.id,
              username: users.username,
              name: users.name,
              avatar: users.avatar,
            },
          })
          .from(rooms)
          .leftJoin(users, eq(rooms.ownerId, users.id))
          .where(eq(rooms.status, status))
          .orderBy(desc(rooms.createdAt))

        // Get participant counts for each room
        const roomsWithParticipants = await Promise.all(
          roomsWithDetails.map(async (room) => {
            const participantCount = await db
              .select({ count: sql`count(*)` })
              .from(roomParticipants)
              .where(eq(roomParticipants.roomId, room.id))
              .get()

            const participants = await db
              .select({
                id: users.id,
                username: users.username,
                name: users.name,
                avatar: users.avatar,
                score: roomParticipants.score,
                status: roomParticipants.status,
              })
              .from(roomParticipants)
              .leftJoin(users, eq(roomParticipants.userId, users.id))
              .where(eq(roomParticipants.roomId, room.id))

            return {
              ...room,
              currentPlayers: parseInt(participantCount.count) || 0,
              participants,
            }
          }),
        )

        return {
          success: true,
          rooms: roomsWithParticipants,
        }
      } catch (error) {
        console.error('Rooms fetch error:', error)
        return { success: false, message: 'Failed to fetch rooms' }
      }
    },
    {
      query: t.Object({
        status: t.Optional(t.String()),
      }),
      detail: {
        tags: ['rooms'],
        summary: 'Get available rooms',
        description: 'Get list of available challenge rooms',
      },
    },
  )

  .post(
    '/',
    async ({ body, user, set }) => {
      try {
        const { name, maxPlayers, questionCount, timePerQuestion } = body

        // Generate unique room code
        const generateRoomCode = () => {
          return Math.random().toString(36).substring(2, 8).toUpperCase()
        }

        let roomCode = generateRoomCode()
        let existingRoom = await db.select().from(rooms).where(eq(rooms.code, roomCode)).get()

        while (existingRoom) {
          roomCode = generateRoomCode()
          existingRoom = await db.select().from(rooms).where(eq(rooms.code, roomCode)).get()
        }

        // Create room
        const newRoom = await db
          .insert(rooms)
          .values({
            code: roomCode,
            name,
            ownerId: user.id,
            maxPlayers,
            questionCount,
            timePerQuestion,
            status: 'waiting',
            currentQuestion: 0,
            createdAt: new Date(),
          })
          .returning()
          .get()

        // Add owner as participant
        await db.insert(roomParticipants).values({
          roomId: newRoom.id,
          userId: user.id,
          score: 0,
          streak: 0,
          status: 'waiting',
          joinedAt: new Date(),
        })

        return {
          success: true,
          message: 'Room created successfully',
          room: {
            ...newRoom,
            owner: user,
            currentPlayers: 1,
            participants: [
              {
                id: user.id,
                username: user.username,
                name: user.name,
                avatar: user.avatar,
                score: 0,
                status: 'waiting',
              },
            ],
          },
        }
      } catch (error) {
        console.error('Room creation error:', error)
        set.status = 500
        return { success: false, message: 'Failed to create room' }
      }
    },
    {
      body: t.Object({
        name: t.String(),
        maxPlayers: t.Number({ minimum: 2, maximum: 10 }),
        questionCount: t.Number({ minimum: 5, maximum: 50 }),
        timePerQuestion: t.Number({ minimum: 10, maximum: 120 }),
      }),
      detail: {
        tags: ['rooms'],
        summary: 'Create new room',
        description: 'Create a new challenge room',
      },
    },
  )

  .get(
    '/:id',
    async ({ params, set }) => {
      try {
        const roomId = parseInt(params.id)

        const room = await db
          .select({
            id: rooms.id,
            code: rooms.code,
            name: rooms.name,
            maxPlayers: rooms.maxPlayers,
            questionCount: rooms.questionCount,
            timePerQuestion: rooms.timePerQuestion,
            status: rooms.status,
            currentQuestion: rooms.currentQuestion,
            createdAt: rooms.createdAt,
            startedAt: rooms.startedAt,
            finishedAt: rooms.finishedAt,
            owner: {
              id: users.id,
              username: users.username,
              name: users.name,
              avatar: users.avatar,
            },
          })
          .from(rooms)
          .leftJoin(users, eq(rooms.ownerId, users.id))
          .where(eq(rooms.id, roomId))
          .get()

        if (!room) {
          set.status = 404
          return { success: false, message: 'Room not found' }
        }

        // Get participants
        const participants = await db
          .select({
            id: users.id,
            username: users.username,
            name: users.name,
            avatar: users.avatar,
            score: roomParticipants.score,
            streak: roomParticipants.streak,
            rank: roomParticipants.rank,
            status: roomParticipants.status,
            joinedAt: roomParticipants.joinedAt,
          })
          .from(roomParticipants)
          .leftJoin(users, eq(roomParticipants.userId, users.id))
          .where(eq(roomParticipants.roomId, roomId))
          .orderBy(roomParticipants.joinedAt)

        return {
          success: true,
          room: {
            ...room,
            currentPlayers: participants.length,
            participants,
          },
        }
      } catch (error) {
        console.error('Room fetch error:', error)
        set.status = 500
        return { success: false, message: 'Failed to fetch room' }
      }
    },
    {
      detail: {
        tags: ['rooms'],
        summary: 'Get room details',
        description: 'Get detailed information about a specific room',
      },
    },
  )

  .post(
    '/:id/join',
    async ({ params, user, set }) => {
      try {
        const roomId = parseInt(params.id)

        // Check if room exists and has space
        const room = await db.select().from(rooms).where(eq(rooms.id, roomId)).get()

        if (!room) {
          set.status = 404
          return { success: false, message: 'Room not found' }
        }

        if (room.status !== 'waiting') {
          set.status = 400
          return { success: false, message: 'Room is not accepting new players' }
        }

        // Check if user already in room
        const existingParticipant = await db
          .select()
          .from(roomParticipants)
          .where(and(eq(roomParticipants.roomId, roomId), eq(roomParticipants.userId, user.id)))
          .get()

        if (existingParticipant) {
          set.status = 400
          return { success: false, message: 'Already joined this room' }
        }

        // Check room capacity
        const participantCount = await db
          .select({ count: sql`count(*)` })
          .from(roomParticipants)
          .where(eq(roomParticipants.roomId, roomId))
          .get()

        if (parseInt(participantCount.count) >= room.maxPlayers) {
          set.status = 400
          return { success: false, message: 'Room is full' }
        }

        // Add user to room
        await db.insert(roomParticipants).values({
          roomId,
          userId: user.id,
          score: 0,
          streak: 0,
          status: 'waiting',
          joinedAt: new Date(),
        })

        return {
          success: true,
          message: 'Joined room successfully',
          room: {
            id: room.id,
            code: room.code,
            name: room.name,
            status: room.status,
          },
        }
      } catch (error) {
        console.error('Room join error:', error)
        set.status = 500
        return { success: false, message: 'Failed to join room' }
      }
    },
    {
      detail: {
        tags: ['rooms'],
        summary: 'Join room',
        description: 'Join an existing challenge room',
      },
    },
  )

  .delete(
    '/:id/leave',
    async ({ params, user, set }) => {
      try {
        const roomId = parseInt(params.id)

        // Remove user from room
        const deleted = await db
          .delete(roomParticipants)
          .where(and(eq(roomParticipants.roomId, roomId), eq(roomParticipants.userId, user.id)))
          .returning()
          .get()

        if (!deleted) {
          set.status = 404
          return { success: false, message: 'Not in this room' }
        }

        return {
          success: true,
          message: 'Left room successfully',
        }
      } catch (error) {
        console.error('Room leave error:', error)
        set.status = 500
        return { success: false, message: 'Failed to leave room' }
      }
    },
    {
      detail: {
        tags: ['rooms'],
        summary: 'Leave room',
        description: 'Leave a challenge room',
      },
    },
  )

export default roomRoutes
