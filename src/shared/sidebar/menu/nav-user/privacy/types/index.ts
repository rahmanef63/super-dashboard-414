import type { SidebarBaseProps, BaseMenuItem } from '../../../../types';

/**
 * PrivacySettings represents user privacy settings in the sidebar.
 */
export interface PrivacySettings {
  emailVisibility: 'public' | 'private' | 'contacts';
  profileVisibility: 'public' | 'private' | 'contacts';
  activityStatus: boolean;
  readReceipts: boolean;
}

/**
 * PrivacyMenuItem extends BaseMenuItem for privacy-related sidebar menu items.
 * Extend this for specific privacy menu entries if needed.
 */
export interface PrivacyMenuItem extends BaseMenuItem {
  privacy: PrivacySettings;
}

/**
 * PrivacyMenuProps extends SidebarBaseProps for privacy menu components.
 */
export interface PrivacyMenuProps extends SidebarBaseProps {
  items: PrivacyMenuItem[];
}
