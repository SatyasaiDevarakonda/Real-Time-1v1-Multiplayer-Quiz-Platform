
```
quiz-1v1/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Question.js        # Question schema
│   │   └── Room.js            # Room/game state schema
│   ├── socket/
│   │   └── socketHandler.js   # All Socket.IO game logic
│   ├── seed/
│   │   └── seedQuestions.js   # Sample questions
│   ├── server.js              # Express + Socket.IO server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx       # Create/Join room UI
│   │   │   ├── WaitingRoom.jsx # Lobby
│   │   │   ├── Quiz.jsx       # Main gameplay
│   │   │   └── Results.jsx    # End game screen
│   │   ├── context/
│   │   │   └── GameContext.jsx # State management + socket
│   │   ├── App.jsx            # Router
│   │   └── main.jsx           # Entry point
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (https://nodejs.org)
- **MongoDB** running locally or MongoDB Atlas URI
- **npm** or **yarn**

### 1. Install MongoDB (if not installed)

```
```
**Windows:**
Download from https://www.mongodb.com/try/download/community

**OR use MongoDB Atlas (cloud):**
1. Create free account at https://cloud.mongodb.com
2. Create a cluster
3. Get connection string
4. Update `backend/.env` with your URI

### 2. Setup Backend

```
bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Seed the database with sample questions
npm run seed

# Start the server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Setup Frontend (in new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Play the Game!

1. Open `http://localhost:5173` in **two browser tabs/windows**
2. In Tab 1: Click "Create Room" → Enter your name → Get room code
3. In Tab 2: Click "Join Room" → Enter name & room code
4. Game starts automatically when 2 players are in!

## 🎮 How to Play

1. **Create or Join a Room**
   - Player A creates a room and gets a 4-digit code
   - Player B joins using that code

2. **Wait for Opponent**
   - Game starts automatically when both players join

3. **Answer Questions**
   - Both players see the same question simultaneously
   - 15 seconds per question
   - Faster correct answers = more points!

4. **Win the Game**
   - 5 questions per game
   - Highest score wins

## 📡 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `create_room` | Client → Server | Create new room |
| `room_created` | Server → Client | Room created with code |
| `join_room` | Client → Server | Join existing room |
| `player_joined` | Server → Clients | Player joined notification |
| `start_quiz` | Server → Clients | Game starting |
| `next_question` | Server → Clients | New question data |
| `submit_answer` | Client → Server | Player answer |
| `score_update` | Server → Clients | Updated scores |
| `answer_result` | Server → Client | Answer feedback |
| `time_up` | Server → Clients | Timer expired |
| `game_over` | Server → Clients | Final results |

## ⚙️ Configuration

### Backend (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/quiz1v1
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_SOCKET_URL=http://localhost:3001
```

## 🔧 Customization

### Adding Questions

Edit `backend/seed/seedQuestions.js` and add more questions:

```javascript
{
  question: "Your question here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: "Option A",
  subject: "Category",
  difficulty: "easy" // easy, medium, hard
}
```

Then re-seed:
```bash
cd backend
npm run seed
```

### Game Settings

Edit `backend/models/Room.js`:
```javascript
settings: {
  questionsPerGame: { type: Number, default: 5 },
  timePerQuestion: { type: Number, default: 15 } // seconds
}
```

## 🐛 Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running: `mongod --version`
- Check connection URI in `.env`

**Socket connection failed:**
- Verify backend is running on port 3001
- Check browser console for errors

**Questions not loading:**
- Run `npm run seed` in backend directory
- Check MongoDB for `quiz1v1` database

## 📝 Next Phases (Roadmap)

- **Phase 2:** AI Question Generation with RAG (FastAPI + embeddings)
- **Phase 3:** Validation, Explainability & Quality Control
- **Phase 4:** Analytics, Scaling & Production Hardening

## 📄 License

MIT License - Feel free to use and modify!

---

Built with ❤️ for real-time multiplayer learning
