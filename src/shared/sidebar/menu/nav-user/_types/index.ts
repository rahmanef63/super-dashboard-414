import type { User, SidebarBaseProps } from '../../../types';

/**
 * NavUserProps extends SidebarBaseProps for nav-user menu components.
 * Use this as the main props shape for user-related sidebar menus.
 */
export interface NavUserProps extends SidebarBaseProps {
  user: User;
}
