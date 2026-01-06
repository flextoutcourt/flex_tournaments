import { NextRequest } from 'next/server';
import { AdminService, CreateUserInput } from '@/services/adminService';
import { requireAdmin } from '@/lib/authMiddleware';
import { successResponse, handleApiError } from '@/lib/apiResponse';
import { z } from 'zod';

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['USER', 'VIP', 'SUPERADMIN']).optional(),
});

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export async function GET(_request: NextRequest) {
  try {
    await requireAdmin();

    const users = await AdminService.getAllUsers();
    return successResponse(users);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/admin/users
 * Create a new user (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    // Validate input
    const validatedData = createUserSchema.parse(body);

    // Create user
    const user = await AdminService.createUser(validatedData as CreateUserInput);

    return successResponse(user, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
