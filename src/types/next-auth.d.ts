import 'next-auth';
import 'next-auth/jwt';

// Define your user role type if you have one
// export type UserRole = "user" | "admin" | "manager" | "guest";

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string; // Add the fields you put into the session in your [...nextauth] callbacks
      sub?: string; // Standard JWT subject, often used for ID
      role?: string; // Or your UserRole type
      // Add other custom fields like username, etc.
    } & DefaultSession['user']; // Keep the default fields like name, email, image
    accessToken?: string; // Example: if you added an access token
    error?: string; // Example: For handling auth errors
  }

  /**
   * The shape of the user object returned in the OAuth providers' profile callback,
   * or the second parameter of the credentials provider authorize callback.
   * Also used as the shape of the User model in Prisma (if used).
   */
  interface User {
    // Usually corresponds to your User model in the database
    id?: string;
    role?: string; // Or your UserRole type
    username?: string;
    // Add other fields from your User model that you might use in callbacks
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string; // Add the fields you added to the token in the jwt callback
    sub?: string;
    role?: string; // Or your UserRole type
    accessToken?: string;
    // Add any other fields you need persisted in the JWT
  }
}
