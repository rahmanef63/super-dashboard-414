import { NextAuthOptions, DefaultSession, User as NextAuthUser, Session as NextAuthSession } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import bcrypt from 'bcrypt';
import { prisma } from "./prisma";

// Define a type that includes the id property we expect on the user object
interface UserWithId extends Omit<NextAuthUser, 'image'> { 
  id: string;
}

// Define a type for the token that includes id and other synced properties
interface TokenWithId extends JWT {
  id?: string;
  name?: string | null;
  email?: string | null;
}

// Define a custom Session shape that will be returned *after* the callback modifies it
interface SessionWithId extends NextAuthSession {
  user?: UserWithId; // The user object within the session should have an id
}

// Log the secret when the module loads (will appear in server logs during startup/build)
console.log("[auth.ts] NEXTAUTH_SECRET on load:", process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.substring(0, 5) + '...' : 'UNDEFINED');

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Log the secret *inside* the authorize function (at runtime)
        console.log("[auth.ts] NEXTAUTH_SECRET in authorize:", process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.substring(0, 5) + '...' : 'UNDEFINED');
        console.log("Authorize Function - Credentials:", credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorize Failed: Missing email or password");
          return null;
        }
        try {
          console.log(`Authorize: Looking up user ${credentials.email}`);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user && user.passwordHash) {
            console.log(`Authorize: User found: ${user.email}, comparing password...`);
            const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
            if (passwordMatch) {
              console.log(`Authorize: Password match for ${user.email}`);
              const userToReturn: UserWithId = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
              };
              console.log("Authorize Success - Returning User:", userToReturn);
              return userToReturn;
            } else {
              console.log(`Authorize Failed: Incorrect password for ${user.email}`);
               // Throwing an error is better for Credentials provider
              throw new Error("CredentialsSignin");
            }
          } else {
            console.log(`Authorize Failed: User not found or missing password hash for ${credentials.email}`);
            throw new Error("CredentialsSignin");
          }
        } catch (error) {
          console.error("Authorize Error:", error);
           // Rethrow or return null. Rethrowing provides error info to client.
          if (error instanceof Error && error.message === "CredentialsSignin") {
            throw error; // Rethrow specific error
          }
          throw new Error("Authorization process failed"); // Throw generic for other errors
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    // Restore original callbacks
    async jwt({ token, user }: { token: TokenWithId; user?: UserWithId | DefaultSession['user'] }) {
       console.log("JWT Callback - User:", user); 
       console.log("JWT Callback - Token (In):", token); 
      if (user) {
         const userId = (user as UserWithId)?.id;
         if (userId) {
            token.id = userId;
            console.log(`JWT Callback - User ID added to token: ${userId}`);
         } else {
             console.warn("JWT Callback - User object received, but ID is missing:", user);
         }
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
      }
       console.log("JWT Callback - Token (Out):", token); 
      return token;
    },
    async session({ session, token }: { session: NextAuthSession; token: TokenWithId }) {
        console.log("Session Callback - Token:", token); 
        console.log("Session Callback - Session (In):", session); 

       if (session.user) {
         if (token.id) {
           (session.user as UserWithId).id = token.id; 
           console.log(`Session Callback - User ID added to session: ${token.id}`);
         } else {
           console.warn("Session Callback - Token did not contain ID");
         }
         if (token.name) session.user.name = token.name;
         if (token.email) session.user.email = token.email;
       } else {
          console.warn("Session Callback - session.user was initially undefined");
       }

      console.log("Session Callback - Session (Out):", session); 
      return session as SessionWithId; 
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};