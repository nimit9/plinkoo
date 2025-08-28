import { ExternalLink } from 'lucide-react';
import React from 'react';

const Link = ({ link, text }: { link: string; text: string }) => {
  return (
    <span className="font-semibold text-primary inline-flex gap-1.5 pr-2 text-sm items-center">
      <a href={link} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
      <ExternalLink className="size-4 icon-neutral-weakest" />
    </span>
  );
};

export default Link;
