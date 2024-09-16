import * as bcrypt from 'bcrypt';

export function generateRecoverCode(): {
  hashedCode: string;
  code: string;
} {
  const code = Math.random().toString(36).substr(2, 6).toUpperCase();
  return { hashedCode: bcrypt.hashSync(code, 10), code };
}
