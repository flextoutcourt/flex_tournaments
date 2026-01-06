# Admin Feature Documentation

## Overview
A comprehensive admin management system for creating, editing, deleting, and banning user accounts.

## Database Schema Changes
- Added `banned` boolean field to User model (default: false)
- Added `bannedReason` optional string field to User model

## Features

### 1. User Management Dashboard
- **Location**: `/admin`
- **Access**: Admin users only
- **Features**:
  - View all users in the system
  - Create new users (with name, email, password, role selection)
  - Edit existing users (update name, email, password, or role)
  - Delete users
  - Ban users with a reason
  - Unban users
  - View detailed user information

### 2. Admin API Endpoints

#### Get All Users
```
GET /api/admin/users
```
Returns a list of all users with their details.

#### Get User by ID
```
GET /api/admin/users/:id
```
Returns details for a specific user.

#### Create User
```
POST /api/admin/users
Body: {
  name: string,
  email: string,
  password: string,
  role?: 'USER' | 'ADMIN'
}
```

#### Update User
```
PUT /api/admin/users/:id
Body: {
  name?: string,
  email?: string,
  password?: string,
  role?: 'USER' | 'ADMIN'
}
```

#### Delete User
```
DELETE /api/admin/users/:id
```

#### Ban User
```
POST /api/admin/users/:id/ban
Body: {
  reason: string
}
```

#### Unban User
```
POST /api/admin/users/:id/unban
```

## Services

### AdminService
Located in `src/services/adminService.ts`

Methods:
- `isAdmin(userId)` - Check if user is admin
- `getAllUsers()` - Get all users
- `getUserById(userId)` - Get specific user
- `createUser(data)` - Create new user
- `updateUser(userId, data)` - Update user
- `deleteUser(userId)` - Delete user
- `banUser(userId, reason)` - Ban user
- `unbanUser(userId)` - Unban user

### AuthService (Updated)
- `authenticateUser()` now checks if user is banned before allowing login
- Banned users receive an error message with the ban reason

## Middleware

### Admin Authorization Middleware
Located in `src/lib/adminMiddleware.ts`

- `adminAuthMiddleware()` - Middleware function for route protection
- `withAdminAuth()` - Wrapper function for API handlers

## Security Features

1. **Role-based Access Control**: Only ADMIN role users can access admin features
2. **Ban System**: Banned users cannot log in
3. **API Protection**: All admin endpoints require admin authentication
4. **Password Hashing**: All passwords are hashed using bcrypt
5. **Email Uniqueness**: Email addresses must be unique across the system

## User Interface

### Admin Dashboard Tabs

#### Manage Users Tab
- List of all users with search functionality
- Click on a user to view detailed information
- Edit, ban/unban, or delete user
- Show ban reason if user is banned

#### Create User Tab
- Form to create new users
- Set name, email, password, and role
- Edit existing users through the same interface

### Admin Indicator
- Admin users have a crown icon (👑) in the user menu
- Admin panel link visible in user menu for admins

## Type Definitions

### AdminUserResponse
```typescript
{
  id: string;
  name: string | null;
  email: string;
  role: string;
  banned: boolean;
  bannedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage Examples

### Create an Admin User
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securePassword123",
    "role": "ADMIN"
  }'
```

### Ban a User
```bash
curl -X POST http://localhost:3000/api/admin/users/:id/ban \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Violating community guidelines"
  }'
```

### Update User Role to Admin
```bash
curl -X PUT http://localhost:3000/api/admin/users/:id \
  -H "Content-Type: application/json" \
  -d '{
    "role": "ADMIN"
  }'
```

## Next Steps

To complete setup:
1. Run Prisma migration: `npx prisma migrate dev --name add_admin_features`
2. Push to database: `npx prisma db push`
3. Generate Prisma client: `npx prisma generate`
4. Assign an existing user to ADMIN role using the API
5. Log in and access the admin panel at `/admin`

## Notes

- Banned users can be unbanned by admins
- Deleting a user is permanent
- Admins can promote other users to admin status
- Email addresses are unique and cannot be duplicated
- All user passwords are automatically hashed
