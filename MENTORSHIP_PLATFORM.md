# Mentorship & Career Coaching Platform

## Overview

A comprehensive mentorship and career coaching platform designed to help university students prepare for job interviews and create professional CVs. Built to compete with platforms like One Strategy Group, offering similar features with modern technology.

## Features Implemented

### 1. Student & Mentor Profiles
- **Student Profiles**: Complete profile management with university info, target industries, skills, and career goals
- **Mentor Profiles**: Industry experts with verified credentials, ratings, and availability
- **Profile Matching**: AI-powered mentor matching based on industry, expertise, and student goals

### 2. CV/Resume Management
- **Multiple CV Versions**: Students can create and manage multiple CV versions
- **AI-Powered Review**: Automated CV analysis with scoring and detailed feedback
- **Mentor Feedback**: Mentors can provide personalized feedback on student CVs
- **Primary CV Selection**: Mark one CV as primary for applications
- **Status Tracking**: Track CV status (Draft, Under Review, Approved, Needs Revision)

### 3. Interview Preparation
- **Question Bank**: Comprehensive database of interview questions
  - Technical questions
  - Behavioral questions
  - Case study questions
  - System design questions
  - Brain teasers
- **Question Filtering**: Filter by type, industry, difficulty, and category
- **Practice Sets**: Generate custom practice question sets
- **Recommended Questions**: AI-suggested questions based on student profile
- **Question Search**: Full-text search across the question bank

### 4. Mock Interviews
- **Scheduled Interviews**: Book mock interviews with mentors
- **Auto-Generated Questions**: Questions automatically generated based on interview type and industry
- **Answer Submission**: Students can submit answers during the interview
- **AI Feedback**: Comprehensive AI-powered feedback after completion
- **Recording Support**: Optional recording URL for review
- **Scoring System**: Overall score with strengths and improvement areas

### 5. Mentorship Sessions
- **Session Scheduling**: Book one-on-one sessions with mentors
- **Session Types**: 
  - One-on-one coaching
  - Group sessions
  - Workshops
  - Webinars
  - Mock interviews
  - CV reviews
  - Networking events
- **Session Management**: Track session status, duration, and notes
- **Feedback System**: Bidirectional feedback (student ↔ mentor)
- **Rating System**: Rate mentors after sessions

### 6. Progress Tracking
- **Metrics Tracking**: Track progress across multiple categories
  - CV Quality
  - Interview Skills
  - Technical Skills
  - Networking
  - Applications
  - Offers
  - Confidence
- **Goal Setting**: Set targets and track progress

### 7. Job Offers Management
- **Offer Tracking**: Track job offers with details
  - Company, role, industry
  - Salary, bonus, total compensation
  - Offer dates and deadlines
  - Status (Pending, Accepted, Declined, Negotiating, Expired)

## Database Schema

### Core Models
- **StudentProfile**: Student information and preferences
- **MentorProfile**: Mentor credentials and availability
- **CV**: Resume/CV documents with versions
- **MockInterview**: Mock interview sessions
- **InterviewQuestion**: Question bank entries
- **MentorshipSession**: Coaching sessions
- **ProgressTracking**: Student progress metrics
- **JobOffer**: Job offer tracking
- **Alumni**: Alumni network
- **NetworkingEvent**: Events and meetups
- **ResourceLibrary**: Learning resources

## API Endpoints

### Mentorship Routes (`/api/mentorship`)
- `POST /student/profile` - Create/update student profile
- `GET /student/profile` - Get student profile
- `POST /mentor/profile` - Create/update mentor profile
- `GET /mentor/profile` - Get mentor profile
- `GET /mentors/match` - Find matching mentors
- `POST /sessions` - Schedule mentorship session
- `GET /sessions/student` - Get student's sessions
- `GET /sessions/mentor` - Get mentor's sessions
- `PATCH /sessions/:sessionId/status` - Update session status
- `POST /sessions/:sessionId/feedback` - Add session feedback

