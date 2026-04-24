# 🥗 NutriMind-AI

NutriMind-AI is a comprehensive, AI-powered health and nutrition management platform. It helps users generate personalized diet plans using OpenAI's GPT models, track their health metrics through integrated calculators, and manage their nutritional journey with a sleek, modern interface.

---

## 🌐 Live Demo: https://nutri-mind-ai-j4pi.vercel.app

## ✨ Key Features

-   **🤖 AI Diet Generation**: Get personalized, 7-meal daily diet charts based on your physical metrics, goals, and dietary preferences.
-   **📊 Health Calculators**: Built-in tools for:
    -   BMI (Body Mass Index)
    -   BMR (Basal Metabolic Rate)
    -   TDEE (Total Daily Energy Expenditure)
    -   Macro-nutrient Breakdown
-   **👤 Profile Management**: Secure user registration and profile setup to tailor recommendations.
-   **🗂️ Diet History**: Access and manage your previously generated diet plans.
-   **📥 Export to PDF**: Save your diet plans locally in high-quality PDF format.
-   **🔐 Secure Authentication**: JWT-based authentication for data privacy.
-   **🛡️ Admin Panel**: Dedicated interface for managing user data and platform metrics.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/) (Vite)
-   **Styling**: [Bootstrap](https://getbootstrap.com/) & [React-Bootstrap](https://react-bootstrap.github.io/)
-   **Routing**: [React Router DOM](https://reactrouter.com/)
-   **State/Auth**: Context API
-   **Utility**: Axios, Html2Canvas, JSPDF

### Backend
-   **Environment**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
-   **AI**: [OpenAI API](https://openai.com/api/)
-   **Security**: JSON Web Tokens (JWT), BcryptJS
-   **Utility**: PDFKit, Dotenv, CORS

---

## 📂 Project Structure

```bash
NutriMind-AI/
├── backend/            # Express.js Server
│   ├── config/         # DB Connection
│   ├── controllers/    # API Logics
│   ├── middleware/     # Auth & Error middlewares
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # Express Routes
│   └── server.js       # Entry point
├── frontend/           # React App (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth & State Providers
│   │   ├── pages/      # Application Pages
│   │   └── App.jsx     # Main Router
│   └── index.html      # Entry HTML
└── README.md           # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas account or local installation
-   OpenAI API Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Ajith5104/NutriMind-AI.git
    cd NutriMind-AI
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    OPENAI_API_KEY=your_openai_key
    ```
    Start the server:
    ```bash
    npm run start
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:5173`.

---

## 📄 License

This project is licensed under the ISC License.

## ✉️ Contact

**Ajith M** - [GitHub](https://github.com/Ajith5104)

Project Link: [https://github.com/Ajith5104/NutriMind-AI](https://github.com/Ajith5104/NutriMind-AI)
