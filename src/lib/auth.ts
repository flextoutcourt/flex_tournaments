import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AuthService } from "@/services/authService";
import { prisma } from "@/lib/prisma";

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use AuthService for authentication
          const user = await AuthService.authenticateUser(
            credentials.email as string,
            credentials.password as string
          );

          return user;
        } catch (error) {
          // AuthService throws error for banned users, but we've already checked this on client
          // If somehow a banned user gets here, deny login
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        
        // Generate a unique session token
        token.sessionToken = `${user.id}-${Date.now()}-${Math.random()}`;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        (session as any).sessionToken = token.sessionToken as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!user?.id) return false;

      try {
        // Create a new session record in the database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

        await prisma.userSession.create({
          data: {
            userId: user.id,
            sessionToken: `${user.id}-${Date.now()}-${Math.random()}`,
            loginAt: new Date(),
            lastActivity: new Date(),
            expiresAt: expiresAt,
            // These would be set from the request context in a middleware
            ipAddress: null,
            userAgent: null,
            isActive: true,
          },
        });

        // Log the login action
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: 'user_login',
            description: 'Utilisateur connecté',
            entityType: 'user',
            entityId: user.id,
          },
        });
      } catch (error) {
        console.error('Error creating session:', error);
        // Don't fail login if session creation fails
      }

      return true;
    },
    async signOut({ token }) {
      if (token?.id) {
        try {
          // Mark all sessions as inactive for this user
          await prisma.userSession.updateMany(
            {
              where: {
                userId: token.id as string,
                isActive: true,
              },
            },
            {
              isActive: false,
            }
          );

          // Log the logout action
          await prisma.activityLog.create({
            data: {
              userId: token.id as string,
              action: 'user_logout',
              description: 'Utilisateur déconnecté',
              entityType: 'user',
              entityId: token.id as string,
            },
          });
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
