import { NextRequest } from 'next/server';
import { AdminService } from '@/services/adminService';
import { requireAdmin } from '@/lib/authMiddleware';
import { successResponse, handleApiError } from '@/lib/apiResponse';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/admin/users/[id]/unban
 * Unban a user (admin only)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;

    // Unban user
    const user = await AdminService.unbanUser(id);

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}