### CV Routes (`/api/cv`)
- `POST /` - Create CV
- `GET /` - Get student's CVs
- `GET /:cvId` - Get specific CV
- `PUT /:cvId` - Update CV
- `DELETE /:cvId` - Delete CV
- `POST /:cvId/primary` - Set as primary CV
- `POST /:cvId/review/ai` - Get AI review
- `POST /:cvId/review/mentor` - Add mentor feedback
- `POST /:cvId/approve` - Approve CV

### Interview Routes (`/api/interviews`)
- `GET /questions` - Get interview questions (public)
- `GET /questions/practice` - Get practice set (public)
- `GET /questions/search` - Search questions (public)
- `POST /questions` - Create question (mentor only)
- `GET /questions/recommended` - Get recommended questions
- `POST /mock` - Schedule mock interview
- `GET /mock` - Get student's mock interviews
- `GET /mock/:interviewId` - Get specific interview
- `POST /mock/:interviewId/start` - Start interview
- `POST /mock/:interviewId/answer` - Submit answer
- `POST /mock/:interviewId/complete` - Complete interview
- `POST /mock/:interviewId/cancel` - Cancel interview

## Services Architecture

### MentorshipService
- Profile management (student & mentor)
- Mentor matching algorithm
- Session scheduling and management
- Feedback and rating system

### CVReviewService
- CV creation and versioning
- AI-powered review using LLM
- Mentor feedback integration
- Scoring and status management

### InterviewPreparationService
- Question bank management
- Practice set generation
- Question search and filtering
- Recommendation engine

### MockInterviewService
- Interview scheduling
- Question generation
- Answer collection
- AI feedback generation
- Recording support

## Key Features Comparison with Competitor

| Feature | One Strategy Group | Our Platform |
|---------|-------------------|--------------|
| 24/7 Mentorship | ✅ | ✅ (via messaging) |
| Multiple Mentors | ✅ (40+ per student) | ✅ (configurable) |
| CV Review | ✅ | ✅ (AI + Mentor) |
| Mock Interviews | ✅ | ✅ (with AI feedback) |
| Technical Training | ✅ | ✅ (question bank) |
| Behavioral Training | ✅ | ✅ (question bank) |
| Progress Tracking | ✅ | ✅ |
| Alumni Network | ✅ | ✅ (model ready) |
| Verified Outcomes | ✅ | ✅ (job offers tracking) |

## Next Steps for Full Implementation

1. **Database Migration**: Run Prisma migrations to create tables
   ```bash
   cd backend
   npm run db:migrate
   ```

2. **Frontend Components**: Create React components for:
   - Student dashboard
   - Mentor dashboard
   - CV builder/editor
   - Mock interview interface
   - Session scheduling calendar
   - Progress tracking charts

3. **Real-time Features**: Add WebSocket support for:
   - Live messaging with mentors
   - Real-time interview sessions
   - Notifications

4. **File Storage**: Integrate file storage for:
   - CV document uploads
   - Interview recordings
   - Resource library files

5. **Email Notifications**: Set up email notifications for:
   - Session reminders
   - CV review completions
   - Interview feedback ready
   - New mentor matches

6. **Analytics Dashboard**: Build analytics for:
   - Student progress metrics
   - Mentor performance
   - Platform usage statistics
   - Success rates

7. **Payment Integration**: Add payment processing for:
   - Premium features
   - Session bookings
   - Subscription plans

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: OpenAI/Anthropic for CV reviews and feedback
- **Authentication**: JWT-based auth
- **File Storage**: (To be configured)

## Getting Started

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Set up environment variables (see `env.example`)

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

4. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation

Once the server is running, API documentation is available at:
- Swagger UI: `http://localhost:PORT/api-docs`
- Health Check: `http://localhost:PORT/health`

## Notes

- All mentorship routes require authentication
- Some interview question routes are public for browsing
- AI features require OpenAI or Anthropic API keys
- File uploads for CVs need file storage configuration
- Interview recordings need video storage solution

