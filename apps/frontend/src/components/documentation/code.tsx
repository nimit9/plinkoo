import React from 'react';

const Code = ({ children }: { children: React.ReactNode }) => {
  return (
    <code className="overflow-x-auto text-sm bg-brand-weak p-4 rounded">
      {children}
    </code>
  );
};

export default Code;
