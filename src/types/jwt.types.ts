import { Cargo } from '@prisma/client';

export type JWTType = {
  user: {
    role: Cargo;
    userId: string;
  };
};
