# Deployment Guide

This guide explains how to deploy the Aura Banking application to a production environment. Since the application consists of a React frontend and a Python Flask backend, they must be deployed separately.

## Architecture
- **Frontend**: A static React single-page application (SPA) built with Vite.
- **Backend**: A Python Flask REST API that talks to the Google Gemini API.

---

## 1. Deploying the Backend (Python/Flask)
The backend MUST be deployed to a service that can run Python servers (e.g., Render, Heroku, Railway, or AWS Elastic Beanstalk).

### Recommended: Render.com
1. Create an account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt` *(Note: you will need to create a `requirements.txt` file in the backend folder containing `flask`, `flask-cors`, and `google-generativeai`)*
   - **Start Command**: `gunicorn app:app` *(Note: you will need to add `gunicorn` to your requirements.txt)*
5. Click **Deploy**. Render will give you a public URL (e.g., `https://aura-backend.onrender.com`).

---

## 2. Connecting Frontend to the Deployed Backend
Before deploying the frontend, you must tell it where the backend lives.

1. Open your frontend code.
2. Search for any fetch calls hitting `http://127.0.0.1:5000/api/...` (e.g., in `AIFinancialHub.jsx`, `App.jsx`, `AdminDashboard.jsx`).
3. Replace `http://127.0.0.1:5000` with your new production backend URL (e.g., `https://aura-backend.onrender.com`).

---

## 3. Deploying the Frontend (React/Vite)
The frontend is completely static once built, so it can be deployed to any static host for free (e.g., Vercel, Netlify, GitHub Pages).

### Recommended: Vercel
1. Create an account on [Vercel](https://vercel.com/).
2. Click **Add New... -> Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect that it is a Vite project. The default settings will work:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

## 4. Production API Keys
Once the app is live:
1. Go to your live frontend URL.
2. Log in as an admin.
3. Open the **Admin Dashboard**.
4. Enter your production **Google Gemini API Key** and hit Save. The backend will instantly start using it to process AI requests!
