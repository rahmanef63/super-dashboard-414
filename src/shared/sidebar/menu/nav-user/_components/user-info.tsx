import type { User } from "../_types"

export function UserInfo({ user }: { user?: User }) { // Make user prop optional
  // Provide fallbacks if user or its properties are not yet defined
  const name = user?.name || "User"; // Use optional chaining and fallback
  const email = user?.email || "Loading..."; // Use optional chaining and fallback

  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">{name}</span>
      <span className="truncate text-xs">{email}</span>
    </div>
  )
}
