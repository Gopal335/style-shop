# Deploy to Vercel (Frontend) + Backend

## 1. Push to GitHub

From project root:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 2. Deploy Frontend (newFrontend) on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Import** your repository.
3. **Root Directory:** set to **`newFrontend`** (not the repo root).
4. **Framework Preset:** Vite (auto-detected).
5. **Environment Variables:** add:
   - `VITE_API_URL` = your backend URL (e.g. `https://your-app.onrender.com`) — **no trailing slash**.
6. Deploy. Your frontend will be live at `https://your-project.vercel.app`.

## 3. Deploy Backend (Render / Railway recommended)

Vercel is best for the frontend. Run the Express backend on **Render** or **Railway**:

- **Root / working directory:** repo root (where `server.js` and `package.json` are).
- **Build:** `npm install`
- **Start:** `npm start`
- **Environment Variables** (set in Render/Railway dashboard):
  - `MONGO_URI` — MongoDB connection string
  - `PORT` — leave default (Render/Railway set it)
  - `FRONTEND_URL` — your Vercel frontend URL, e.g. `https://your-project.vercel.app` (optional: comma-separated for multiple)
  - `ACCESS_TOKEN_SECRET` — JWT secret
  - `NODE_ENV` — `production`
  - Optional: `CLOUDINARY_*`, `EMAIL_*`, `MASTER_OTP`, etc., as in your local `.env`

After backend is deployed, set **VITE_API_URL** in Vercel to that backend URL so the frontend can call the API.

## 4. Summary

| Part      | Where to deploy | Root directory | Key env |
|----------|-----------------|----------------|---------|
| Frontend | Vercel          | `newFrontend`  | `VITE_API_URL` = backend URL |
| Backend  | Render/Railway  | repo root      | `MONGO_URI`, `FRONTEND_URL`, `ACCESS_TOKEN_SECRET` |
