# Deploy to Vercel (Free) - Get a Shareable Link

## Option 1: Deploy via Vercel Website (Easiest - Recommended)

### Step 1: Push to GitHub First
Make sure your code is pushed to GitHub at: https://github.com/Jackleecyber/pathfinder

### Step 2: Deploy on Vercel
1. Go to: https://vercel.com
2. Click "Sign Up" (or "Log In" if you have an account)
3. Sign in with your GitHub account (recommended)
4. Click "Add New Project"
5. Import your repository: `Jackleecyber/pathfinder`
6. Vercel will auto-detect it's a Next.js project
7. **Important Settings:**
   - **Root Directory:** Set to `website` (since your Next.js app is in the website folder)
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
8. Click "Deploy"
9. Wait 2-3 minutes for deployment
10. You'll get a free URL like: `pathfinder-xxxxx.vercel.app`

### Step 3: Share Your Link
Once deployed, you'll get a URL like:
- `https://pathfinder-xxxxx.vercel.app` (auto-generated)
- Or you can add a custom domain later

## Option 2: Deploy via Vercel CLI

### Install Vercel CLI
```powershell
npm install -g vercel
```

### Deploy
```powershell
cd "C:\Users\Jack Lee\Desktop\Delta\website"
vercel
```

Follow the prompts:
- Login to Vercel
- Link to existing project or create new
- Deploy!

## Option 3: Deploy via GitHub Integration (Automatic)

1. Push your code to GitHub
2. Go to Vercel.com
3. Import your GitHub repository
4. Vercel will automatically deploy every time you push to GitHub

## Free Features You Get:
- ✅ Free HTTPS URL
- ✅ Automatic deployments on git push
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Custom domain support (optional)
- ✅ Preview deployments for pull requests

## After Deployment:
Your website will be live at a URL like:
`https://pathfinder-xxxxx.vercel.app`

You can share this link with anyone - it's completely free!

