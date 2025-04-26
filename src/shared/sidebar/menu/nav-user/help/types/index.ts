import type { SidebarBaseProps, BaseMenuItem } from '../../../../types';

/**
 * HelpMenuItem extends BaseMenuItem for help-related sidebar menu items.
 * Extend this for specific help menu entries if needed.
 */
export interface HelpMenuItem extends BaseMenuItem {
  // Add help-specific fields here
}

/**
 * HelpMenuProps extends SidebarBaseProps for help menu components.
 */
export interface HelpMenuProps extends SidebarBaseProps {
  items: HelpMenuItem[];
}
