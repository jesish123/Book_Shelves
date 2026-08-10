import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-3xl px-4 py-8">
        <div className="flex items-start justify-center">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
