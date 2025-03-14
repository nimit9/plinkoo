import { randomBytes } from 'crypto';

export const generateClientSeed = () => {
  return randomBytes(16).toString('hex');
};

export const generateServerSeed = () => {
  return randomBytes(32).toString('hex');
};
