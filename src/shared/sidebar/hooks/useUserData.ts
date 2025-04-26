// Sidebar-specific user data hook
import type { User } from "@/types";

export function useUserData(user?: User) {
  // Example implementation, customize as needed
  if (!user) return { name: "Guest", email: "", avatar: undefined };
  return {
    name: user.name || user.email || "User",
    email: user.email,
    avatar: user.avatar, // Fix: use 'avatar' instead of 'avatarUrl'
  };
}
