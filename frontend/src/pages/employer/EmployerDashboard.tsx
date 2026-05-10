import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Users, Briefcase, Plus, CheckCircle } from 'lucide-react';

const mockJobs = [
  { id: '1', title: 'Senior Software Engineer', applicants: 12, verified: 8, status: 'OPEN' },
  { id: '2', title: 'Product Manager', applicants: 24, verified: 19, status: 'OPEN' },
  { id: '3', title: 'DevOps Engineer', applicants: 6, verified: 5, status: 'CLOSED' },
];

const EmployerDashboard: React.FC = () => {
  const [showNewJob, setShowNewJob] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Employer Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your job postings and review verified candidates.</p>
        </div>
        <Button onClick={() => setShowNewJob(!showNewJob)}>
          <Plus size={18} /> Post New Job
        </Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Active Jobs', value: 2, icon: Briefcase, color: 'var(--accent-primary)' },
          { label: 'Total Applicants', value: 42, icon: Users, color: '#10b981' },
          { label: 'Verified Profiles', value: 32, icon: CheckCircle, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <stat.icon size={32} color={stat.color} />
            <div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color }}>{stat.value}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New Job Form */}
      {showNewJob && (
        <Card className="" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 600, marginBottom: '1.25rem' }}>Post a New Job</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Job Title" placeholder="e.g. Senior Software Engineer" />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input label="Location" placeholder="e.g. Remote, New York NY" className="flex-1" />
              <Input label="Employment Type" placeholder="Full-Time" className="flex-1" />
            </div>
            <div>
              <label>Job Description</label>
              <textarea rows={5} placeholder="Describe the role, responsibilities, and requirements..." style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '0.75rem', borderRadius: 8, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button>Post Job</Button>
              <Button variant="secondary" onClick={() => setShowNewJob(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Job Listings */}
      <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>Your Job Postings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mockJobs.map(job => (
          <Card key={job.id} className="">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 600 }}>{job.title}</p>
                  <span style={{
                    padding: '2px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
                    background: job.status === 'OPEN' ? 'rgba(16,185,129,0.15)' : 'rgba(107,107,123,0.2)',
                    color: job.status === 'OPEN' ? '#10b981' : 'var(--text-muted)'
                  }}>{job.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span><Users size={14} style={{ display: 'inline', marginRight: 4 }} />{job.applicants} Applicants</span>
                  <span><CheckCircle size={14} style={{ display: 'inline', marginRight: 4 }} />{job.verified} Verified</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>View Candidates</Button>
                {job.status === 'OPEN' && (
                  <Button variant="ghost" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', color: '#ef4444' }}>Close</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployerDashboard;
