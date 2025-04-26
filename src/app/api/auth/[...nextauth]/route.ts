// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Mask password in logs
        const maskedCreds = credentials ? { ...credentials, password: credentials.password ? '***' : undefined } : credentials;
        console.log(`[NextAuth][authorize] [TRACKER] Received credentials:`, maskedCreds);
        if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
          console.warn(`[NextAuth][authorize] [TRACKER] Missing or invalid email or password.`);
          return null;
        }
        let user;
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          console.log(`[NextAuth][authorize] [TRACKER] User from DB:`, user);
        } catch (dbErr) {
          console.error(`[NextAuth][authorize] [TRACKER] Error fetching user from DB:`, dbErr);
          return null;
        }
        if (!user) {
          console.warn(`[NextAuth][authorize] [TRACKER] User not found.`);
          return null;
        }
        if (!user.passwordHash || typeof user.passwordHash !== 'string') {
          console.warn(`[NextAuth][authorize] [TRACKER] User missing passwordHash.`);
          return null;
        }
        let isValid = false;
        try {
          isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          console.log(`[NextAuth][authorize] [TRACKER] Password valid:`, isValid);
        } catch (bcryptErr) {
          console.error(`[NextAuth][authorize] [TRACKER] Error comparing password:`, bcryptErr);
          return null;
        }
        if (!isValid) {
          console.warn(`[NextAuth][authorize] [TRACKER] Invalid password for user:`, credentials.email);
          return null;
        }
        // Tracker: check if user has access to required database
        try {
          // Example: check if user has a role or permission for DB (customize as needed)
          if (!user.roleId) {
            console.warn(`[NextAuth][authorize] [TRACKER] User missing roleId, denying DB access.`);
            return null;
          }
          // Add more DB access checks here as needed
          console.log(`[NextAuth][authorize] [TRACKER] User has roleId:`, user.roleId);
        } catch (dbAccessErr) {
          console.error(`[NextAuth][authorize] [TRACKER] Error checking DB access:`, dbAccessErr);
          return null;
        }
        // Only return the fields NextAuth expects
        const sessionUser = {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
        };
        console.log(`[NextAuth][authorize] [TRACKER] Returning user:`, sessionUser);
        return sessionUser;
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token, user, trigger, newSession }) {
      // Print all cookies and headers if available
      try {
        if (typeof global !== 'undefined' && global?.process?.env?.NODE_ENV === 'development') {
          if (typeof window !== 'undefined') {
            // On client
            console.log(`[NextAuth][session callback][TRACKER][CLIENT] Document cookies:`, document.cookie);
          }
        }
      } catch (err) {
        console.error('[NextAuth][session callback][TRACKER] Error logging cookies:', err);
      }
      console.log(`[NextAuth][session callback][IN]`, { session, token, user, trigger, newSession });
      // Extra log for session.user before mutation
      console.log(`[NextAuth][session callback][PRE-MUTATE] session.user:`, session.user);
      // Ensure session.user always exists
      session.user = session.user || {};
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      console.log('[NextAuth][session callback][TRACKER] Final session.user:', session.user);
      console.log(`[NextAuth][session callback][OUT]`, session);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log(`[NextAuth][jwt callback][IN]`, { token, user, account, profile, isNewUser });
      // Log token before mutation
      console.log(`[NextAuth][jwt callback][PRE-MUTATE] token:`, token);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      console.log(`[NextAuth][jwt callback][OUT]`, token);
      return token;
    },
  },
});

console.log('[NextAuth] Handler loaded for GET/POST');
export { handler as GET, handler as POST };