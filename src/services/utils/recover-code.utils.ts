import * as bcrypt from 'bcrypt';

export function generateRecoverCode(): string {
  return bcrypt.hashSync(
    Math.random().toString(36).substr(2, 6).toUpperCase(),
    10,
  );
}
