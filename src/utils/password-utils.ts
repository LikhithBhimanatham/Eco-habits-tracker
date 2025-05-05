
/**
 * Simple password utility functions for hashing and comparing passwords
 * Note: In a production app, use a proper hashing library like bcrypt
 */

// Simple hash function - NOT for production use, only for demonstration
export function hashPassword(password: string): string {
  // This is a simple hash function for demo purposes only
  // In production, use bcrypt or similar library on the server side
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to string and add some salt
  return hash.toString(16) + "eco_habits_salt_" + (Date.now() % 1000);
}

// Compare password with stored hash - NOT for production use
export function comparePassword(password: string, storedHash: string): boolean {
  // Extract the original hash part (before the salt)
  const hashPart = storedHash.split("eco_habits_salt_")[0];
  
  // Hash the provided password
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Compare hash parts
  return hash.toString(16) === hashPart;
}
