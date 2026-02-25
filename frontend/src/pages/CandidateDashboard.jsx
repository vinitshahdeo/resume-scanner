import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumesAPI, jobsAPI } from '../services/api';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('resumes');
  const [selectedJob, setSelectedJob] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await resumesAPI.upload(file);
      await loadData();
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await resumesAPI.deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
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
          <p>Manage your resumes and browse job opportunities</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{resumes.length}</div>
            <div className="stat-label">Resumes Uploaded</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Available Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">--</div>
            <div className="stat-label">Match Score (Coming Soon)</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              className={`btn ${activeTab === 'resumes' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('resumes')}
            >
              My Resumes
            </button>
            <button
              className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('jobs')}
            >
              Browse Jobs
            </button>
          </div>

          {activeTab === 'resumes' && (
            <>
              <div
                className="upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <div className="upload-icon">📄</div>
                <h3>{uploading ? 'Uploading...' : 'Upload Your Resume'}</h3>
                <p>Click to browse or drag and drop (PDF, DOC, DOCX)</p>
              </div>

              <div className="list-grid" style={{ marginTop: 20 }}>
                {resumes.length === 0 ? (
                  <div className="empty-state" style={{ color: '#666' }}>
                    <h3>No resumes yet</h3>
                    <p>Upload your first resume to get started</p>
                  </div>
                ) : (
                  resumes.map((resume) => (
                    <div key={resume.id} className="list-item">
                      <div className="list-item-info">
                        <h3>{resume.title || resume.originalName}</h3>
                        <div className="list-item-meta">
                          <span>📅 {new Date(resume.uploadedAt).toLocaleDateString()}</span>
                          <span>📁 {resume.originalName}</span>
                        </div>
                      </div>
                      <div className="list-item-actions">
                        <a
                          href={resumesAPI.downloadResume(resume.id)}
                          className="btn btn-secondary"
                          target="_blank"
                        >
                          Download
                        </a>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteResume(resume.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'jobs' && (
            <div className="list-grid">
              {jobs.length === 0 ? (
                <div className="empty-state" style={{ color: '#666' }}>
                  <h3>No jobs available</h3>
                  <p>Check back later for new opportunities</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="list-item">
                    <div className="list-item-info">
                      <h3>{job.title}</h3>
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
                        className="btn btn-primary"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedJob.title}</h2>
              <button className="modal-close" onClick={() => setSelectedJob(null)}>
                ×
              </button>
            </div>
            <p style={{ color: '#666', marginBottom: 20 }}>
              {selectedJob.company} • {selectedJob.location}
            </p>
            {selectedJob.salaryRange && (
              <p style={{ marginBottom: 20 }}>
                <strong>Salary:</strong> {selectedJob.salaryRange}
              </p>
            )}
            <h4 style={{ marginBottom: 10 }}>Description</h4>
            <p style={{ color: '#666', marginBottom: 20, whiteSpace: 'pre-wrap' }}>
              {selectedJob.description}
            </p>
            <h4 style={{ marginBottom: 10 }}>Requirements</h4>
            <ul style={{ color: '#666', marginLeft: 20, marginBottom: 20 }}>
              {selectedJob.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
            {selectedJob.skills && selectedJob.skills.length > 0 && (
              <>
                <h4 style={{ marginBottom: 10 }}>Skills</h4>
                <div className="tags">
                  {selectedJob.skills.map((skill, i) => (
                    <span key={i} className="tag">{skill}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
