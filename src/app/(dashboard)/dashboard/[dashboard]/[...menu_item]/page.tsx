// Example for [dashboard]/[...menu_item]/page.tsx

import { MenuPage } from "@/shared/sidebar/menu/menu-page";
import { MenuContextProvider, MenuContextErrorPlaceholder } from "@/shared/sidebar/menu/nav-main/hooks/use-menu-context";
import { notFound, redirect } from 'next/navigation';
import React from "react";

interface Props {
  params: {
    dashboard: string;
    menu_item?: string[];
  };
}

export default function DashboardMenuItemPage({ params }: Props) {
  const { dashboard, menu_item = [] } = params;
  if (!dashboard) {
    redirect('/dashboard');
  }
  const menuId = menu_item.length > 0 ? menu_item[menu_item.length - 1] : undefined;
  // If you have workspaceId in the route, extract accordingly

  // Error boundary for missing context
  class MenuContextBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: any) {
      return { hasError: true };
    }
    componentDidCatch(error: any, errorInfo: any) {}
    render() {
      if (this.state.hasError) {
        return <MenuContextErrorPlaceholder />;
      }
      return this.props.children;
    }
  }

  return (
    <MenuContextBoundary>
      <MenuContextProvider
        dashboardId={dashboard}
        workspaceId={menu_item.length > 1 ? menu_item[menu_item.length - 2] : undefined}
        menuId={menuId}
      >
        <MenuPage />
      </MenuContextProvider>
    </MenuContextBoundary>
  );
}