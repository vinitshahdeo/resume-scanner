# Resume Scanner Frontend - Complete Documentation

> A comprehensive guide for beginners to understand the React frontend codebase

## Table of Contents

1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Core Concepts](#core-concepts)
5. [File-by-File Breakdown](#file-by-file-breakdown)
6. [Data Flow](#data-flow)
7. [Authentication System](#authentication-system)
8. [API Integration](#api-integration)
9. [Routing](#routing)
10. [Styling](#styling)
11. [Common Patterns Used](#common-patterns-used)
12. [Glossary](#glossary)

---

## Introduction

This is a **React** frontend application for a Resume Scanner platform. The app allows two types of users:

- **Candidates**: Job seekers who can upload resumes and browse job listings
- **Recruiters**: Hiring managers who can post jobs and view candidate resumes

### Technologies Used

| Technology | Purpose |
|------------|---------|
| React 19 | UI library for building user interfaces |
| React Router | Navigation and routing between pages |
| Axios | HTTP client for API requests |
| Vite | Build tool and development server |
| CSS | Styling (no framework, custom CSS) |

---

## Project Structure

```
frontend/
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
└── src/
    ├── main.jsx            # Application entry point (renders React)
    ├── App.jsx             # Main component with routing
    ├── index.css           # Global styles
    ├── context/
    │   └── AuthContext.jsx # Authentication state management
    ├── services/
    │   └── api.js          # API functions for backend communication
    ├── components/
    │   └── Navbar.jsx      # Navigation bar component
    └── pages/
        ├── Landing.jsx           # Home page for non-logged-in users
        ├── Login.jsx             # Login page
        ├── Register.jsx          # Registration page
        ├── CandidateDashboard.jsx # Dashboard for candidates
        └── RecruiterDashboard.jsx # Dashboard for recruiters
```

### What Each Folder Contains

| Folder | Purpose |
|--------|---------|
| `src/` | All source code lives here |
| `src/context/` | React Context for global state (like authentication) |
| `src/services/` | Functions to communicate with the backend API |
| `src/components/` | Reusable UI components used across multiple pages |
| `src/pages/` | Full page components (each represents a route/URL) |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher installed
- npm (comes with Node.js)

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:3000`

### Available Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts development server with hot reload |
| `npm run build` | Creates production build |
| `npm run preview` | Preview production build locally |

---

## Core Concepts

Before diving into the code, let's understand some key React concepts used in this project:

### 1. Components

Components are reusable pieces of UI. In React, everything is a component. There are two types:

```jsx
// Function Component (what we use in this project)
function MyComponent() {
  return <div>Hello World</div>;
}
```

### 2. JSX

JSX lets you write HTML-like syntax in JavaScript:

```jsx
// This is JSX
const element = <h1>Hello, {userName}!</h1>;
```

### 3. State (useState)

State is data that can change over time. When state changes, React re-renders the component:

```jsx
import { useState } from 'react';

function Counter() {
  // useState returns [currentValue, functionToUpdateIt]
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

### 4. Effects (useEffect)

Effects run code after the component renders. Commonly used for:
- Fetching data from APIs
- Setting up subscriptions
- Updating the document title

```jsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // This runs after component mounts (appears on screen)
    console.log('Component is ready!');
    
    // Fetch data, set up listeners, etc.
  }, []); // Empty array = run only once when component mounts
}
```

### 5. Context

Context provides a way to share data across many components without passing props manually at every level:

```jsx
// Instead of: App → Page → Section → Button (passing props through each)
// With context: App → Context Provider → Any component can access directly
```

---

## File-by-File Breakdown

### 1. `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resume Scanner</title>
  </head>
  <body>
    <div id="root"></div>  <!-- React renders here -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**What it does**: This is the only HTML file. React will inject the entire app into the `<div id="root">` element.

---

### 2. `src/main.jsx` - Application Entry Point

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Line-by-line explanation**:

| Line | What it does |
|------|--------------|
| `import React from 'react'` | Import React library |
| `import ReactDOM from 'react-dom/client'` | Import ReactDOM for rendering to browser |
| `import { BrowserRouter }` | Import router for navigation |
| `import App from './App'` | Import our main App component |
| `import { AuthProvider }` | Import authentication context provider |
| `import './index.css'` | Import global styles |
| `ReactDOM.createRoot(...)` | Create a root for React to render into |
| `.render(...)` | Render our app components |

**The component tree structure**:

```
React.StrictMode (development warnings)
  └── BrowserRouter (enables routing)
       └── AuthProvider (provides auth state to all children)
            └── App (our main component)
```

**Why this order matters**: 
- `BrowserRouter` must wrap anything that uses routing
- `AuthProvider` must wrap anything that needs auth state
- `App` is inside both, so it can use routing AND auth

---

### 3. `src/App.jsx` - Main Application Component

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Navbar from './components/Navbar';

function App() {
  // Get user and loading state from AuthContext
  const { user, loading } = useAuth();

  // Show spinner while checking if user is logged in
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Only show Navbar if user is logged in */}
      {user && <Navbar />}
      
      <Routes>
        {/* Home: Show Landing if not logged in, redirect to dashboard if logged in */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Landing />} 
        />
        
        {/* Login: Redirect to dashboard if already logged in */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        {/* Register: Redirect to dashboard if already logged in */}
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register />} 
        />
        
        {/* Dashboard: Show different dashboard based on user role */}
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === 'candidate' ? (
                <CandidateDashboard />
              ) : (
                <RecruiterDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
```

**Key concepts**:

1. **Conditional Rendering**: `{user && <Navbar />}` only renders Navbar when user exists
2. **Route Protection**: Dashboard checks if user is logged in, redirects to login if not
3. **Role-based Rendering**: Dashboard shows different component based on `user.role`

**Route breakdown**:

| URL | Logged Out | Logged In (Candidate) | Logged In (Recruiter) |
|-----|------------|----------------------|----------------------|
| `/` | Landing page | → `/dashboard` | → `/dashboard` |
| `/login` | Login form | → `/dashboard` | → `/dashboard` |
| `/register` | Register form | → `/dashboard` | → `/dashboard` |
| `/dashboard` | → `/login` | CandidateDashboard | RecruiterDashboard |

---

### 4. `src/context/AuthContext.jsx` - Authentication State Management

This is the heart of authentication. Let's break it down completely:

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Step 1: Create a Context object
// Think of this as creating an empty container that can hold data
const AuthContext = createContext(null);

// Step 2: Create a Provider component
// This component will PROVIDE auth data to all its children
export function AuthProvider({ children }) {
  // State to store the logged-in user (null = not logged in)
  const [user, setUser] = useState(null);
  
  // State to track if we're checking for existing login
  const [loading, setLoading] = useState(true);

  // Step 3: Check for existing login when app starts
  useEffect(() => {
    // Look for saved token in browser storage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Token exists! Try to get user profile
      authAPI.getProfile()
        .then((res) => setUser(res.data))  // Success: set user
        .catch(() => {
          // Token invalid/expired: remove it
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));  // Done checking
    } else {
      // No token: user is not logged in
      setLoading(false);
    }
  }, []);  // Empty array = run only once on mount

  // Step 4: Login function
  const login = async (email, password) => {
    // Call backend login API
    const res = await authAPI.login({ email, password });
    
    // Save token for future requests
    localStorage.setItem('token', res.data.access_token);
    
    // Update user state (this triggers re-render)
    setUser(res.data.user);
  };

  // Step 5: Register function
  const register = async (email, password, name, role) => {
    // Call backend register API
    const res = await authAPI.register({ email, password, name, role });
    
    // Save token and set user (same as login)
    localStorage.setItem('token', res.data.access_token);
    setUser(res.data.user);
  };

  // Step 6: Logout function
  const logout = () => {
    // Remove token from storage
    localStorage.removeItem('token');
    
    // Clear user state (sets to null)
    setUser(null);
  };

  // Step 7: Provide all auth data and functions to children
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 8: Custom hook for easy access to auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Safety check: ensure useAuth is used inside AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
```

**How to use `useAuth()` in any component**:

```jsx
import { useAuth } from '../context/AuthContext';

function SomeComponent() {
  // Get auth data and functions
  const { user, loading, login, register, logout } = useAuth();
  
  // Check if logged in
  if (user) {
    console.log('Logged in as:', user.name);
    console.log('Role:', user.role);  // 'candidate' or 'recruiter'
  }
  
  // Call logout
  const handleLogout = () => {
    logout();  // This clears user and removes token
  };
}
```

**What `user` object looks like**:

```javascript
{
  id: "abc-123-def",
  email: "john@example.com",
  name: "John Doe",
  role: "candidate"  // or "recruiter"
}
```

---

### 5. `src/services/api.js` - Backend Communication

This file contains all functions to talk to the backend server:

```javascript
import axios from 'axios';

// Backend server URL
const API_URL = 'http://localhost:4000';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',  // We're sending JSON data
  },
});

// INTERCEPTOR: Runs before every request
// Automatically adds auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Add "Bearer <token>" to Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**What is an Interceptor?**

Think of it like a security checkpoint. Before any request leaves our app:
1. Interceptor checks if we have a token
2. If yes, it attaches the token to the request
3. Backend receives the token and knows who is making the request

**API Functions Explained**:

```javascript
// ============ AUTHENTICATION APIs ============

export const authAPI = {
  // Register new user
  // POST /auth/register
  // Body: { email, password, name, role }
  register: (data) => api.post('/auth/register', data),
  
  // Login existing user
  // POST /auth/login
  // Body: { email, password }
  login: (data) => api.post('/auth/login', data),
  
  // Get current user's profile (requires auth token)
  // GET /auth/profile
  getProfile: () => api.get('/auth/profile'),
};

// ============ RESUME APIs ============

export const resumesAPI = {
  // Upload a resume file
  // POST /resumes/upload
  // Body: FormData with file
  upload: (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Get logged-in user's resumes
  // GET /resumes/my
  getMyResumes: () => api.get('/resumes/my'),
  
  // Get all resumes (for recruiters)
  // GET /resumes/all
  getAllResumes: () => api.get('/resumes/all'),
  
  // Get single resume
  // GET /resumes/:id
  getResume: (id) => api.get(`/resumes/${id}`),
  
  // Delete a resume
  // DELETE /resumes/:id
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  
  // Get download URL (not an API call, just returns URL)
  downloadResume: (id) => `${API_URL}/resumes/${id}/download`,
};

// ============ JOB APIs ============

export const jobsAPI = {
  // Create new job posting (recruiters only)
  // POST /jobs
  create: (data) => api.post('/jobs', data),
  
  // Get all jobs (public)
  // GET /jobs
  getAll: () => api.get('/jobs'),
  
  // Get recruiter's own job postings
  // GET /jobs/recruiter/my
  getMyJobs: () => api.get('/jobs/recruiter/my'),
  
  // Get single job
  // GET /jobs/:id
  getJob: (id) => api.get(`/jobs/${id}`),
  
  // Update job posting
  // PUT /jobs/:id
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  
  // Delete job posting
  // DELETE /jobs/:id
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};
```

**Using these APIs in components**:

```jsx
import { jobsAPI, resumesAPI } from '../services/api';

// Fetch all jobs
const loadJobs = async () => {
  try {
    const response = await jobsAPI.getAll();
    console.log(response.data);  // Array of jobs
  } catch (error) {
    console.error('Failed to load jobs:', error);
  }
};

// Upload a resume
const uploadResume = async (file) => {
  try {
    const response = await resumesAPI.upload(file);
    console.log('Uploaded:', response.data);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

### 6. `src/components/Navbar.jsx` - Navigation Component

```jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  // Get user info and logout function from context
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Logo - links to home */}
      <Link to="/" className="navbar-brand">
        📄 <span>Resume Scanner</span>
      </Link>
      
      <div className="navbar-links">
        {/* Only show user info if logged in */}
        {user && (
          <div className="navbar-user">
            {/* Display user name and role */}
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
            
            {/* Logout button */}
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
```

**Key concept - `<Link>` vs `<a>`**:
- `<Link to="/path">` - React Router navigation (no page reload)
- `<a href="/path">` - Traditional link (causes full page reload)

Always use `<Link>` for internal navigation in React apps!

---

### 7. `src/pages/Landing.jsx` - Home Page

```jsx
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero Section - Main banner */}
      <section className="hero">
        <div className="hero-content">
          <h1>Match Talent with Opportunity</h1>
          <p>
            AI-powered resume matching platform...
          </p>
          
          {/* Call-to-action buttons */}
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          {/* Feature cards */}
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>For Candidates</h3>
            <p>Upload your resume...</p>
          </div>
          {/* More feature cards... */}
        </div>
      </section>
    </div>
  );
}
```

This is a simple **presentational component** - it just displays content with no state or logic.

---

### 8. `src/pages/Login.jsx` - Login Page

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  // Form field states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get login function from auth context
  const { login } = useAuth();
  
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    setError('');        // Clear previous errors
    setLoading(true);    // Show loading state

    try {
      // Attempt login
      await login(email, password);
      
      // Success! Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Failed - show error message
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {/* Show error if exists */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password input */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit button - disabled while loading */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Link to register */}
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Form Handling Pattern**:

1. **Controlled Inputs**: Input values are controlled by React state
   ```jsx
   value={email}                          // Display current state
   onChange={(e) => setEmail(e.target.value)}  // Update state on change
   ```

2. **Form Submission**: 
   - `onSubmit={handleSubmit}` on form
   - `e.preventDefault()` stops page reload
   - `type="submit"` button triggers form submit

3. **Loading States**: Disable button and show "Signing in..." while processing

---

### 9. `src/pages/Register.jsx` - Registration Page

Similar to Login but with additional fields:

```jsx
// Additional state for registration
const [name, setName] = useState('');
const [role, setRole] = useState('candidate');  // Default role

// Role selector component
<div className="role-selector">
  <div
    className={`role-option ${role === 'candidate' ? 'selected' : ''}`}
    onClick={() => setRole('candidate')}
  >
    <h3>👤 Candidate</h3>
    <p>Looking for jobs</p>
  </div>
  <div
    className={`role-option ${role === 'recruiter' ? 'selected' : ''}`}
    onClick={() => setRole('recruiter')}
  >
    <h3>🏢 Recruiter</h3>
    <p>Hiring talent</p>
  </div>
</div>
```

**Conditional CSS Classes**:
```jsx
className={`role-option ${role === 'candidate' ? 'selected' : ''}`}
```
This adds the `selected` class only when `role === 'candidate'`

---

### 10. `src/pages/CandidateDashboard.jsx` - Candidate Dashboard

This is the most complex component. Let's break it down:

```jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumesAPI, jobsAPI } from '../services/api';

export default function CandidateDashboard() {
  // Get current user from auth context
  const { user } = useAuth();
  
  // Data states
  const [resumes, setResumes] = useState([]);      // User's resumes
  const [jobs, setJobs] = useState([]);            // Available jobs
  
  // UI states
  const [loading, setLoading] = useState(true);    // Initial data loading
  const [uploading, setUploading] = useState(false); // File upload in progress
  const [activeTab, setActiveTab] = useState('resumes'); // Current tab
  const [selectedJob, setSelectedJob] = useState(null);  // Job for modal
  
  // Ref to file input element (for programmatic click)
  const fileInputRef = useRef(null);
```

**Understanding `useRef`**:
```jsx
const fileInputRef = useRef(null);

// Later in JSX:
<input ref={fileInputRef} type="file" ... />

// To trigger file picker:
onClick={() => fileInputRef.current?.click()}
```
`useRef` creates a reference to a DOM element so we can interact with it directly.

**Data Loading on Mount**:
```jsx
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    // Load both resumes and jobs in parallel
    const [resumesRes, jobsRes] = await Promise.all([
      resumesAPI.getMyResumes(),
      jobsAPI.getAll(),
    ]);
    setResumes(resumesRes.data);
    setJobs(jobsRes.data);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    setLoading(false);
  }
};
```

**`Promise.all` Explained**:
Instead of loading one after another:
```jsx
// Sequential (slower)
const resumes = await resumesAPI.getMyResumes();
const jobs = await jobsAPI.getAll();
```

We load both at the same time:
```jsx
// Parallel (faster)
const [resumesRes, jobsRes] = await Promise.all([
  resumesAPI.getMyResumes(),
  jobsAPI.getAll(),
]);
```

**File Upload Handler**:
```jsx
const handleFileUpload = async (e) => {
  const file = e.target.files?.[0];  // Get first selected file
  if (!file) return;

  setUploading(true);
  try {
    await resumesAPI.upload(file);
    await loadData();  // Refresh data after upload
  } catch (error) {
    console.error('Error uploading resume:', error);
    alert('Failed to upload resume');
  } finally {
    setUploading(false);
    // Reset file input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};
```

**Rendering Lists with `.map()`**:
```jsx
{resumes.map((resume) => (
  <div key={resume.id} className="list-item">
    <h3>{resume.title || resume.originalName}</h3>
    {/* ... */}
  </div>
))}
```

**Important**: Always include a unique `key` prop when rendering lists. React uses this to efficiently update the DOM.

**Modal Pattern**:
```jsx
// State to track if modal is open
const [selectedJob, setSelectedJob] = useState(null);

// Button to open modal
<button onClick={() => setSelectedJob(job)}>
  View Details
</button>

// Modal (only renders when selectedJob is not null)
{selectedJob && (
  <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      {/* Modal content */}
    </div>
  </div>
)}
```

**`e.stopPropagation()` Explained**:
- Clicking the overlay closes the modal (`setSelectedJob(null)`)
- But we don't want clicking inside the modal to close it
- `e.stopPropagation()` stops the click from "bubbling up" to the overlay

---

### 11. `src/pages/RecruiterDashboard.jsx` - Recruiter Dashboard

Similar structure to CandidateDashboard with these differences:

1. **Creating Jobs Instead of Uploading Resumes**:
```jsx
const [showJobModal, setShowJobModal] = useState(false);
const [jobForm, setJobForm] = useState({
  title: '',
  company: '',
  location: '',
  description: '',
  requirements: '',
  skills: '',
  salaryRange: '',
});

const handleCreateJob = async (e) => {
  e.preventDefault();
  await jobsAPI.create({
    title: jobForm.title,
    // Convert requirements from text to array (split by newlines)
    requirements: jobForm.requirements.split('\n').filter((r) => r.trim()),
    // Convert skills from comma-separated to array
    skills: jobForm.skills.split(',').map((s) => s.trim()).filter((s) => s),
    // ... other fields
  });
};
```

2. **Viewing Candidate Resumes**:
```jsx
// Fetch all resumes (across all candidates)
resumesAPI.getAllResumes()
```

---

## Data Flow

Here's how data flows through the application:

```
                    ┌─────────────────────────────────────────┐
                    │              Backend API                 │
                    │         (http://localhost:4000)          │
                    └──────────────────┬──────────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────────┐
                    │            services/api.js               │
                    │     (axios instance with interceptor)    │
                    └──────────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────────┐
                    │                  │                      │
                    ▼                  ▼                      ▼
           ┌───────────────┐  ┌───────────────┐    ┌───────────────┐
           │   AuthContext  │  │    Page       │    │    Page       │
           │   (login/user) │  │  Components   │    │  Components   │
           └───────┬───────┘  └───────────────┘    └───────────────┘
                   │
                   ▼
           ┌───────────────┐
           │     App.jsx    │
           │   (routing)    │
           └───────────────┘
```

**Authentication Flow**:

```
1. User enters email/password
2. Login.jsx calls useAuth().login(email, password)
3. AuthContext calls authAPI.login()
4. api.js sends POST /auth/login to backend
5. Backend returns { access_token, user }
6. AuthContext stores token in localStorage
7. AuthContext sets user state
8. App.jsx re-renders, shows dashboard
```

---

## Styling

The app uses custom CSS in `src/index.css`. Key CSS classes:

| Class | Purpose |
|-------|---------|
| `.btn` | Base button styles |
| `.btn-primary` | Purple gradient button |
| `.btn-secondary` | Gray button |
| `.btn-danger` | Red button for destructive actions |
| `.card` | White rounded container |
| `.form-group` | Form field wrapper |
| `.list-item` | List item with actions |
| `.modal-overlay` | Dark backdrop for modals |
| `.modal` | Modal content container |
| `.tags` | Container for skill tags |
| `.tag` | Individual skill tag |

---

## Common Patterns Used

### 1. Conditional Rendering

```jsx
// Using &&
{user && <Navbar />}  // Renders Navbar only if user exists

// Using ternary
{loading ? <Spinner /> : <Content />}  // If loading, show spinner, else content

// Using && with ternary
{user && (user.role === 'candidate' ? <CandidateDash /> : <RecruiterDash />)}
```

### 2. Event Handling

```jsx
// Inline handler
<button onClick={() => setCount(count + 1)}>Click</button>

// Named handler
const handleClick = () => { ... };
<button onClick={handleClick}>Click</button>

// Handler with event object
const handleChange = (e) => setValue(e.target.value);
<input onChange={handleChange} />

// Prevent default form submission
const handleSubmit = (e) => {
  e.preventDefault();
  // ... handle form
};
```

### 3. Async Operations with Loading States

```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const doSomething = async () => {
  setLoading(true);
  setError('');
  
  try {
    await someAsyncOperation();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 4. Controlled Form Inputs

```jsx
const [value, setValue] = useState('');

<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

## Glossary

| Term | Definition |
|------|------------|
| **Component** | A reusable piece of UI in React |
| **JSX** | Syntax extension that allows HTML in JavaScript |
| **State** | Data that can change and causes re-render when it does |
| **Props** | Data passed from parent to child component |
| **Hook** | Functions like `useState`, `useEffect` that add features to components |
| **Context** | Way to share data across many components without prop drilling |
| **Route** | A URL path that renders a specific component |
| **API** | Application Programming Interface - how frontend talks to backend |
| **Token** | Secret string that proves user is authenticated |
| **localStorage** | Browser storage that persists across page reloads |
| **Interceptor** | Middleware that runs before/after HTTP requests |
| **Modal** | Popup dialog that overlays the page |
| **Mount** | When a component appears on screen for the first time |
| **Re-render** | When React updates a component due to state/prop change |

---

## Next Steps for Learning

1. **Add a new page**: Try creating a Profile page where users can edit their info
2. **Add a new API call**: Implement a search feature for jobs
3. **Improve error handling**: Add toast notifications instead of alerts
4. **Add loading skeletons**: Show placeholder content while loading
5. **Implement form validation**: Add real-time validation feedback

---

## Useful Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Documentation](https://vitejs.dev)
- [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---

*Documentation created for Resume Scanner Frontend v1.0.0*
