export function generateRecoverCode(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}
