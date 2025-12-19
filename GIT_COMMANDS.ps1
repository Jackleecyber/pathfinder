# Git Commands for Pathfinder Repository
# Run these commands in PowerShell after restarting it

# Navigate to project directory
cd "C:\Users\Jack Lee\Desktop\Delta"

# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Mentorship platform website for Malaysian students

- Built modern Next.js website with Tailwind CSS
- Created landing page, services, mentors, results, pricing pages
- Customized for Malaysian students targeting London, Malaysia, and Singapore
- Added images throughout the site
- Implemented responsive design and modern UI
- Added mentor profiles with regional experience
- Created student testimonials with Malaysian context"

# Set main branch
git branch -M main

# Connect to GitHub repository
git remote add origin https://github.com/Jackleecyber/pathfinder.git

# Push to GitHub
git push -u origin main

Write-Host "Done! Your code is now on GitHub." -ForegroundColor Green

