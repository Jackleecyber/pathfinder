# Cascade Setup Guide

This guide will help you set up and run the Cascade AI-powered Excel add-in for finance professionals.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v13 or higher)
- **Redis** (v6 or higher)
- **Microsoft Excel** (Office 365 or Excel 2019+)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd cascade

# Install root dependencies
npm install

# Install Excel add-in dependencies
cd excel-addin
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit the .env file with your configuration
# Required variables:
# - DATABASE_URL
# - JWT_SECRET
# - ENCRYPTION_KEY
# - OPENAI_API_KEY (or ANTHROPIC_API_KEY)
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis
# (Use your preferred method - Docker, local installation, etc.)

# Generate Prisma client
cd backend
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npm run db:seed
```

### 4. Start Development Servers

```bash
# From the root directory
npm run dev

# This will start:
# - Backend API on http://localhost:3000
# - Excel add-in on https://localhost:3001
```

### 5. Load Excel Add-in

1. Open Microsoft Excel
2. Go to **Insert** > **Office Add-ins**
3. Click **Upload My Add-in**
4. Select `excel-addin/manifest.xml`
5. The Cascade add-in will appear in your Excel ribbon

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cascade
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Security
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key

# File Storage
FILE_STORAGE_PROVIDER=local
LOCAL_UPLOAD_PATH=./uploads

# External Data Providers (Optional)
BLOOMBERG_API_KEY=your_bloomberg_api_key
FACTSET_API_KEY=your_factset_api_key
CAPIQ_API_KEY=your_capiq_api_key
REFINITIV_API_KEY=your_refinitiv_api_key
PITCHBOOK_API_KEY=your_pitchbook_api_key
```

### Excel Add-in Configuration

The Excel add-in is configured in `excel-addin/manifest.xml`. Key settings:

- **Id**: Unique identifier for your add-in
- **SourceLocation**: URL where the add-in is hosted
- **Permissions**: Required Excel permissions

## Development

### Project Structure

```
cascade/
├── excel-addin/          # Excel add-in frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # Excel API integration
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/       # TypeScript types
│   ├── manifest.xml      # Office add-in manifest
│   └── package.json
├── backend/              # Backend API
│   ├── src/
│   │   ├── api/         # API routes
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── models/      # Database models
│   │   └── middleware/  # Express middleware
│   ├── prisma/          # Database schema
│   └── package.json
├── shared/               # Shared types and utilities
└── docs/                # Documentation
```

### Available Scripts

#### Root Level
- `npm run dev` - Start all development servers
- `npm run build` - Build all projects
- `npm test` - Run all tests

#### Excel Add-in
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client

## Features

### Core Capabilities

1. **File Processing**
   - PDF financial statements
   - Excel spreadsheets
   - CSV data files
   - Word documents
   - Image OCR

2. **Web Scraping**
   - SEC filings (10-K, 10-Q)
   - Financial websites
   - Research reports
   - Market data

3. **AI Analysis**
   - Financial statement analysis
   - Formula generation
   - Chart creation
   - Pivot table building

4. **Data Connectors**
   - Bloomberg Terminal
   - FactSet
   - Capital IQ
   - Refinitiv
   - PitchBook

### Excel Integration

- **Chat Interface**: Right-hand pane for natural language commands
- **Cursor Widget**: Context-aware suggestions for selected ranges
- **Action Preview**: See changes before applying them
- **Provenance Tracking**: Full audit trail of data sources

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## Troubleshooting

### Common Issues

1. **Excel Add-in Not Loading**
   - Ensure HTTPS is enabled (required by Office.js)
   - Check browser console for errors
   - Verify manifest.xml is valid

2. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Run `npx prisma migrate dev`

3. **AI Features Not Working**
   - Verify API keys in .env
   - Check API quota limits
   - Review error logs

4. **File Upload Issues**
   - Check file size limits
   - Verify file permissions
   - Ensure upload directory exists

### Debug Mode

Enable debug logging:

```env
LOG_LEVEL=debug
NODE_ENV=development
```

### Logs

- **Backend logs**: `backend/logs/`
- **Excel add-in logs**: Browser console
- **Database logs**: PostgreSQL logs

## Production Deployment

### Backend Deployment

1. Build the application:
   ```bash
   cd backend
   npm run build
   ```

2. Set production environment variables
3. Deploy to your preferred platform (AWS, Azure, GCP)
4. Configure reverse proxy (nginx, Apache)
5. Set up SSL certificates

### Excel Add-in Deployment

1. Build the add-in:
   ```bash
   cd excel-addin
   npm run build
   ```

2. Host the built files on HTTPS
3. Update manifest.xml with production URL
4. Submit to Microsoft AppSource (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For support and questions:
- Create an issue in the repository
- Contact the Cascade team
- Check the documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.
