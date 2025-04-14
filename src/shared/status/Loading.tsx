'use client';

import React from 'react';
import {Loader2} from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin h-6 w-6" />
    </div>
  );
};

export default Loading;
