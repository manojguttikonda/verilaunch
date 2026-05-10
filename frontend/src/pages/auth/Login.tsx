import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authApi } from '../../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('vl_token', res.token);
      localStorage.setItem('vl_role', res.role);
      navigate('/jobs');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to your VeriLaunch account</p>
        </div>

        <Card>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              type="email"
              name="email"
              id="login-email"
              label="Email Address"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              type="password"
              name="password"
              id="login-password"
              label="Password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', marginBottom: 0 }}>
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <a href="#" style={{ color: 'var(--accent-primary)' }}>Forgot password?</a>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full" style={{ marginTop: '0.5rem' }}>
              Sign In
            </Button>

            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'white', textDecoration: 'underline' }}>Sign up</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
