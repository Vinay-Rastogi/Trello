# 🎯 Trello-Style Kanban Task Management App

A full-stack, real-time Kanban task management system designed for collaborative project management. It features a modern, intuitive UI with **drag-and-drop** functionality, secured by **JWT authentication**.


---

## 🚀 How to Run

Follow these steps to get the project running on your local machine.

### 1️⃣ Project Setup

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd <project-folder>
    ```

### 2️⃣ Backend Configuration (Node.js/Express)

The backend handles all data and authentication logic. It runs on port `5000`.

* **Install Dependencies:**
    ```bash
    cd backend
    npm install
    ```
* **Environment Variables (`.env`):**
    Create a file named `.env` inside the `backend/` directory and populate it with your configuration:
    ```env
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=a_strong_random_secret_key
    PORT=5000
    ```
* **Start the Server:**
    ```bash
    npm start
    # Backend runs on: http://localhost:5000
    ```

### 3️⃣ Frontend Configuration (React/Vite)

The frontend provides the user interface and interacts with the backend API. It runs on port `5173`.

* **Install Dependencies:**
    ```bash
    cd ../frontend 
    npm install
    ```
* **Environment Variables (`.env`):**
    Create a file named `.env` inside the `frontend/` directory, pointing to your running API:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
* **Start the Client:**
    ```bash
    npm run dev
    # Frontend runs on: http://localhost:5173
    ```

---

## 🏗 Architecture 

The application follows a **Client–Server architecture** with a clear separation of concerns, ensuring maintainability and scalability.

### **Frontend (React + Vite)**

The client is responsible for the user experience and interaction.

* **UI/Routing:** Manages all views (Login, Register, Dashboard, Board Page) using **React Router**.
* **State Management:** Uses the **Context API** to maintain the global authentication state.
* **Security:** Stores the received **JWT token** securely in `localStorage` for session persistence.
* **Data Flow:** Uses **Axios** to make asynchronous **REST API calls** to the backend.
* **Key Data Structure:** The UI is built around a nested hierarchy: **Boards** contain **Lists**, which contain **Cards**.

### **Backend (Node.js + Express + MongoDB)**

The server is the core business logic and data layer. All API endpoints are prefixed with `/api`.

* **Authentication Flow:**
    * **User Routes:** Handles registration and login.
    * **Middleware:** A **JWT Authentication Middleware** protects all sensitive routes, ensuring only authenticated users can perform actions.
* **Business Logic (Controllers):**
    * **CRUD Operations:** Manages the creation, reading, updating, and deletion of **Boards**, **Lists**, and **Cards**.
    * **Drag-and-Drop Logic:** Implements the server-side logic for **list and card reordering** across different lists/boards.
    * **Collaboration:** Manages **member invitations** to boards.
    * **Extensibility:** Includes a dedicated module for a **Recommendation System**.
