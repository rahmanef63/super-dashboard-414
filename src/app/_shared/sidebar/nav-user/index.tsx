// Modification: Using real user data from useAuth hook.

"use client"

import { ChevronsUpDown, Keyboard, LogOut } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar" // Corrected import path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu" // Corrected import path
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar" // Corrected import path
import { useToast } from "@/hooks/use-toast" // Corrected import path
import { useMediaQuery } from "@/hooks/use-media-query" // Corrected import path
import { useUserMenu } from "./profile/hooks/useUserMenu"
import { USER_MENU_ITEMS } from "./profile/config/menuItems"
import { showKeyboardShortcuts } from "./profile/utils/userActions"
import { DynamicSheet } from "./profile/lib/DynamicSheet"
import { DynamicDrawer } from "./profile/lib/DynamicDrawer"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

export function NavUser() {
  const { toast } = useToast()
  const { isMobile, state: sidebarState } = useSidebar()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { user, loading, logout: authLogout } = useAuth()

  const {
    activeMenu,
    dropdownOpen,
    handleMenuOpen,
    handleOpenChange,
    handleDropdownChange
  } = useUserMenu()

  useEffect(() => {
    if (sidebarState === "collapsed") {
      handleDropdownChange(false)
    }
  }, [sidebarState, handleDropdownChange])

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="pointer-events-none">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-1 h-3 w-24" />
            </div>
            <ChevronsUpDown className="ml-auto size-4 opacity-50" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!user) {
     return null;
  }

  const userName = user.name || "User";
  const userEmail = user.email || "";
  const userAvatar = user.image; // Use user.image from useAuth
  const userInitials = userName
    ? userName
        .split(" ")
        .map((n: string) => n[0]) // Added type annotation for n
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      {USER_MENU_ITEMS.map(({ type }) => (
        isDesktop ? (
          <DynamicSheet
            key={type}
            type={type}
            open={activeMenu === type}
            onOpenChange={handleOpenChange}
          />
        ) : (
          <DynamicDrawer
            key={type}
            type={type}
            open={activeMenu === type}
            onOpenChange={handleOpenChange}
          />
        )
      ))}

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={handleDropdownChange}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* Use userAvatar which comes from user.image */} 
                  <AvatarImage src={userAvatar ?? undefined} alt={userName} /> 
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userAvatar ?? undefined} alt={userName} />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs">{userEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {USER_MENU_ITEMS.map(({ type, icon, label, shortcut }) => (
                  <DropdownMenuItem key={type} onSelect={() => handleMenuOpen(type)}>
                    {icon}
                    {label}
                    {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => showKeyboardShortcuts(toast)}>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard shortcuts
                  <DropdownMenuShortcut>?</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => {
                try {
                    await authLogout();
                    toast({ title: "Logged out successfully." });
                } catch (error) {
                    toast({ title: "Logout failed", description: (error as Error).message, variant: "destructive" });
                }
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
