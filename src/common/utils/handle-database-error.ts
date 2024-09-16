import { ConflictError } from '../types/ConflictError';
import { DatabaseError } from '../types/DatabaseError';
import { PrismaClientError } from '../types/PrismaClientError';

enum PrismaErrors {
  UniqueConstraintFail = 'P2002',
}

export const handleDatabaseError = (err: PrismaClientError) => {
  switch (err.code) {
    case PrismaErrors.UniqueConstraintFail:
      return new ConflictError(err.message);
    default:
      return new DatabaseError(err.message);
  }
};
