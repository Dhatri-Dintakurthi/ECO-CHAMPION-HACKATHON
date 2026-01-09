# 🚀 Deployment Guide for Hyperlocal PM2.5 Monitor

Since this is a full-stack Java Spring Boot application, **Render** is the best free option for deployment. Vercel is strictly for static frontends and Next.js, and cannot run your Java backend code.

## ✅ Option 1: Deploy to Render (Recommended)

Render can build your Java app directly from GitHub.

### Prerequisite: Push to GitHub
1.  Make sure your project is pushed to a GitHub repository.
    *   Initialize git if you haven't: `git init`, `git add .`, `git commit -m "Initial commit"`
    *   Create a repo on GitHub and push.

### Step 1: Create Web Service on Render
1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub account and select your `hyperlocal` repository.

### Step 2: Configure Build
Render usually auto-detects Docker, but ensure these settings:

*   **Runtime**: Docker
*   **Region**: Singapore (closest to Hyderabad/India)
*   **Branch**: `main` (or master)
*   **Instance Type**: Free

### Step 3: Environment Variables
You shouldn't need any for this app unless you have secrets. Since this app uses in-memory simulation, it's fine as-is.

### Step 4: Deploy
1.  Click **"Create Web Service"**.
2.  Render will start building. It might take 3-5 minutes.
3.  Once done, you will get a URL like `https://hyperlocal-app.onrender.com`.

---

## ⚠️ Why not Vercel?
Vercel does not support Java implementations. If you deployed to Vercel, you would only see the HTML file, but the **data would never load** because the Java backend wouldn't be running.

## 🛠️ Testing Locally Before Deploy
To confirm the Docker build works (if you have Docker installed):
```bash
docker build -t hyperlocal .
docker run -p 8080:8080 hyperlocal
```

## 📄 Key File Configured
I have already created the `Dockerfile` for you in the project root. Render will look for this file automatically to build your Java application.
