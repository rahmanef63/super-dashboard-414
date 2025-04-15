import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "../_types"

// Updated component to handle potentially undefined user prop
export function UserAvatar({ user }: { user?: User | null }) {
  // Provide default values or handle absence gracefully
  const userName = user?.name || "User";
  const userAvatar = user?.avatar;
  const fallbackInitials = userName.substring(0, 2).toUpperCase();

  return (
    <Avatar className="h-8 w-8 rounded-lg">
      {/* Only render AvatarImage if userAvatar is truthy */}
      {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
      <AvatarFallback className="rounded-lg">{fallbackInitials}</AvatarFallback>
    </Avatar>
  )
}
