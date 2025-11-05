import { NextResponse } from 'next/server';
import { AppError } from './errors';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Standard API response structure for success
 */
export interface ApiSuccessResponse<T = any> {
  data: T;
  message?: string;
}

/**
 * Standard API response structure for errors
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200,
  message?: string
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ data, message }, { status: statusCode });
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error, code, details }, { status: statusCode });
}

/**
 * Handle errors and convert them to appropriate API responses
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error);

  // Handle custom AppError
  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode, error.code);
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    return errorResponse(
      firstError?.message || 'Données invalides',
      400,
      'VALIDATION_ERROR',
      error.issues
    );
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[]) || [];
      const field = target[0] || 'field';
      return errorResponse(
        `Un enregistrement avec ce ${field} existe déjà.`,
        409,
        'UNIQUE_CONSTRAINT'
      );
    }

    // Record not found
    if (error.code === 'P2025') {
      return errorResponse('Ressource non trouvée', 404, 'NOT_FOUND');
    }

    // Foreign key constraint violation
    if (error.code === 'P2003') {
      return errorResponse(
        'Violation de contrainte de clé étrangère',
        400,
        'FOREIGN_KEY_CONSTRAINT'
      );
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return errorResponse(
      'Erreur de validation des données',
      400,
      'PRISMA_VALIDATION_ERROR'
    );
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError) {
    return errorResponse(
      'Corps de la requête JSON invalide',
      400,
      'INVALID_JSON'
    );
  }

  // Generic error
  const message = error instanceof Error ? error.message : 'Une erreur interne est survenue';
  return errorResponse(message, 500, 'INTERNAL_SERVER_ERROR');
}
