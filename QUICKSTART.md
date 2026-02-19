# Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### Step 1: Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will start on `http://localhost:5000`

### Step 2: Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

### Step 3: Access the Application

Open your browser and navigate to: `http://localhost:5173`

## ✅ Verify Installation

1. **Backend Health Check**: Visit `http://localhost:5000/api/health`
   - Should return: `{"success":true,"message":"PreventAI API is running",...}`

2. **Frontend**: Visit `http://localhost:5173`
   - Should show the PreventAI landing page

3. **Test Flow**:
   - Click "Start Assessment"
   - Fill out the form
   - Submit and view results

## 🔧 Troubleshooting

### Port Already in Use
- Backend: Change `PORT` in `backend/.env` or `server.js`
- Frontend: Change port in `frontend/vite.config.js`

### CORS Errors
- Ensure backend is running before frontend
- Check `FRONTEND_URL` in backend `.env` matches frontend URL

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📝 Environment Variables (Optional)

Create `backend/.env`:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Defaults are already set in code, so this is optional.

