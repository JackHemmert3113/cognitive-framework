/**
 * Button Component
 * Reusable UI component
 */
import React from 'react';
import Utils from '@monorepo/shared';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  loading = false 
}) => {
  const handleClick = Utils.debounce((e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  }, 300);

  const className = `btn btn-${variant} ${disabled ? 'btn-disabled' : ''} ${loading ? 'btn-loading' : ''}`;

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? <span className="spinner" /> : null}
      {children}
    </button>
  );
};

export default Button;