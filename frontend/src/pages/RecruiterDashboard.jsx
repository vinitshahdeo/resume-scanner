import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, resumesAPI } from '../services/api';

const initialJobForm = {
  title: '',
  company: '',
  location: '',
  description: '',
  requirements: '',
  skills: '',
  salaryRange: '',
};

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, resumesRes] = await Promise.all([
        jobsAPI.getMyJobs(),
        resumesAPI.getAllResumes(),
      ]);
      setJobs(jobsRes.data);
      setResumes(resumesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await jobsAPI.create({
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        description: jobForm.description,
        requirements: jobForm.requirements.split('\n').filter((r) => r.trim()),
        skills: jobForm.skills.split(',').map((s) => s.trim()).filter((s) => s),
        salaryRange: jobForm.salaryRange || undefined,
      });
      setShowJobModal(false);
      setJobForm(initialJobForm);
      await loadData();
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job posting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobsAPI.deleteJob(id);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Manage job postings and find qualified candidates</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{resumes.length}</div>
            <div className="stat-label">Available Resumes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">--</div>
            <div className="stat-label">Matches (Coming Soon)</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('jobs')}
              >
                My Job Postings
              </button>
              <button
                className={`btn ${activeTab === 'resumes' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('resumes')}
              >
                Browse Resumes
              </button>
            </div>
            {activeTab === 'jobs' && (
              <button className="btn btn-primary" onClick={() => setShowJobModal(true)}>
                + Post New Job
              </button>
            )}
          </div>

          {activeTab === 'jobs' && (
            <div className="list-grid">
              {jobs.length === 0 ? (
                <div className="empty-state" style={{ color: '#666' }}>
                  <h3>No job postings yet</h3>
                  <p>Create your first job posting to start finding candidates</p>
                  <button className="btn btn-primary" onClick={() => setShowJobModal(true)}>
                    Post Your First Job
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="list-item">
                    <div className="list-item-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h3>{job.title}</h3>
                        <span className={`badge badge-${job.status}`}>{job.status}</span>
                      </div>
                      <p>{job.company} • {job.location}</p>
                      <div className="list-item-meta">
                        <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                        {job.salaryRange && <span>💰 {job.salaryRange}</span>}
                      </div>
                      {job.skills && job.skills.length > 0 && (
                        <div className="tags">
                          {job.skills.slice(0, 5).map((skill, i) => (
                            <span key={i} className="tag">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="list-item-actions">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'resumes' && (
            <div className="list-grid">
              {resumes.length === 0 ? (
                <div className="empty-state" style={{ color: '#666' }}>
                  <h3>No resumes available</h3>
                  <p>Candidates haven't uploaded any resumes yet</p>
                </div>
              ) : (
                resumes.map((resume) => (
                  <div key={resume.id} className="list-item">
                    <div className="list-item-info">
                      <h3>{resume.user?.name || 'Unknown Candidate'}</h3>
                      <p>{resume.user?.email}</p>
                      <div className="list-item-meta">
                        <span>📄 {resume.originalName}</span>
                        <span>📅 {new Date(resume.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="list-item-actions">
                      <a
                        href={resumesAPI.downloadResume(resume.id)}
                        className="btn btn-primary"
                        target="_blank"
                      >
                        Download Resume
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {showJobModal && (
        <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post New Job</h2>
              <button className="modal-close" onClick={() => setShowJobModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  placeholder="Company name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA or Remote"
                  required
                />
              </div>
              <div className="form-group">
                <label>Salary Range</label>
                <input
                  type="text"
                  value={jobForm.salaryRange}
                  onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                  placeholder="e.g., $120,000 - $150,000"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe the role and responsibilities..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Requirements * (one per line)</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="5+ years of experience&#10;Bachelor's degree in CS&#10;Strong communication skills"
                  required
                />
              </div>
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={jobForm.skills}
                  onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, AWS"
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowJobModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
