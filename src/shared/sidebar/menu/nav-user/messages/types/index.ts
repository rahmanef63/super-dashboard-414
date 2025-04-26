import type { SidebarBaseProps, BaseMenuItem } from '../../../../types';

/**
 * Message represents a user message in the sidebar.
 */
export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  read: boolean;
}

/**
 * MessageMenuItem extends BaseMenuItem for message-related sidebar menu items.
 * Extend this for specific message menu entries if needed.
 */
export interface MessageMenuItem extends BaseMenuItem {
  message: Message;
}

/**
 * MessageMenuProps extends SidebarBaseProps for message menu components.
 */
export interface MessageMenuProps extends SidebarBaseProps {
  items: MessageMenuItem[];
}
