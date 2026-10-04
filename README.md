# Aura Banking - Advanced Banking & Autonomous Financial OS

Welcome to the **Aura Banking** repository! This is a next-generation, responsive neo-banking platform powered by multi-agent AI (Google Gemini).

## 🗂️ Project Structure & Logic Overview

This project is divided into two main halves: the **Frontend** (React + Vite) and the **Backend** (Python + Flask).

### 1. Frontend Logic (React UI)
The frontend handles all the visual elements, user interactions, and local state management.
**Location:** `frontend/` folder.

- **`frontend/src/App.jsx`**: The main brain of the frontend. It manages routing (switching between tabs), user login states, global balances, and orchestrates all the modals.
- **`frontend/src/components/`**: Contains all the individual UI pieces (e.g., Modals, Dashboards, Pages). Each file is a distinct feature.
- **`frontend/src/index.css`**: The global stylesheet. Contains all the custom color variables, fonts, and responsive mobile layouts.
- **`frontend/src/data/mockData.js`**: The local database simulation. It provides fake contacts, handles transaction persistence in `localStorage`, and acts as the initial state for the app.

### 2. Backend Logic (Python API)
The backend is a lightweight server that strictly acts as the bridge between the React frontend and Google's Gemini AI.
**Location:** `backend/` folder.

- **`backend/app.py`**: This is the single, centralized backend file. It contains **ALL** the HTTP routing and server logic.

### 3. AI Logic (Google Gemini)
All Artificial Intelligence logic has been extracted into its own dedicated module.
**Location:** `ai/` folder.

Inside the `ai/` folder, you will find:
1. **`chat_agent.py`**: Conversational copilot logic and fallback deterministic rules.
2. **`fraud_agent.py`**: Transaction evaluation logic returning SAFE, MEDIUM, or HIGH risk.
3. **`insights_agent.py`**: Analyzes transaction history to generate intelligent dashboards.
4. **`model_utils.py`**: Shared logic for model fetching and robust JSON parsing.

---

## 🚀 How to Run Locally for Development

1. **Start the Frontend:**
   Open a terminal in the `frontend/` folder and run:
   ```bash
   npm run dev
   ```

2. **Start the Backend:**
   Open a new terminal in the `backend/` folder and run:
   ```bash
   pip install flask flask-cors google-generativeai
   python app.py
   ```

*(For production deployment instructions, please see `DEPLOYMENT.md`)*
