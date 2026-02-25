# Resume Scanner 📄

An AI-powered resume matching platform that connects candidates with job opportunities. Built with React and NestJS.

## Features

### For Candidates 👤
- Upload and manage multiple resumes
- Browse available job postings
- View job details and requirements
- Download uploaded resumes

### For Recruiters 🏢
- Create and manage job postings
- Browse candidate resumes
- Download candidate resumes
- Define job requirements and skills

### Coming Soon 🚀
- AI-powered resume parsing
- Match score calculation
- Skill extraction from resumes
- Job recommendations

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router
- **Backend**: NestJS, TypeORM, SQLite, JWT Authentication
- **Styling**: Custom CSS with modern design

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd resume-scanner
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (Terminal 1)
   ```bash
   cd backend
   npm run start:dev
   ```
   Backend runs at http://localhost:4000

2. **Start the frontend development server** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs at http://localhost:3000

### Demo Walkthrough

1. **Register as a Candidate**
   - Go to http://localhost:3000
   - Click "Get Started"
   - Select "Candidate" role
   - Fill in your details and register

2. **Upload a Resume**
   - Click "Upload Your Resume"
   - Select a PDF or DOC file
   - View your uploaded resumes

3. **Register as a Recruiter** (use different browser/incognito)
   - Click "Get Started"
   - Select "Recruiter" role
   - Fill in your details and register

4. **Create a Job Posting**
   - Click "Post New Job"
   - Fill in job details (title, company, requirements, skills)
   - Submit the job posting

5. **Browse & Download**
   - Candidates can browse jobs and view details
   - Recruiters can browse and download candidate resumes

## Project Structure

```
resume-scanner/
├── backend/
│   └── src/
│       ├── auth/         # Authentication module (JWT)
│       ├── users/        # User entity and service
│       ├── resumes/      # Resume upload and management
│       ├── jobs/         # Job posting management
│       ├── app.module.ts # Main app module
│       └── main.ts       # Application entry point
├── frontend/
│   └── src/
│       ├── components/   # Reusable components
│       ├── context/      # Auth context
│       ├── pages/        # Page components
│       ├── services/     # API services
│       └── App.tsx       # Main app component
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile

### Resumes
- `POST /resumes/upload` - Upload resume (multipart/form-data)
- `GET /resumes/my` - Get user's resumes
- `GET /resumes/all` - Get all resumes (recruiters)
- `GET /resumes/:id/download` - Download resume
- `DELETE /resumes/:id` - Delete resume

### Jobs
- `POST /jobs` - Create job posting
- `GET /jobs` - Get all jobs
- `GET /jobs/recruiter/my` - Get recruiter's jobs
- `GET /jobs/:id` - Get job details
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job

## Future Enhancements

1. **Resume Parsing** - Extract text and skills from uploaded PDFs
2. **Match Scoring** - Calculate compatibility between resumes and jobs
3. **Email Notifications** - Notify candidates of matching jobs
4. **Advanced Search** - Filter jobs by skills, location, salary
5. **Application Tracking** - Let candidates apply directly to jobs

## License

MIT
