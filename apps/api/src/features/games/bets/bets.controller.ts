import type { PaginatedBetData } from '@repo/common/types';
import { ApiResponse } from '@repo/common/types';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getTopBets } from './bets.service';

export const getBets = async (
  req: Request,
  res: Response<ApiResponse<{ bets: PaginatedBetData[] }>>
) => {
  // Get paginated bets
  const paginatedBets = await getTopBets();

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, paginatedBets));
};
