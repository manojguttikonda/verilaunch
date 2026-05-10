import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Briefcase, Clock, CheckCircle, XCircle, Send } from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: 'DRAFT' | 'QUEUED' | 'SUBMITTED' | 'SYNCED' | 'REJECTED';
  submittedAt?: string;
  createdAt: string;
}

const statusConfig = {
  DRAFT: { icon: Clock, color: 'var(--text-muted)', label: 'Draft' },
  QUEUED: { icon: Clock, color: '#f59e0b', label: 'Awaiting Approval' },
  SUBMITTED: { icon: Send, color: 'var(--accent-primary)', label: 'Submitted' },
  SYNCED: { icon: CheckCircle, color: '#10b981', label: 'Synced to ATS' },
  REJECTED: { icon: XCircle, color: '#ef4444', label: 'Rejected' },
};

const mockApplications: Application[] = [
  { id: '1', jobTitle: 'Senior Software Engineer', company: 'TechCorp', status: 'SYNCED', submittedAt: '2026-05-01T10:00:00Z', createdAt: '2026-04-28T09:00:00Z' },
  { id: '2', jobTitle: 'Staff Platform Engineer', company: 'Acme Inc.', status: 'SUBMITTED', submittedAt: '2026-05-06T14:00:00Z', createdAt: '2026-05-05T11:00:00Z' },
  { id: '3', jobTitle: 'Backend Engineer', company: 'Startup Labs', status: 'QUEUED', createdAt: '2026-05-08T08:00:00Z' },
];

const ApplicationTracker: React.FC = () => {
  const [applications] = useState<Application[]>(mockApplications);

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Application Tracker</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track all your job applications. Applications require your approval before submission.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(['DRAFT', 'QUEUED', 'SUBMITTED', 'SYNCED'] as const).map(s => {
          const count = applications.filter(a => a.status === s).length;
          const cfg = statusConfig[s];
          return (
            <div key={s} style={{ flex: 1, minWidth: 120, padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: cfg.color }}>{count}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {applications.map(app => {
          const cfg = statusConfig[app.status];
          const Icon = cfg.icon;
          return (
            <Card key={app.id} className="">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Briefcase size={24} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600 }}>{app.jobTitle}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{app.company}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={16} color={cfg.color} />
                  <span style={{ fontSize: '0.85rem', color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
                </div>
              </div>
              {app.status === 'QUEUED' && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.75rem' }}>
                  <p style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    ⚠️ Review and approve this application before it is submitted.
                  </p>
                  <button style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
                    Approve & Submit
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTracker;
