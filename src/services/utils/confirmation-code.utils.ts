import * as bcrypt from 'bcrypt';
export function generateConfirmationCode(): string {
  const code = Math.random().toString(36).substr(2, 6).toUpperCase();
  console.log('code', code);
  return bcrypt.hashSync(code, 10);
}
