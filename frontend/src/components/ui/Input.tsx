import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col ${className}`}>
        {label && <label htmlFor={props.id || props.name}>{label}</label>}
        <input 
          ref={ref} 
          {...props} 
          className={error ? 'border-danger' : ''}
        />
        {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
