# Lingo Challenge Backend

A high-performance REST API backend for the Lingo Challenge vocabulary learning app, built with ElysiaJS and Bun.

## 🚀 Features

- **Fast & Modern**: Built with ElysiaJS and Bun for maximum performance
- **Type-Safe**: Full TypeScript support with Zod validation
- **Database**: SQLite with Drizzle ORM for easy deployment and development
- **Authentication**: JWT-based authentication with password hashing
- **Real-time**: WebSocket support for live challenges (planned)
- **API Documentation**: Auto-generated Swagger documentation
- **CORS Support**: Configurable CORS for frontend integration

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset

### User Management

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `GET /api/user/stats` - Get user statistics

### Vocabulary & Questions

- `GET /api/vocabulary` - Get vocabulary list
- `GET /api/vocabulary/questions` - Get quiz questions
- `POST /api/vocabulary/questions/:id/answer` - Submit answer

### Challenge Rooms

- `GET /api/rooms` - Get available rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join room
- `DELETE /api/rooms/:id/leave` - Leave room

### Tasks & Progress

- `GET /api/tasks` - Get user tasks
- `POST /api/tasks/:id/claim` - Claim task reward
- `POST /api/tasks/:id/progress` - Update task progress

### Friends & Social

- `GET /api/friends` - Get friends list
- `GET /api/friends/requests` - Get friend requests
- `POST /api/friends/search` - Search users
- `POST /api/friends/add` - Send friend request
- `POST /api/friends/accept/:id` - Accept friend request
- `DELETE /api/friends/:id` - Remove friend

### Rewards & Transactions

- `GET /api/rewards` - Get available rewards
- `POST /api/rewards/:id/redeem` - Redeem reward
- `GET /api/rewards/transactions` - Get transaction history

### Progress Tracking

- `GET /api/progress` - Get user progress
- `POST /api/progress/record` - Record daily progress
- `GET /api/progress/leaderboard` - Get leaderboard

## 🛠 Installation

### Prerequisites

- [Bun](https://bun.sh) runtime (v1.0+)
- Node.js 18+ (alternative to Bun)

### Quick Start

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate database schema**

   ```bash
   bun run db:generate
   ```

5. **Run database migrations**

   ```bash
   bun run db:migrate
   ```

6. **Seed database with sample data**

   ```bash
   bun run db:seed
   ```

7. **Start development server**
   ```bash
   bun run dev
   ```

The API server will be running at `http://localhost:3001`

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts and profiles
- **vocabulary** - English vocabulary words
- **questions** - Quiz questions linked to vocabulary
- **rooms** - Challenge rooms for multiplayer games
- **room_participants** - Users participating in rooms
- **user_answers** - Individual answers in games
- **tasks** - Available tasks and achievements
- **user_task_progress** - User progress on tasks
- **friends** - Friend relationships
- **rewards** - Available rewards for redemption
- **transactions** - Reward redemption history
- **user_progress** - Daily learning progress tracking

### Database Commands

```bash
# Generate migration files
bun run db:generate

# Apply migrations
bun run db:migrate

# Seed database with sample data
bun run db:seed

# Open database studio (web interface)
bun run db:studio
```

## 🔧 Configuration

### Environment Variables

```env
PORT=3001                    # Server port
NODE_ENV=development         # Environment mode
DATABASE_URL=./lingo-challenge.db  # SQLite database path
JWT_SECRET=your-secret-key   # JWT signing secret
ALLOWED_ORIGINS=http://localhost:9000  # CORS origins
```

### Database Configuration

The app uses SQLite for easy development and deployment. For production, you can switch to PostgreSQL by:

1. Install PostgreSQL dependencies:

   ```bash
   bun add pg drizzle-orm/pg-core
   ```

2. Update database configuration in `src/db/index.js`

3. Update `drizzle.config.js` for PostgreSQL

## 🧪 Testing

Test accounts are created during seeding:

- **Username**: `admin`, **Password**: `password123`
- **Username**: `minhanh`, **Password**: `password123`
- **Username**: `thanhhoa`, **Password**: `password123`

### API Testing

Use the auto-generated Swagger documentation at `http://localhost:3001/swagger` to test endpoints interactively.

## 📚 API Documentation

Interactive API documentation is available at:

- **Swagger UI**: `http://localhost:3001/swagger`
- **JSON Schema**: `http://localhost:3001/swagger/json`

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get a JWT token
2. **Include token** in requests: `Authorization: Bearer <token>`
3. **Token expires** in 7 days (configurable)

### Frontend Integration

For your Quasar frontend, update API calls to use this backend:

```javascript
// Example: Update auth.js
const API_BASE = 'http://localhost:3001/api'

export const auth = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await response.json()

    if (data.success) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return data
  },
}
```

## 🚀 Deployment

### Development

```bash
bun run dev    # Watch mode with auto-reload
```

### Production

```bash
bun run start  # Production mode
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM oven/bun:latest

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run db:generate
RUN bun run db:migrate

EXPOSE 3001
CMD ["bun", "run", "start"]
```

Build and run:

```bash
docker build -t lingo-backend .
docker run -p 3001:3001 lingo-backend
```

### Platform Deployment

#### Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

#### Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `bun install && bun run db:migrate`
4. Set start command: `bun run start`

#### Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:

```json
{
  "functions": {
    "src/index.js": {
      "runtime": "bun"
    }
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

3. Deploy: `vercel --prod`

## 🔧 Development

### Project Structure

```
backend/
├── src/
│   ├── db/           # Database schema and connection
│   ├── routes/       # API route handlers
│   ├── middleware/   # Authentication and other middleware
│   ├── scripts/      # Database migration and seeding
│   └── index.js      # Main server file
├── drizzle/          # Generated database migrations
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

### Adding New Features

1. **New API endpoint**: Add route in `src/routes/`
2. **Database changes**: Update `src/db/schema.js`
3. **Migration**: Run `bun run db:generate`
4. **Update docs**: Swagger auto-generates from route definitions

### Code Style

- Use ES modules (`import/export`)
- Async/await for promises
- Zod for request validation
- Descriptive variable names
- Error handling in try/catch blocks

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check this README and Swagger docs
- **Issues**: Create GitHub issues for bugs
- **Questions**: Open GitHub discussions

---

**Happy coding! 🎉**
