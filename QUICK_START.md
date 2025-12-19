# Cascade Quick Start Guide

## 🚀 Prerequisites Installation

### Step 1: Install Node.js
1. **Download Node.js** from https://nodejs.org/
2. **Choose LTS version** (recommended: 18.x or higher)
3. **Run installer** and follow setup wizard
4. **Restart your terminal** after installation

### Step 2: Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version  
npm --version
```

### Step 3: Install Database (Choose One)

#### Option A: Docker (Recommended - Easy Setup)
```bash
# Install Docker Desktop from https://docker.com
# Then run these commands:

# Start PostgreSQL
docker run --name cascade-postgres \
  -e POSTGRES_DB=cascade \
  -e POSTGRES_USER=cascade \
  -e POSTGRES_PASSWORD=cascade123 \
  -p 5432:5432 \
  -d postgres:13

# Start Redis
docker run --name cascade-redis \
  -p 6379:6379 \
  -d redis:6-alpine
```

#### Option B: Local Installation
- **PostgreSQL**: Download from https://postgresql.org
- **Redis**: Download from https://redis.io

## 🎯 Launch Cascade

### Step 1: Install Dependencies
```bash
# From project root directory
npm install

# Install Excel add-in dependencies
cd excel-addin
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Step 2: Environment Setup
```bash
# Copy environment template
copy env.example .env

# Edit .env file with your settings
# Minimum required:
DATABASE_URL=postgresql://cascade:cascade123@localhost:5432/cascade
JWT_SECRET=your-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here
```

### Step 3: Database Setup
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

### Step 4: Launch Cascade
```bash
# From root directory - starts both services
npm run dev

# This will start:
# - Backend API on http://localhost:3000
# - Excel add-in on https://localhost:3001
```

### Step 5: Load Excel Add-in
1. **Open Microsoft Excel**
2. **Go to Insert > Office Add-ins**
3. **Click "Upload My Add-in"**
4. **Select `excel-addin/manifest.xml`**
5. **Cascade tab will appear in Excel ribbon**

## 🔧 Troubleshooting

### Node.js Not Found
- **Restart terminal** after Node.js installation
- **Check PATH** environment variable
- **Reinstall Node.js** if needed

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Check connection
psql postgresql://cascade:cascade123@localhost:5432/cascade
```

### Excel Add-in Issues
- **Enable HTTPS** (required by Office.js)
- **Check browser console** for errors
- **Reload Excel** after installing add-in

## 🎉 Success Verification

### 1. Check Backend
```bash
curl http://localhost:3000/health
```
Should return: `{"success": true, "message": "Cascade API is running"}`

### 2. Check Excel Add-in
- Look for "Cascade" tab in Excel ribbon
- Click "Open Cascade" button
- Task pane should open on the right

### 3. Test Features
1. **File Upload**: Drag & drop a PDF/Excel file
2. **Chat Interface**: Type "Hello" in chat
3. **Data Connectors**: Check connector status

## 📞 Need Help?

### Common Issues
- **npm not found**: Install Node.js and restart terminal
- **Database error**: Check Docker containers are running
- **Excel add-in**: Ensure HTTPS is enabled

### Quick Commands
```bash
# Restart everything
npm run dev

# Check services
docker ps
curl http://localhost:3000/health

# Reset database
cd backend && npx prisma migrate reset
```

---

**Ready to launch? Follow the steps above!** 🚀
