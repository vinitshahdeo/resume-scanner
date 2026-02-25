import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-content">
          <h1>Match Talent with Opportunity</h1>
          <p>
            AI-powered resume matching platform that connects the right candidates 
            with the right jobs. Upload your resume or post your job openings today.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ background: 'white' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>
      
      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>For Candidates</h3>
            <p>
              Upload your resume and let our AI match you with relevant job opportunities. 
              Get notified when recruiters are interested in your profile.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>For Recruiters</h3>
            <p>
              Post job openings and instantly find qualified candidates. 
              Our AI analyzes skills and experience to provide match scores.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Matching</h3>
            <p>
              Advanced algorithms analyze resumes and job requirements to 
              provide accurate match scores and recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
