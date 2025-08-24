export interface IUser {
  createdAt: string;
  email: string;
  googleId: string | null;
  id: string;
  name: string;
  picture: string | null;
  updatedAt: string;
}

export interface ProvablyFairStateResponse {
  clientSeed: string;
  hashedServerSeed: string;
  hashedNextServerSeed: string;
  nonce: number;
}

export interface PaginatedBetData {
  betId: string;
  game: string;
  date: Date;
  betAmount: number;
  payoutMultiplier: number;
  payout: number;
  id: string;
  user?: {
    id: string;
    name: string | null;
  };
}

export interface PaginatedBetsResponse {
  bets: PaginatedBetData[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
