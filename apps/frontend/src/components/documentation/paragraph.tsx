import React from 'react';

const Paragraph = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-[#b1bad3]">{children}</p>;
};

export default Paragraph;
