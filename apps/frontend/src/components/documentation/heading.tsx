import React from 'react';

const Heading = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-lg font-semibold">{children}</div>;
};

export default Heading;
