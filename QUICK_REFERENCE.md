# Quick Reference: Refactored Code Structure

## Import Statements

### Validation
\`\`\`typescript
import { signupSchema, signinSchema } from '@/lib/validations/auth';
import { tournamentCreateSchema, tournamentUpdateSchema } from '@/lib/validations/tournament';
\`\`\`

### Services
\`\`\`typescript
import { AuthService } from '@/services/authService';
import { TournamentService } from '@/services/tournamentService';
\`\`\`

### Error Handling
\`\`\`typescript
import { successResponse, errorResponse, handleApiError } from '@/lib/apiResponse';
import { ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError } from '@/lib/errors';
\`\`\`

### Auth Middleware
\`\`\`typescript
import { requireAuth, requireAdmin, getAuthSession } from '@/lib/authMiddleware';
\`\`\`

### Constants
\`\`\`typescript
import { TOURNAMENT_MODES, STORAGE_KEYS, TOURNAMENT_CONSTRAINTS } from '@/constants/tournament';
\`\`\`

### Storage
\`\`\`typescript
import { TournamentStorage } from '@/lib/tournamentStorage';
\`\`\`

### Types
\`\`\`typescript
import type { User, AuthUser, LoginCredentials } from '@/types/auth';
import type { Tournament, TournamentMode, Item, CurrentMatch } from '@/types/tournament';
\`\`\`

## Common Patterns

### API Route Template (Protected)
\`\`\`typescript
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/authMiddleware';
import { mySchema } from '@/lib/validations/myModule';
import { MyService } from '@/services/myService';
import { successResponse, handleApiError } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const data = mySchema.parse(body);
    const result = await MyService.create(data, session.user.id);
    return successResponse(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
\`\`\`

### API Route Template (Public)
\`\`\`typescript
export async function GET() {
  try {
    const data = await MyService.getAll();
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
\`\`\`

### Service Method Template
\`\`\`typescript
static async createSomething(data: InputType, userId: string): Promise<ReturnType> {
  try {
    // Validation
    this.validateData(data);
    
    // Business logic
    const result = await prisma.model.create({
      data: {
        ...data,
        userId,
      },
    });
    
    return result;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new DatabaseError('Error message', error);
  }
}
\`\`\`

### Custom Error Throwing
\`\`\`typescript
// Validation error
if (!isValid) {
  throw new ValidationError('Invalid input provided');
}

// Not found
if (!resource) {
  throw new NotFoundError('Resource not found');
}

// Conflict
if (exists) {
  throw new ConflictError('Resource already exists');
}

// Auth required
if (!session) {
  throw new AuthenticationError('Authentication required');
}

// Permission denied
if (session.user.role !== 'ADMIN') {
  throw new AuthorizationError('Admin access required');
}
\`\`\`

### Validation Schema Pattern
\`\`\`typescript
import { z } from 'zod';

export const mySchema = z.object({
  requiredField: z.string().min(3, 'Must be at least 3 characters'),
  optionalField: z.string().optional().nullable(),
  enumField: z.enum(['OPTION_A', 'OPTION_B']),
  numberField: z.number().min(1).max(100),
  emailField: z.string().email('Invalid email'),
});

export type MyInput = z.infer<typeof mySchema>;
\`\`\`

## AuthService Methods

\`\`\`typescript
// Hash password
const hash = await AuthService.hashPassword(password);

// Compare password
const isValid = await AuthService.comparePassword(password, hash);

// Find user
const user = await AuthService.findUserByEmail(email);
const user = await AuthService.findUserById(id);

// Create user
const user = await AuthService.createUser({ name, email, password });

// Authenticate
const user = await AuthService.authenticateUser(email, password);
\`\`\`

## TournamentService Methods

\`\`\`typescript
// Validate two-category mode
TournamentService.validateTwoCategoryMode(mode, categoryA, categoryB);

// CRUD operations
const tournament = await TournamentService.createTournament(data, userId);
const tournaments = await TournamentService.getAllTournaments();
const tournament = await TournamentService.getTournamentById(id);
const tournament = await TournamentService.updateTournament(id, data);
await TournamentService.deleteTournament(id);

// Items
const item = await TournamentService.addItemToTournament(tournamentId, itemData);
const items = await TournamentService.getTournamentItems(tournamentId);
\`\`\`

## TournamentStorage Methods

\`\`\`typescript
// Save state
TournamentStorage.saveState(tournamentId, stateObject);

// Load state
const state = TournamentStorage.loadState(tournamentId);

// Check if exists
if (TournamentStorage.hasState(tournamentId)) { }

// Clear state
TournamentStorage.clearState(tournamentId);
TournamentStorage.clearAllStates();
\`\`\`

## Response Formats

### Success Response
\`\`\`json
{
  "data": { ... },
  "message": "Optional success message"
}
\`\`\`

### Error Response
\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
\`\`\`

## Constants Reference

\`\`\`typescript
TOURNAMENT_MODES.STANDARD           // 'STANDARD'
TOURNAMENT_MODES.TWO_CATEGORY       // 'TWO_CATEGORY'

ITEM_COUNT_OPTIONS.ALL              // 'all'
ITEM_COUNT_OPTIONS.EIGHT            // '8'
ITEM_COUNT_OPTIONS.SIXTEEN          // '16'
ITEM_COUNT_OPTIONS.THIRTY_TWO       // '32'

TOURNAMENT_STATUS.NOT_STARTED       // 'NOT_STARTED'
TOURNAMENT_STATUS.IN_PROGRESS       // 'IN_PROGRESS'
TOURNAMENT_STATUS.COMPLETED         // 'COMPLETED'

STORAGE_KEYS.TOURNAMENT_STATE(id)   // 'tournamentState_<id>'

TOURNAMENT_DEFAULTS.MODE            // 'STANDARD'
TOURNAMENT_DEFAULTS.ROUND_NUMBER    // 1
TOURNAMENT_DEFAULTS.MATCH_INDEX     // 0

TOURNAMENT_CONSTRAINTS.TITLE_MIN_LENGTH      // 3
TOURNAMENT_CONSTRAINTS.TITLE_MAX_LENGTH      // 100
TOURNAMENT_CONSTRAINTS.DESCRIPTION_MAX_LENGTH // 500
TOURNAMENT_CONSTRAINTS.MIN_PARTICIPANTS      // 2
\`\`\`

## Troubleshooting

### Prisma Client Not Updated
\`\`\`bash
# Stop dev server (Ctrl+C)
npx prisma generate
npm run dev
\`\`\`

### File Lock Error (Windows)
- Close VS Code
- Delete `node_modules/.prisma` and `prisma/generated`
- Run `npm install` and `npx prisma generate`
- Restart VS Code

### Import Errors
Make sure paths in `tsconfig.json` include:
\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
\`\`\`
