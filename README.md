# Trello-Style Task Management App

A full-stack Kanban task management system built using **React (Vite)**, **Node.js + Express**, and **MongoDB**, with JWT authentication and drag-and-drop functionality.

---

## 🚀 How to Run the Project

### 1️⃣ Clone the project
```bash
git clone <your-repo-url>
cd <project-folder>

🖥️ Backend Setup (Express + MongoDB)
cd backend
npm install


Create a .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000


Start backend:

npm start


Backend runs on:

http://localhost:5000

🌐 Frontend Setup (React + Vite)
cd frontend
npm install


Create .env file:

VITE_API_URL=http://localhost:5000/api


Start frontend:

npm run dev


Frontend runs on:

http://localhost:5173

🏗 Architecture Explanation (In Simple Words)

The project uses a client–server architecture with clear separation between frontend UI and backend API.

Frontend (React + Vite)

Handles all UI screens: Login, Register, Dashboard, Board Page

Uses React Router for navigation

Uses Context API to store authentication state

Stores JWT token in localStorage

Uses Axios for API calls

Implements drag-and-drop using @hello-pangea/dnd

Organizes tasks as:

Boards

Lists inside boards

Cards inside lists

The frontend sends requests to the backend to fetch boards, lists, cards, and perform actions like move, reorder, create, delete, and invite.

Backend (Node.js + Express)

Exposes REST API endpoints under /api/...

Uses JWT authentication middleware to protect routes

Implements separate modules:

Routes → API endpoints

Controllers → Business logic

Models → MongoDB schemas

Middleware → Token validation

The backend handles:

User registration & login

Token validation

CRUD for boards, lists, and cards

List & card reordering logic

Member invitation

Recommendation system