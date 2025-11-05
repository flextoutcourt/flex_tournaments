# Code Refactoring Documentation

## Overview
This refactoring improves code maintainability by implementing separation of concerns, service layer pattern, and centralized error handling.

## What Was Refactored

### 1. **Validation Schemas** (`src/lib/validations/`)
- **auth.ts**: Centralized authentication validation schemas (signup, signin)
- **tournament.ts**: Tournament creation and update validation schemas
- Benefits: Reusable validation logic, consistent error messages

### 2. **Service Layer** (`src/services/`)
- **authService.ts**: User authentication operations (CRUD, password hashing)
- **tournamentService.ts**: Tournament business logic (CRUD, validation)
- Benefits: Business logic separated from API routes, easier testing, reusable across different endpoints

### 3. **Error Handling** (`src/lib/`)
- **errors.ts**: Custom error classes (ValidationError, AuthenticationError, etc.)
- **apiResponse.ts**: Standardized API response format with automatic error handling
- Benefits: Consistent error responses, better error tracking, cleaner code

### 4. **Auth Middleware** (`src/lib/authMiddleware.ts`)
- Helper functions: `requireAuth()`, `requireAdmin()`, `getAuthSession()`
- Benefits: Eliminates boilerplate in API routes, centralized auth logic

### 5. **Constants** (`src/constants/tournament.ts`)
- Tournament modes, storage keys, validation constraints
- Benefits: No magic strings, single source of truth, easier refactoring

### 6. **Storage Utility** (`src/lib/tournamentStorage.ts`)
- LocalStorage wrapper with error handling
- Methods: saveState, loadState, hasState, clearState
- Benefits: Centralized storage logic, safer localStorage operations

### 7. **Type Definitions** (`src/types/`)
- **auth.ts**: Authentication-related types
- **tournament.ts**: Tournament-related types
- Benefits: Better type safety, centralized type definitions

## Refactored Files

### API Routes
- `src/app/api/auth/signup/route.ts` - Now uses AuthService and standardized error handling
- `src/app/api/tournaments/route.ts` - Uses TournamentService and requireAdmin middleware
- `src/app/api/tournaments/[id]/route.ts` - Uses TournamentService with clean error handling
- `src/lib/auth.ts` - Uses AuthService for authentication

### Before vs After Example

#### Before (signup route):
\`\`\`typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: '...' }, { status: 400 });
    }
    // 50+ lines of business logic...
  } catch (error) {
    // Complex error handling...
  }
}
\`\`\`

#### After (signup route):
\`\`\`typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);
    const user = await AuthService.createUser(validatedData);
    return successResponse({ user }, 201, 'Compte créé avec succès');
  } catch (error) {
    return handleApiError(error);
  }
}
\`\`\`

## Known Issues & How to Fix

### Prisma Client Not Generated

**Issue**: TypeScript errors about missing `user`, `createdBy`, `items` properties on Prisma client.

**Cause**: Prisma client needs to be regenerated after schema changes.

**Solution**:
1. Stop the dev server (Ctrl+C)
2. Run: `npx prisma generate`
3. If you get a file lock error on Windows, restart VS Code or reboot
4. Restart dev server: `npm run dev`

**Alternative**: 
\`\`\`bash
# Delete generated folder and regenerate
rm -rf prisma/generated
npx prisma generate
\`\`\`

### Case Sensitivity in Prisma Model Names

Some models use PascalCase (`Items` vs `items`). Ensure consistency:
- In schema.prisma: `model Item` (singular)
- In queries: Use `items` (lowercase, plural) or `Items` (PascalCase) depending on your schema

## How to Use New Structure

### Creating a New API Endpoint

1. **Define validation schema** in `src/lib/validations/`
2. **Create service methods** in appropriate service file
3. **Use middleware** for authentication
4. **Handle errors** with `handleApiError()`
5. **Return responses** with `successResponse()` or `errorResponse()`

Example:
\`\`\`typescript
import { requireAdmin } from '@/lib/authMiddleware';
import { MyService } from '@/services/myService';
import { mySchema } from '@/lib/validations/myValidation';
import { successResponse, handleApiError } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const validatedData = mySchema.parse(body);
    const result = await MyService.doSomething(validatedData, session.user.id);
    return successResponse(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
\`\`\`

### Using Tournament Storage

\`\`\`typescript
import { TournamentStorage } from '@/lib/tournamentStorage';

// Save state
TournamentStorage.saveState(tournamentId, {
  matches,
  currentMatchIndex,
  // ... other state
});

// Load state
const savedState = TournamentStorage.loadState(tournamentId);
if (savedState) {
  // Restore state
}

// Clear state
TournamentStorage.clearState(tournamentId);
\`\`\`

### Creating Custom Errors

\`\`\`typescript
import { ValidationError, NotFoundError } from '@/lib/errors';

// In your service
if (!data.isValid) {
  throw new ValidationError('Invalid data provided');
}

if (!resource) {
  throw new NotFoundError('Resource not found');
}
\`\`\`

## Benefits of This Refactoring

1. **Maintainability**: Business logic separated from HTTP handling
2. **Testability**: Services can be unit tested independently
3. **Reusability**: Services and utilities can be used across multiple endpoints
4. **Consistency**: Standardized error handling and responses
5. **Type Safety**: Centralized type definitions
6. **Readability**: API routes are now 70% shorter and clearer
7. **Scalability**: Easy to add new features following the same pattern

## Migration Guide for Existing Code

1. **Replace inline validation** with imported schemas from `src/lib/validations/`
2. **Move business logic** to appropriate service in `src/services/`
3. **Replace auth checks** with `requireAuth()` or `requireAdmin()`
4. **Replace error handling** with `handleApiError()`
5. **Replace success responses** with `successResponse()`
6. **Replace magic strings** with constants from `src/constants/`

## Next Steps

- Add unit tests for service layer
- Add integration tests for API endpoints
- Consider adding request rate limiting
- Consider adding request logging middleware
- Add API documentation (Swagger/OpenAPI)
- Consider adding database transaction support for complex operations

## File Structure

\`\`\`
src/
├── app/
│   └── api/                    # API routes (thin controllers)
├── services/                   # Business logic layer
│   ├── authService.ts
│   └── tournamentService.ts
├── lib/
│   ├── validations/            # Zod schemas
│   │   ├── auth.ts
│   │   └── tournament.ts
│   ├── errors.ts               # Custom error classes
│   ├── apiResponse.ts          # Response utilities
│   ├── authMiddleware.ts       # Auth helpers
│   ├── tournamentStorage.ts    # Storage utilities
│   ├── auth.ts                 # NextAuth config
│   └── prisma.ts               # Prisma client
├── types/                      # TypeScript types
│   ├── auth.ts
│   └── tournament.ts
└── constants/                  # App constants
    └── tournament.ts
\`\`\`
