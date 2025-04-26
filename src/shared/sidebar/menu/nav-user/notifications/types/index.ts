import type { SidebarBaseProps, BaseMenuItem } from '../../../../types';

/**
 * Notification represents a user notification in the sidebar.
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

/**
 * NotificationMenuItem extends BaseMenuItem for notification-related sidebar menu items.
 * Extend this for specific notification menu entries if needed.
 */
export interface NotificationMenuItem extends BaseMenuItem {
  notification: Notification;
}

/**
 * NotificationMenuProps extends SidebarBaseProps for notification menu components.
 */
export interface NotificationMenuProps extends SidebarBaseProps {
  items: NotificationMenuItem[];
}
