import { Elysia, t } from 'elysia'
import { db } from '../db/index.js'
import { friends, users } from '../db/schema.js'
import { eq, and, or, like, ne } from 'drizzle-orm'

const friendRoutes = new Elysia({ prefix: '/friends' })
  .get(
    '/',
    async ({ user }) => {
      try {
        // Get accepted friends
        const friendsList = await db
          .select({
            id: users.id,
            username: users.username,
            name: users.name,
            avatar: users.avatar,
            level: users.level,
            streak: users.streak,
            friendshipId: friends.id,
            status: friends.status,
            createdAt: friends.createdAt,
          })
          .from(friends)
          .leftJoin(
            users,
            or(
              and(eq(friends.friendId, users.id), eq(friends.userId, user.id)),
              and(eq(friends.userId, users.id), eq(friends.friendId, user.id)),
            ),
          )
          .where(
            and(
              or(eq(friends.userId, user.id), eq(friends.friendId, user.id)),
              eq(friends.status, 'accepted'),
              ne(users.id, user.id),
            ),
          )

        // Format for frontend
        const formattedFriends = friendsList.map((friend) => ({
          id: friend.id,
          username: `@${friend.username}`,
          name: friend.name,
          avatar: friend.avatar,
          level: friend.level,
          streak: friend.streak.toString(),
          mutualFriends: Math.floor(Math.random() * 10), // Mock data
          friendshipId: friend.friendshipId,
          createdAt: friend.createdAt,
        }))

        return {
          success: true,
          friends: formattedFriends,
        }
      } catch (error) {
        console.error('Friends fetch error:', error)
        return { success: false, message: 'Failed to fetch friends' }
      }
    },
    {
      detail: {
        tags: ['friends'],
        summary: 'Get friends list',
        description: 'Get list of accepted friends',
      },
    },
  )

  .get(
    '/requests',
    async ({ user }) => {
      try {
        // Get pending friend requests received
        const incomingRequests = await db
          .select({
            id: users.id,
            username: users.username,
            name: users.name,
            avatar: users.avatar,
            level: users.level,
            streak: users.streak,
            friendshipId: friends.id,
            createdAt: friends.createdAt,
          })
          .from(friends)
          .leftJoin(users, eq(friends.userId, users.id))
          .where(and(eq(friends.friendId, user.id), eq(friends.status, 'pending')))

        // Get pending friend requests sent
        const outgoingRequests = await db
          .select({
            id: users.id,
            username: users.username,
            name: users.name,
            avatar: users.avatar,
            level: users.level,
            streak: users.streak,
            friendshipId: friends.id,
            createdAt: friends.createdAt,
          })
          .from(friends)
          .leftJoin(users, eq(friends.friendId, users.id))
          .where(and(eq(friends.userId, user.id), eq(friends.status, 'pending')))

        return {
          success: true,
          incoming: incomingRequests,
          outgoing: outgoingRequests,
        }
      } catch (error) {
        console.error('Friend requests fetch error:', error)
        return { success: false, message: 'Failed to fetch friend requests' }
      }
    },
    {
      detail: {
        tags: ['friends'],
        summary: 'Get friend requests',
        description: 'Get pending incoming and outgoing friend requests',
      },
    },
  )

  .post(
    '/search',
    async ({ body, user }) => {
      try {
        const { query } = body

        if (!query || query.length < 2) {
          return {
            success: true,
            users: [],
          }
        }

        // Search users by username or name
        const searchResults = await db
          .select({
            id: users.id,
            username: users.username,
            name: users.name,
            avatar: users.avatar,
            level: users.level,
            streak: users.streak,
          })
          .from(users)
          .where(
            and(
              or(like(users.username, `%${query}%`), like(users.name, `%${query}%`)),
              ne(users.id, user.id),
            ),
          )
          .limit(20)

        // Check friendship status for each user
        const usersWithFriendshipStatus = await Promise.all(
          searchResults.map(async (searchUser) => {
            const friendship = await db
              .select()
              .from(friends)
              .where(
                or(
                  and(eq(friends.userId, user.id), eq(friends.friendId, searchUser.id)),
                  and(eq(friends.userId, searchUser.id), eq(friends.friendId, user.id)),
                ),
              )
              .get()

            return {
              ...searchUser,
              username: `@${searchUser.username}`,
              streak: searchUser.streak.toString(),
              mutualFriends: Math.floor(Math.random() * 10), // Mock data
              friendshipStatus: friendship?.status || 'none',
            }
          }),
        )

        return {
          success: true,
          users: usersWithFriendshipStatus,
        }
      } catch (error) {
        console.error('User search error:', error)
        return { success: false, message: 'Search failed' }
      }
    },
    {
      body: t.Object({
        query: t.String({ minLength: 2 }),
      }),
      detail: {
        tags: ['friends'],
        summary: 'Search users',
        description: 'Search for users to add as friends',
      },
    },
  )

  .post(
    '/add',
    async ({ body, user, set }) => {
      try {
        const { userId } = body

        if (userId === user.id) {
          set.status = 400
          return { success: false, message: 'Cannot add yourself as friend' }
        }

        // Check if friendship already exists
        const existingFriendship = await db
          .select()
          .from(friends)
          .where(
            or(
              and(eq(friends.userId, user.id), eq(friends.friendId, userId)),
              and(eq(friends.userId, userId), eq(friends.friendId, user.id)),
            ),
          )
          .get()

        if (existingFriendship) {
          set.status = 400
          return {
            success: false,
            message:
              existingFriendship.status === 'pending'
                ? 'Friend request already sent'
                : 'Already friends',
          }
        }

        // Check if target user exists
        const targetUser = await db.select().from(users).where(eq(users.id, userId)).get()
        if (!targetUser) {
          set.status = 404
          return { success: false, message: 'User not found' }
        }

        // Create friend request
        await db.insert(friends).values({
          userId: user.id,
          friendId: userId,
          status: 'pending',
          createdAt: new Date(),
        })

        return {
          success: true,
          message: 'Friend request sent successfully',
        }
      } catch (error) {
        console.error('Add friend error:', error)
        set.status = 500
        return { success: false, message: 'Failed to send friend request' }
      }
    },
    {
      body: t.Object({
        userId: t.Number(),
      }),
      detail: {
        tags: ['friends'],
        summary: 'Send friend request',
        description: 'Send a friend request to another user',
      },
    },
  )

  .post(
    '/accept/:id',
    async ({ params, user, set }) => {
      try {
        const friendshipId = parseInt(params.id)

        // Find and update the friend request
        const friendship = await db
          .select()
          .from(friends)
          .where(
            and(
              eq(friends.id, friendshipId),
              eq(friends.friendId, user.id),
              eq(friends.status, 'pending'),
            ),
          )
          .get()

        if (!friendship) {
          set.status = 404
          return { success: false, message: 'Friend request not found' }
        }

        // Accept the friend request
        await db
          .update(friends)
          .set({
            status: 'accepted',
            acceptedAt: new Date(),
          })
          .where(eq(friends.id, friendshipId))

        return {
          success: true,
          message: 'Friend request accepted',
        }
      } catch (error) {
        console.error('Accept friend error:', error)
        set.status = 500
        return { success: false, message: 'Failed to accept friend request' }
      }
    },
    {
      detail: {
        tags: ['friends'],
        summary: 'Accept friend request',
        description: 'Accept a pending friend request',
      },
    },
  )

  .delete(
    '/:id',
    async ({ params, user, set }) => {
      try {
        const friendshipId = parseInt(params.id)

        // Find and delete the friendship
        const friendship = await db
          .select()
          .from(friends)
          .where(
            and(
              eq(friends.id, friendshipId),
              or(eq(friends.userId, user.id), eq(friends.friendId, user.id)),
            ),
          )
          .get()

        if (!friendship) {
          set.status = 404
          return { success: false, message: 'Friendship not found' }
        }

        await db.delete(friends).where(eq(friends.id, friendshipId))

        return {
          success: true,
          message: 'Friend removed successfully',
        }
      } catch (error) {
        console.error('Remove friend error:', error)
        set.status = 500
        return { success: false, message: 'Failed to remove friend' }
      }
    },
    {
      detail: {
        tags: ['friends'],
        summary: 'Remove friend',
        description: 'Remove a friend or reject friend request',
      },
    },
  )

export default friendRoutes
