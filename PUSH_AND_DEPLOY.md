# Push to GitHub (style-shop) & Deploy on Vercel

## Part 1: Push backend + newFrontend to GitHub

Open a terminal in the project root: `g:\app zeto task\e-commerce-website`

### 1. Point your repo to the style-shop GitHub repo

If you want this project to live at **https://github.com/Gopal335/style-shop**:

```bash
git remote set-url origin https://github.com/Gopal335/style-shop.git
```

To see current remote:
```bash
git remote -v
```

### 2. Stage and commit (backend + newFrontend are in the repo)

```bash
git add .
git status
git commit -m "Backend and newFrontend ready for Vercel deployment"
```

### 3. Push to GitHub

First time pushing to an empty repo (use main branch):

```bash
git push -u origin main
```

If the repo already has content or uses `master`:
```bash
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy on Vercel

### 1. Deploy the frontend (newFrontend) on Vercel

1. Go to **https://vercel.com** and sign in with GitHub.
2. Click **Add New…** → **Project**.
3. **Import** the repo **Gopal335/style-shop**.
4. **Root Directory:** click **Edit**, set to **`newFrontend`**, then **Continue**.
5. **Framework Preset:** Vite (should be auto-detected).
6. **Environment Variables:** add:
   - **Name:** `VITE_API_URL`  
   - **Value:** your backend URL (e.g. `https://your-backend.onrender.com`) — **no trailing slash**  
   (You can add this after deploying the backend.)
7. Click **Deploy**. Your site will be at `https://your-project.vercel.app`.

### 2. Deploy the backend (Render / Railway)

Your backend (Express + MongoDB) should run on **Render** or **Railway**, not Vercel:

1. Go to **https://render.com** (or **https://railway.app**).
2. **New** → **Web Service** and connect the repo **Gopal335/style-shop**.
3. **Root directory:** leave as repo root (where `server.js` and root `package.json` are).
4. **Build command:** `npm install`
5. **Start command:** `npm start`
6. Add **Environment Variables** in the dashboard, e.g.:
   - `MONGO_URI`
   - `PORT` (optional; Render sets it)
   - `FRONTEND_URL` = `https://your-project.vercel.app` (your Vercel frontend URL)
   - `ACCESS_TOKEN_SECRET`
   - `NODE_ENV` = `production`
   - Plus any others you use (e.g. Cloudinary, email).

### 3. Connect frontend to backend

After the backend is live:

1. In **Vercel** → your project → **Settings** → **Environment Variables**.
2. Set **`VITE_API_URL`** to your backend URL (e.g. `https://your-app.onrender.com`).
3. **Redeploy** the frontend (Deployments → ⋮ → Redeploy) so the new env is applied.

---

## Quick reference

| Step | Where | Action |
|------|--------|--------|
| Push code | Terminal (project root) | `git remote set-url origin https://github.com/Gopal335/style-shop.git` then `git add .` → `git commit` → `git push -u origin main` |
| Deploy frontend | Vercel | Import **style-shop**, Root = **newFrontend**, add **VITE_API_URL** |
| Deploy backend | Render / Railway | Import **style-shop**, root = repo root, add env vars, start: `npm start` |
| Connect | Vercel | Set **VITE_API_URL** to backend URL, redeploy |

Repo: [Gopal335/style-shop](https://github.com/Gopal335/style-shop)
