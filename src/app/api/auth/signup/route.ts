import { NextRequest } from 'next/server';
import { signupSchema } from '@/lib/validations/auth';
import { AuthService } from '@/services/authService';
import { successResponse, handleApiError } from '@/lib/apiResponse';

/**
 * POST /api/auth/signup
 * Create a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);

    // Create user
    const user = await AuthService.createUser(validatedData);

    return successResponse(
      { user },
      201,
      'Compte créé avec succès'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
