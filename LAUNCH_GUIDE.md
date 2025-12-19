# Cascade Launch Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites Check
Before launching, ensure you have:
- **Node.js 18+** installed
- **PostgreSQL** running locally or accessible
- **Redis** running locally or accessible
- **Microsoft Excel** (Office 365 or Excel 2019+)

### Step 1: Install Dependencies
```bash
# Install root dependencies
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
cp env.example .env

# Edit .env with your configuration
# Minimum required variables:
# DATABASE_URL=postgresql://username:password@localhost:5432/cascade
# JWT_SECRET=your-secret-key-here
# ENCRYPTION_KEY=your-encryption-key-here
```

### Step 3: Database Setup
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npm run db:seed
```

### Step 4: Launch Cascade
```bash
# From root directory - starts both frontend and backend
npm run dev

# Or start individually:
# Backend API (port 3000)
cd backend && npm run dev

# Excel add-in (port 3001)
cd excel-addin && npm run dev
```

### Step 5: Load Excel Add-in
1. Open Microsoft Excel
2. Go to **Insert** > **Office Add-ins**
3. Click **Upload My Add-in**
4. Select `excel-addin/manifest.xml`
5. Cascade will appear in your Excel ribbon

## 🔧 Detailed Setup

### Database Configuration

#### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL (if not installed)
# Windows: Download from postgresql.org
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb cascade

# Update .env
DATABASE_URL=postgresql://username:password@localhost:5432/cascade
```

#### Option 2: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name cascade-postgres \
  -e POSTGRES_DB=cascade \
  -e POSTGRES_USER=cascade \
  -e POSTGRES_PASSWORD=cascade123 \
  -p 5432:5432 \
  -d postgres:13

# Update .env
DATABASE_URL=postgresql://cascade:cascade123@localhost:5432/cascade
```

### Redis Configuration

#### Option 1: Local Redis
```bash
# Install Redis
# Windows: Download from redis.io
# macOS: brew install redis
# Linux: sudo apt-get install redis-server

# Start Redis
redis-server

# Update .env
REDIS_URL=redis://localhost:6379
```

#### Option 2: Docker Redis
```bash
# Run Redis in Docker
docker run --name cascade-redis \
  -p 6379:6379 \
  -d redis:6-alpine

# Update .env
REDIS_URL=redis://localhost:6379
```

### AI Services Setup

#### OpenAI Configuration
```bash
# Get API key from platform.openai.com
# Add to .env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### Anthropic Configuration (Alternative)
```bash
# Get API key from console.anthropic.com
# Add to .env
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
```

## 🎯 Launch Verification

### 1. Check Backend Health
```bash
curl http://localhost:3000/health
```
Expected response:
```json
{
  "success": true,
  "message": "Cascade API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. Check Excel Add-in
- Open Excel
- Look for "Cascade" tab in ribbon
- Click "Open Cascade" button
- Task pane should open on the right

### 3. Test File Upload
1. In Cascade task pane, go to "Upload" tab
2. Drag & drop a PDF or Excel file
3. Watch processing status update
4. Check extracted data appears

### 4. Test Chat Interface
1. Go to "Chat" tab in Cascade
2. Type: "Hello, can you help me analyze financial data?"
3. Should receive AI response

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
psql $DATABASE_URL

# Reset database
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

#### 2. Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Should return "PONG"
```

#### 3. Excel Add-in Not Loading
- Ensure HTTPS is enabled (required by Office.js)
- Check browser console for errors
- Verify manifest.xml is valid
- Try reloading Excel

#### 4. AI Features Not Working
- Verify API keys in .env
- Check API quota limits
- Review error logs in backend

#### 5. File Upload Issues
- Check file size limits (50MB default)
- Verify file permissions
- Ensure upload directory exists

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Check logs
tail -f backend/logs/cascade.log
```

## 🚀 Production Launch

### Environment Variables
```bash
# Production .env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/cascade
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=your-production-secret
ENCRYPTION_KEY=your-production-encryption-key
OPENAI_API_KEY=your-production-openai-key
```

### Build for Production
```bash
# Build Excel add-in
cd excel-addin
npm run build

# Build backend
cd ../backend
npm run build
```

### Deploy Backend
```bash
# Start production server
cd backend
npm start

# Or use PM2 for process management
pm2 start dist/index.js --name cascade-api
```

### Deploy Excel Add-in
1. Host built files on HTTPS server
2. Update manifest.xml with production URL
3. Submit to Microsoft AppSource (optional)

## 📞 Support

### Getting Help
- **Documentation**: Check setup.md and demo.md
- **API Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **Logs**: Check backend/logs/ directory

### Common Commands
```bash
# Restart everything
npm run dev

# Reset database
cd backend && npx prisma migrate reset

# Check services
curl http://localhost:3000/health
redis-cli ping
pg_isready

# View logs
tail -f backend/logs/cascade.log
```

---

**Ready to launch Cascade? Follow the Quick Start section above!** 🚀
