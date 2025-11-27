// Simple password auth - In production use NextAuth.js or similar
export function verifyPassword(password) {
  return password === process.env.ADMIN_PASSWORD;
}