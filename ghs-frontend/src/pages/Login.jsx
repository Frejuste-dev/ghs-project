import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import LoginHeader from '../components/auth/LoginHeader';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <LoginHeader />
        <LoginForm />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Version 2.0.0 - © 2024 ChronosRH
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
