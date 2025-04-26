import type { SidebarBaseProps, Dashboard } from '../../../types';

export interface DashboardSwitcherProps extends SidebarBaseProps {
  teams?: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  dashboard?: Dashboard;
}
