import type { SidebarBaseProps, BaseMenuItem } from '../../../../types';

/**
 * UserSettings represents user settings in the sidebar.
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}

/**
 * SettingsMenuItem extends BaseMenuItem for settings-related sidebar menu items.
 * Extend this for specific settings menu entries if needed.
 */
export interface SettingsMenuItem extends BaseMenuItem {
  settings: UserSettings;
}

/**
 * SettingsMenuProps extends SidebarBaseProps for settings menu components.
 */
export interface SettingsMenuProps extends SidebarBaseProps {
  items: SettingsMenuItem[];
}
