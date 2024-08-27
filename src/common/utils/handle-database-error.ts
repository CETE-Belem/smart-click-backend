import { DatabaseError } from '../types/DatabaseError';
import { PrismaClientError } from '../types/PrismaClientError';
import { UniqueConstraintError } from '../types/UniqueConstraintError';

enum PrismaErrors {
  UniqueConstraintFail = 'P2002',
}

export const handleDatabaseError = (err: PrismaClientError) => {
  console.log(err);
  switch (err.code) {
    case PrismaErrors.UniqueConstraintFail:
      return new UniqueConstraintError(err);
    default:
      return new DatabaseError(err.message);
  }
};
