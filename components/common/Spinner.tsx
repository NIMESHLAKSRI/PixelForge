import React from 'react';

export const Spinner: React.FC = () => (
  <div
    className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
    role="status"
    aria-label="loading"
  ></div>
);