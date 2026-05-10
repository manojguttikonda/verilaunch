import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'ROLE_CANDIDATE' | 'ROLE_EMPLOYER'>('ROLE_CANDIDATE');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirm = data.get('confirm') as string;

    if (password !== confirm) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.register(email, password, role);
      // Auto-login after registration
      const res = await authApi.login(email, password);
      localStorage.setItem('vl_token', res.token);
      localStorage.setItem('vl_role', res.role);
      navigate(role === 'ROLE_CANDIDATE' ? '/onboarding' : '/employer');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Join VeriLaunch
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your enterprise account</p>
        </div>

        <Card>
          {/* Role Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {(['ROLE_CANDIDATE', 'ROLE_EMPLOYER'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: '0.625rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.15s',
                  background: role === r ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                }}
              >
                {r === 'ROLE_CANDIDATE' ? '🧑‍💼 Candidate' : '🏢 Employer'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <Input type="email" name="email" id="reg-email" label="Email Address" placeholder="you@company.com" required />
            <Input type="password" name="password" id="reg-password" label="Password" placeholder="Min. 8 characters" required />
            <Input type="password" name="confirm" id="reg-confirm" label="Confirm Password" placeholder="Repeat your password" required />

            <Button type="submit" isLoading={isLoading} className="w-full" style={{ marginTop: '0.5rem' }}>
              Create Account
            </Button>

            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'white', textDecoration: 'underline' }}>Sign in</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
