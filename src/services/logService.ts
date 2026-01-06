// services/logService.ts
import { prisma } from '@/lib/prisma';

interface LogActivityParams {
  userId?: string | null;
  action: string;
  description?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Logs a user activity to the database
 * @param params - Logging parameters
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        description: params.description || null,
        entityType: params.entityType || null,
        entityId: params.entityId || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    // Don't throw errors from logging - log to console instead
    console.error('Failed to log activity:', error);
  }
}

/**
 * Extract IP address from request headers
 */
export function getIpFromRequest(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || null;
}

/**
 * Extract User Agent from request headers
 */
export function getUserAgentFromRequest(request: Request): string | null {
  return request.headers.get('user-agent');
}

/**
 * Get activity logs with filtering
 */
export async function getActivityLogs(
  limit: number = 100,
  filters?: {
    userId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const where: any = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }
  if (filters?.action) {
    where.action = filters.action;
  }
  if (filters?.entityType) {
    where.entityType = filters.entityType;
  }
  if (filters?.entityId) {
    where.entityId = filters.entityId;
  }
  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  return prisma.activityLog.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Get logs for a specific tournament
 */
export async function getTournamentActivityLogs(tournamentId: string, limit: number = 50) {
  return prisma.activityLog.findMany({
    where: {
      entityType: 'tournament',
      entityId: tournamentId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Get logs for a specific user
 */
export async function getUserActivityLogs(userId: string, limit: number = 50) {
  return prisma.activityLog.findMany({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}
