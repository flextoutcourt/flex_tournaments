import { NextRequest } from 'next/server';
import { AdminService, UpdateUserInput } from '@/services/adminService';
import { requireAdmin } from '@/lib/authMiddleware';
import { successResponse, handleApiError } from '@/lib/apiResponse';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/users/[id]
 * Get a specific user (admin only)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;

    const user = await AdminService.getUserById(id);
    if (!user) {
      return successResponse({ error: 'Utilisateur non trouvé' }, 404);
    }

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update a user (admin only)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateUserSchema.parse(body);

    // Update user
    const user = await AdminService.updateUser(id, validatedData as UpdateUserInput);

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user (admin only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;

    await AdminService.deleteUser(id);

    return successResponse({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}
