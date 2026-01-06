import { NextRequest } from 'next/server';
import { AdminService } from '@/services/adminService';
import { requireAdmin } from '@/lib/authMiddleware';
import { successResponse, handleApiError } from '@/lib/apiResponse';
import { z } from 'zod';

const banUserSchema = z.object({
  reason: z.string().min(1, 'Une raison est requise'),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/admin/users/[id]/ban
 * Ban a user (admin only)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = banUserSchema.parse(body);

    // Ban user
    const user = await AdminService.banUser(id, validatedData.reason);

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}
