/**
 * Domain Interface for Password Hashing
 * Follows Clean Architecture - Domain Layer
 */

export interface IPasswordHasher {
    /**
     * Hash a plain text password
     * @param password - Plain text password
     */
    hash(password: string): Promise<string>;

    /**
     * Compare a plain text password with a hash
     * @param password - Plain text password
     * @param hash - Hashed password
     */
    compare(password: string, hash: string): Promise<boolean>;
}
