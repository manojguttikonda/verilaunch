import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Wand2, Download, Plus } from 'lucide-react';

interface ResumeVersion {
  id: string;
  version: number;
  createdAt: string;
  isActive: boolean;
}

const mockVersions: ResumeVersion[] = [
  { id: '1', version: 3, createdAt: '2026-05-08T12:00:00Z', isActive: true },
  { id: '2', version: 2, createdAt: '2026-04-01T10:00:00Z', isActive: false },
  { id: '3', version: 1, createdAt: '2026-03-01T09:00:00Z', isActive: false },
];

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'versions' | 'tailor'>('versions');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Resume Builder</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          AI-generated ATS-friendly resumes grounded entirely in your verified profile data.
        </p>
      </div>

      {/* Policy Banner */}
      <div style={{
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 12,
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.25rem' }}>🛡️</span>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Factual Grounding Policy:</strong> All resume content is generated
          exclusively from your verified profile data. No achievements, credentials, or employment history are ever invented.
        </p>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['versions', 'tailor'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              background: activeTab === tab ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'versions' ? 'My Resumes' : '✨ AI Tailor'}
          </button>
        ))}
      </div>

      {activeTab === 'versions' && (
        <>
          <Button style={{ marginBottom: '1.5rem' }}>
            <Plus size={18} /> Generate New Resume
          </Button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockVersions.map(v => (
              <Card key={v.id} className="">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FileText size={28} color="var(--accent-primary)" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <p style={{ fontWeight: 600 }}>Resume v{v.version}</p>
                        {v.isActive && (
                          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                            Active
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Created {new Date(v.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="ghost" style={{ padding: '0.5rem' }}><Download size={16} /></Button>
                    <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'tailor' && (
        <Card className="">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wand2 size={20} color="var(--accent-primary)" /> AI Resume Tailoring
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Paste the job description below. The AI agent will optimize your resume for this role without
              adding any fabricated content.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label>Job Description</label>
              <textarea
                placeholder="Paste the full job description here..."
                rows={8}
                style={{ resize: 'vertical', width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '0.75rem 1rem', borderRadius: 8, fontFamily: 'inherit' }}
              />
            </div>
            <Button>
              <Wand2 size={18} /> Tailor My Resume
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ResumeBuilder;
