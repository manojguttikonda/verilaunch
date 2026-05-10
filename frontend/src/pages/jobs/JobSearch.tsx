import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MapPin, Briefcase, DollarSign, Search, Star } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salaryMin: number;
  salaryMax: number;
  matchScore: number;
  description: string;
}

const mockJobs: Job[] = [
  { id: '1', title: 'Senior Software Engineer', company: 'TechCorp', location: 'New York, NY', employmentType: 'Full-Time', salaryMin: 160000, salaryMax: 200000, matchScore: 92, description: 'Build scalable distributed systems with Java and AWS.' },
  { id: '2', title: 'Staff Platform Engineer', company: 'Acme Inc.', location: 'Remote', employmentType: 'Full-Time', salaryMin: 180000, salaryMax: 240000, matchScore: 78, description: 'Lead platform infrastructure improvements across cloud environments.' },
  { id: '3', title: 'Backend Engineer', company: 'Startup Labs', location: 'Austin, TX', employmentType: 'Full-Time', salaryMin: 130000, salaryMax: 170000, matchScore: 65, description: 'Help build the core backend API infrastructure for our growing product.' },
];

const JobSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [jobs] = useState<Job[]>(mockJobs);

  const filtered = jobs.filter(j =>
    !keyword || j.title.toLowerCase().includes(keyword.toLowerCase()) || j.description.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Job Search</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI-matched opportunities based on your verified profile.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <Input
          label="Search Jobs"
          placeholder="Role, skill, company..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button style={{ height: 44 }}><Search size={18} /> Search</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(job => (
          <Card key={job.id} className="">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{job.title}</h2>
                  <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)' }}>
                    {job.employmentType}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>{job.company}</p>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} />{job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={14} />${(job.salaryMin / 1000).toFixed(0)}k–${(job.salaryMax / 1000).toFixed(0)}k</span>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{job.description}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem', minWidth: 120 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: job.matchScore >= 80 ? '#10b981' : job.matchScore >= 60 ? '#f59e0b' : 'var(--text-secondary)' }}>
                    {job.matchScore}%
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Match</p>
                </div>
                <Button>Apply</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
