
/**
 * Password utility functions for hashing and comparing passwords
 * Note: For a production app, use a proper authentication system with backend hashing
 */

// More secure hash function (still for demo purposes only)
export function hashPassword(password: string): string {
  if (!password) return "";
  
  // This is a more complex hash function for demo purposes
  // In a real app, this should be done server-side with bcrypt/argon2
  let hash = 0;
  const salt = "eco_habits_secure_salt_" + (Date.now() % 10000);
  
  // Add salt to the password before hashing
  const saltedPassword = password + salt;
  
  for (let i = 0; i < saltedPassword.length; i++) {
    const char = saltedPassword.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Return the hash with the salt stored for verification
  return hash.toString(16) + ":" + salt;
}

// Compare password with stored hash
export function comparePassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;
  
  try {
    // Extract the hash and salt parts
    const [hashPart, salt] = storedHash.split(":");
    
    if (!hashPart || !salt) return false;
    
    // Add the extracted salt to the provided password
    const saltedPassword = password + salt;
    
    // Hash the salted password using the same algorithm
    let hash = 0;
    for (let i = 0; i < saltedPassword.length; i++) {
      const char = saltedPassword.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    // Compare the computed hash with the stored hash
    return hash.toString(16) === hashPart;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}
