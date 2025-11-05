# Authentication & Authorization Update

## Summary
Added authentication checks to ensure only logged-in users can add or delete tournament participants. This keeps the platform Twitch-friendly and prevents anonymous spam.

## Changes Made

### 1. Tournament Page (`src/app/tournaments/[id]/page.tsx`)
- Added session check using `auth()` from NextAuth
- Show "Login Required" message instead of AddItemForm for non-authenticated users
- Non-authenticated users can still view tournaments and participants (read-only access)
- Added visual indicator with lock icon and sign-in button

### 2. API Endpoint - Add Items (`src/app/api/tournaments/[id]/items/route.ts`)
- Added authentication check at the start of POST handler
- Returns 401 Unauthorized if user is not logged in
- Error message: "Vous devez être connecté pour ajouter des participants."

### 3. API Endpoint - Delete Items (`src/app/api/tournaments/[id]/items/[itemId]/route.ts`)
- Added authentication check at the start of DELETE handler
- Returns 401 Unauthorized if user is not logged in
- Error message: "Vous devez être connecté pour supprimer des participants."

### 4. Auth Configuration (`src/lib/auth.ts`)
- Added `trustHost: true` to fix production deployment issues
- This resolves the UntrustedHost error on tournaments.flex-central.com

## User Experience

### For Anonymous Users:
- ✅ Can view all tournaments
- ✅ Can see all participants
- ✅ Can watch live tournaments
- ❌ Cannot add new participants
- ❌ Cannot delete participants
- 👉 See a friendly message with a sign-in button

### For Authenticated Users:
- ✅ Full access to add participants
- ✅ Can delete items they added
- ✅ All existing functionality

## Security Benefits

1. **Spam Prevention**: Anonymous users cannot flood tournaments with entries
2. **Accountability**: All additions are tied to user accounts
3. **Twitch Compliance**: Follows community guidelines for user-generated content
4. **Data Integrity**: Prevents malicious or accidental data manipulation

## Testing Checklist

- [ ] Anonymous user sees login prompt on tournament page
- [ ] Anonymous user can view tournament details
- [ ] Anonymous POST to /api/tournaments/[id]/items returns 401
- [ ] Anonymous DELETE to /api/tournaments/[id]/items/[itemId] returns 401
- [ ] Authenticated user can add participants
- [ ] Authenticated user can delete participants
- [ ] Sign-in button redirects back to tournament page after login

## Production Deployment Notes

Make sure these environment variables are set on the production server:

```bash
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://tournaments.flex-central.com
AUTH_URL=https://tournaments.flex-central.com
```

Then rebuild and restart:
```bash
npm run build
pm2 restart tournaments
```
