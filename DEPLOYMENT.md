# NutriMind-AI Deployment Guide

This project is configured as a monorepo and can be deployed to Vercel in a single project.

## 0. Prerequisites

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster (Free tier is sufficient)
3. Create a database user with a secure password
4. **IMPORTANT**: Add `0.0.0.0/0` to Network Access (IP Whitelist) to allow connections from anywhere (including Vercel and local development)
   - Go to Network Access ? Add IP Address ? Allow access from anywhere (0.0.0.0/0)
5. Get your connection string: Connect ? Drivers ? copy the connection string

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<db_password>@<cluster-url>/nutrimind?retryWrites=true&w=majority

# OpenAI API Key (or OpenRouter)
OPENAI_API_KEY=your-api-key-here

# Node Environment
NODE_ENV=development

# Vercel Deployment Flag (set to 1 when deploying to Vercel)
VERCEL=0
```

**Note**: Replace `<username>`, `<db_password>`, and `<cluster-url>` with your actual MongoDB Atlas credentials.

## 1. Push to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Prepare for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel

1.  Go to [Vercel](https://vercel.com/new).
2.  Import your GitHub repository.
3.  **Project Configuration**:
    - Vercel will detect the project.
    - **IMPORTANT**: In the **Environment Variables** section, add the following:
        - `MONGODB_URI`: Your MongoDB connection string.
        - `OPENAI_API_KEY`: Your OpenAI API key (or OpenRouter key).
        - `NODE_ENV`: `production`
4.  Click **Deploy**.

## 3. How the connection works

- The project uses a root `vercel.json` to route all `/api` calls to the backend and all other calls to the frontend.
- In production, the frontend calls the backend relatively (`/api/...`), so no CORS issues will occur as they share the same domain.
- The backend uses a middleware to ensure database connection is established for every serverless function invocation.

## Local Development

To run locally:
1.  **Backend**: `cd backend && npm run dev` (starts on port 5000)
2.  **Frontend**: `cd frontend && npm run dev` (starts on port 5173)

The frontend is configured to automatically talk to `localhost:5000` when running on `localhost`.

## Troubleshooting

### MongoDB Connection Failed

If you see "MongoDB blocked Vercel!" or "ECONNREFUSED" errors:

1. **Check .env file**: Ensure `MONGO_URI` is correctly set with your actual credentials (not placeholders)
2. **MongoDB Atlas Network Access**: Verify `0.0.0.0/0` is added to the IP whitelist
3. **Database User**: Ensure the database user has correct permissions
4. **Connection String**: Verify the cluster URL and database name are correct
