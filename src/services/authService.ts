import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ConflictError, DatabaseError } from '@/lib/errors';
import type { SignupInput } from '@/lib/validations/auth';

/**
 * User data returned after creation (without password)
 */
export interface UserResponse {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

/**
 * Auth service for handling user authentication operations
 */
export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Compare a password with a hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Find a user by email
   */
  static async findUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new DatabaseError('Erreur lors de la recherche de l\'utilisateur', error);
    }
  }

  /**
   * Find a user by ID
   */
  static async findUserById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new DatabaseError('Erreur lors de la recherche de l\'utilisateur', error);
    }
  }

  /**
   * Create a new user
   * @throws ConflictError if email already exists
   * @throws DatabaseError if database operation fails
   */
  static async createUser(data: SignupInput): Promise<UserResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.findUserByEmail(data.email);
      if (existingUser) {
        throw new ConflictError('Un compte avec cet email existe déjà');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(data.password);

      // Create user with USER role by default
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: 'USER',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError('Erreur lors de la création de l\'utilisateur', error);
    }
  }

  /**
   * Authenticate a user with email and password
   * @returns User object if credentials are valid, null otherwise
   * @throws Error if user is banned (with specific message format)
   */
  static async authenticateUser(email: string, password: string) {
    try {
      const user = await this.findUserByEmail(email);
      
      if (!user || !user.password) {
        return null;
      }

      // Check if user is banned - throw specific error that can be caught by NextAuth
      if (user.banned) {
        throw new Error('BANNED|' + (user.bannedReason || 'Non spécifiée'));
      }

      const isPasswordValid = await this.comparePassword(password, user.password);
      
      if (!isPasswordValid) {
        return null;
      }

      // Return user without password
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      // If it's a ban error, throw it as-is so NextAuth can handle it
      if (error instanceof Error && error.message.startsWith('BANNED|')) {
        throw error;
      }
      throw new DatabaseError('Erreur lors de l\'authentification', error);
    }
  }
}
