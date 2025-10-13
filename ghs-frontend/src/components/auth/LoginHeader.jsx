import React from 'react';

const LoginHeader = () => {
  return (
    <div className="text-center animate-slide-in-down">
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg hover-lift">
        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="mt-6 text-4xl font-bold text-gray-900">
        Bienvenue sur <span className="text-blue-600">ChronosRH</span>
      </h2>
      <p className="mt-3 text-base text-gray-600">
        Gestion des Heures Supplémentaires
      </p>
    </div>
  );
};

export default LoginHeader;
