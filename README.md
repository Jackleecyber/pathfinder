# Cascade - AI-Powered Excel Add-in for Finance Professionals

Cascade transforms Excel from a manual spreadsheet tool into an intelligent financial assistant that can import, clean, analyze, and model data automatically — all without leaving the familiar Excel environment.

## 🚀 Features

- **Pull Data from Any File**: Drag & drop PDFs, Word, Excel, CSVs with instant extraction
- **Grab Data from Any Website**: Paste URLs to scrape and extract structured tables
- **Automated Financial Analysis**: Detect financial statements and generate formulas automatically
- **Financial Model Building**: Auto-generate projections and scenario analysis
- **Conversational Excel Assistant**: Chat-powered interface with natural language commands
- **Context-Aware Cursor Widget**: Hover suggestions and one-click actions

## 🏗️ Architecture

```
cascade/
├── excel-addin/          # Office.js + React/TypeScript frontend
├── backend/             # API Gateway + Microservices
├── shared/              # Shared types and utilities
└── docs/               # Documentation and guides
```

## 🛠️ Technology Stack

### Frontend
- Office.js for Excel integration
- React + TypeScript
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- Node.js + Express
- PostgreSQL for metadata
- Vector DB (Pinecone/Milvus) for embeddings
- Blob storage for file uploads
- Playwright for web scraping

### AI/ML
- OpenAI/Anthropic for LLM reasoning
- Local models for table extraction
- Structured JSON output prompts

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   cd excel-addin && npm install
   cd ../backend && npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Set up database**:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```

5. **Load the add-in in Excel**:
   - Open Excel
   - Go to Insert > Office Add-ins
   - Upload the manifest file from `excel-addin/manifest.xml`

For detailed setup instructions, see [setup.md](setup.md).

## 📁 Project Structure

### Excel Add-in (`excel-addin/`)
- `src/components/` - React components for UI
- `src/services/` - Excel API integration
- `src/types/` - TypeScript type definitions
- `manifest.xml` - Office add-in manifest

### Backend (`backend/`)
- `src/api/` - REST API endpoints
- `src/services/` - Business logic services
- `src/models/` - Database models
- `src/utils/` - Utility functions

### Shared (`shared/`)
- `types/` - Shared TypeScript types
- `utils/` - Common utility functions
- `constants/` - Application constants

## 🔧 Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Code Style
- ESLint + Prettier for code formatting
- Husky for git hooks
- Conventional commits for commit messages

## 📊 Target Users

- Investment bankers
- Equity analysts
- Private equity professionals
- Corporate finance teams
- CFOs and FP&A teams
- Accountants and auditors

## 🎯 North Star Metric

**"Minutes saved per analyst per day"** — target >60 minutes daily productivity lift.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions, please contact the Cascade team or create an issue in this repository.
