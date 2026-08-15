import React from 'react';
import Header from '../components/Header';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full flex justify-center items-center">
        
        <div className="w-full max-w-3xl px-4 py-8">
          
          {/* Login / Auth Form */}
          <div className="flex justify-center">
            {children}
          </div>

        </div>

      </main>
    </div>
  );
};

export default AuthLayout;