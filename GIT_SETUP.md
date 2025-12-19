# Git Setup Instructions

## Step 1: Install Git (if not already installed)

1. Download Git for Windows from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/PowerShell after installation

## Step 2: Initialize Git Repository

Open PowerShell in the project directory and run:

```powershell
cd "C:\Users\Jack Lee\Desktop\Delta"
git init
```

## Step 3: Add All Files

```powershell
git add .
```

## Step 4: Create Initial Commit

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

## Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "mentorship-platform" or "pathfinder-website")
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)

## Step 6: Connect and Push to GitHub

After creating the repository on GitHub, run:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Alternative: Using GitHub Desktop

If you prefer a GUI:
1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in
3. File → Add Local Repository → Select the Delta folder
4. Commit the changes
5. Publish to GitHub

