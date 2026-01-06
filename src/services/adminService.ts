import { prisma } from '@/lib/prisma';
import { AuthService } from './authService';
import { DatabaseError } from '@/lib/errors';

export interface AdminUserResponse {
  id: string;
  name: string | null;
  email: string;
  role: string;
  banned: boolean;
  bannedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'VIP' | 'SUPERADMIN';
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: 'USER' | 'VIP' | 'SUPERADMIN';
}

/**
 * Admin service for managing users
 */
export class AdminService {
  /**
   * Check if user is admin or superadmin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      return user?.role === 'SUPERADMIN' || user?.role === 'ADMIN';
    } catch (error) {
      throw new DatabaseError('Erreur lors de la vérification des droits admin', error);
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<AdminUserResponse[]> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          bannedReason: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return users;
    } catch (error) {
      throw new DatabaseError('Erreur lors de la récupération des utilisateurs', error);
    }
  }

  /**
   * Get a user by ID (admin only)
   */
  static async getUserById(userId: string): Promise<AdminUserResponse | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          bannedReason: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      throw new DatabaseError('Erreur lors de la récupération de l\'utilisateur', error);
    }
  }

  /**
   * Create a new user (admin only)
   */
  static async createUser(data: CreateUserInput): Promise<AdminUserResponse> {
    try {
      // Check if user already exists
      const existingUser = await AuthService.findUserByEmail(data.email);
      if (existingUser) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Hash password
      const hashedPassword = await AuthService.hashPassword(data.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role || 'USER',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          bannedReason: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      throw new DatabaseError('Erreur lors de la création de l\'utilisateur', error);
    }
  }

  /**
   * Update a user (admin only)
   */
  static async updateUser(
    userId: string,
    data: UpdateUserInput
  ): Promise<AdminUserResponse> {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // If email is being changed, check for duplicates
      if (data.email && data.email !== user.email) {
        const existingUser = await AuthService.findUserByEmail(data.email);
        if (existingUser) {
          throw new Error('Un compte avec cet email existe déjà');
        }
      }

      // Hash password if provided
      const updateData: any = { ...data };
      if (data.password) {
        updateData.password = await AuthService.hashPassword(data.password);
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          bannedReason: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new DatabaseError('Erreur lors de la mise à jour de l\'utilisateur', error);
    }
  }

  /**
   * Delete a user (admin only)
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Delete user
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      throw new DatabaseError('Erreur lors de la suppression de l\'utilisateur', error);
    }
  }

  /**
   * Ban a user (admin only)
   */
  static async banUser(
    userId: string,
    reason: string
  ): Promise<AdminUserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          banned: true,
          bannedReason: reason,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          bannedReason: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new DatabaseError('Erreur lors du bannissement de l\'utilisateur', error);
    }
  }

  /**
   * Unban a user (admin only)
   */
  static async unbanUser(userId: string): Promise<AdminUserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          banned: false,
          bannedReason: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          bannedReason: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new DatabaseError('Erreur lors du débannissement de l\'utilisateur', error);
    }
  }
}
