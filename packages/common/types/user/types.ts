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
