import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Clock, AlertTriangle, XCircle, Upload } from 'lucide-react';

interface VerificationRecord {
  id: string;
  verificationType: string;
  status: 'PENDING' | 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'NEEDS_REVIEW' | 'REJECTED';
  confidenceScore: number | null;
  createdAt: string;
}

const statusConfig = {
  VERIFIED: { icon: CheckCircle, color: '#10b981', label: 'Verified' },
  PARTIALLY_VERIFIED: { icon: AlertTriangle, color: '#f59e0b', label: 'Partially Verified' },
  NEEDS_REVIEW: { icon: Clock, color: '#6366f1', label: 'Needs Review' },
  PENDING: { icon: Clock, color: '#6b6b7b', label: 'Pending' },
  REJECTED: { icon: XCircle, color: '#ef4444', label: 'Rejected' },
};

const mockRecords: VerificationRecord[] = [
  { id: '1', verificationType: 'EMPLOYMENT', status: 'VERIFIED', confidenceScore: 97, createdAt: new Date().toISOString() },
  { id: '2', verificationType: 'EDUCATION', status: 'PARTIALLY_VERIFIED', confidenceScore: 74, createdAt: new Date().toISOString() },
  { id: '3', verificationType: 'IDENTITY', status: 'PENDING', confidenceScore: null, createdAt: new Date().toISOString() },
];

const VerificationStatus: React.FC = () => {
  const [records, setRecords] = useState<VerificationRecord[]>(mockRecords);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verification Status</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track the verification of your employment history, education, and identity.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {records.map((record) => {
          const cfg = statusConfig[record.status];
          const Icon = cfg.icon;
          return (
            <Card key={record.id} className="">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Icon size={28} color={cfg.color} />
                  <div>
                    <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {record.verificationType.toLowerCase()} Verification
                    </p>
                    <p style={{ fontSize: '0.85rem', color: cfg.color, marginTop: '0.25rem' }}>{cfg.label}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {record.confidenceScore !== null && (
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: cfg.color }}>
                      {record.confidenceScore}%
                    </p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence</p>
                </div>
              </div>
              {record.status === 'PENDING' && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <Button variant="secondary" style={{ gap: '0.5rem' }}>
                    <Upload size={16} /> Upload Supporting Document
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationStatus;
