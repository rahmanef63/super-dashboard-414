import type { ReactNode } from "react";
import type { SidebarBaseProps, BaseMenuItem } from '../../../../types';

export type UserMenuType = "help" | "messages" | "notifications" | "privacy" | "profile" | "settings";

/**
 * DynamicProps for user menu popovers, extends SidebarBaseProps for DRYness.
 */
export interface DynamicProps extends SidebarBaseProps {
  type: UserMenuType;
  trigger: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * ProfileMenuItem extends BaseMenuItem for profile-related sidebar menu items.
 * Extend this for specific profile menu entries if needed.
 */
export interface ProfileMenuItem extends BaseMenuItem {
  // Add profile-specific fields here
}

/**
 * ProfileMenuProps extends SidebarBaseProps for profile menu components.
 */
export interface ProfileMenuProps extends SidebarBaseProps {
  items: ProfileMenuItem[];
}

export const USER_MENU_TITLES: Record<UserMenuType, string> = {
  help: "Help & Support",
  messages: "Messages",
  notifications: "Notifications",
  privacy: "Privacy Settings",
  profile: "Profile",
  settings: "Settings",
};

export const USER_MENU_CONTENTS: Record<UserMenuType, ReactNode> = {
  help: null,
  messages: null,
  notifications: null,
  privacy: null,
  profile: null,
  settings: null,
};
