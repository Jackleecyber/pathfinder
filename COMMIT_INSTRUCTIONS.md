# Git Commit Instructions for Pathfinder Repository

## Repository URL
https://github.com/Jackleecyber/pathfinder.git

## Step-by-Step Commands

### 1. Install Git (if not already installed)
Download from: https://git-scm.com/download/win
Install with default settings, then restart PowerShell.

### 2. Navigate to Project Directory
```powershell
cd "C:\Users\Jack Lee\Desktop\Delta"
```

### 3. Initialize Git Repository (if not already done)
```powershell
git init
```

### 4. Add All Files
```powershell
git add .
```

### 5. Create Initial Commit
```powershell
git commit -m "Initial commit: Mentorship platform website for Malaysian students

- Built modern Next.js website with Tailwind CSS
- Created landing page, services, mentors, results, pricing pages
- Customized for Malaysian students targeting London, Malaysia, and Singapore
- Added images throughout the site
- Implemented responsive design and modern UI
- Added mentor profiles with regional experience
- Created student testimonials with Malaysian context"
```

### 6. Set Main Branch
```powershell
git branch -M main
```

### 7. Connect to GitHub Repository
```powershell
git remote add origin https://github.com/Jackleecyber/pathfinder.git
```

### 8. Push to GitHub
```powershell
git push -u origin main
```

## If You Get Authentication Errors

If `git push` asks for credentials:
1. Use a Personal Access Token instead of password
2. Go to: https://github.com/settings/tokens
3. Generate new token (classic) with `repo` permissions
4. Use the token as your password when prompted

## Alternative: Using GitHub Desktop

If command line is complicated, use GitHub Desktop:
1. File → Add Local Repository → Select Delta folder
2. Commit changes
3. Publish to pathfinder repository

