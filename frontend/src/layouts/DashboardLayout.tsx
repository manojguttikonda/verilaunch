import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut, FileText, Search, Shield, Send, Building2 } from 'lucide-react';

const navItems = [
  { to: '/jobs', icon: Search, label: 'Job Search' },
  { to: '/resume', icon: FileText, label: 'Resume Builder' },
  { to: '/verification', icon: Shield, label: 'Verification' },
  { to: '/applications', icon: Send, label: 'Applications' },
  { to: '/employer', icon: Building2, label: 'Employer Portal' },
  { to: '/onboarding', icon: User, label: 'My Profile' },
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1 }}>VeriLaunch</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>Enterprise AI Marketplace</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0.75rem 0.625rem', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-primary)' : 'transparent',
                transition: 'all 0.15s',
              })}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sign Out */}
        <div style={{ padding: '0.75rem 0.625rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
              padding: '0.625rem 0.875rem', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontSize: '0.875rem', color: '#ef4444',
              background: 'transparent', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
