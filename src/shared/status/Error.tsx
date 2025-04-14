'use client';

import React from 'react';

interface ErrorProps {
  error: string;
}

const Error: React.FC<ErrorProps> = ({error}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-red-500">Error: {error}</p>
    </div>
  );
};

export default Error;
