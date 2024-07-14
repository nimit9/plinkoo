import { Request, Response } from 'express';

import { rng } from './rng.service';

export const getServerSeeds = (_: Request, res: Response) => {
  const hashedServerSeed = rng.getHashedServerSeed();
  const hashedNextServerSeed = rng.getHashedNextServerSeed();

  if (hashedServerSeed && hashedNextServerSeed) {
    res.status(200).json({
      serverSeed: hashedServerSeed,
      nextServerSeed: hashedNextServerSeed,
    });
  }
};
