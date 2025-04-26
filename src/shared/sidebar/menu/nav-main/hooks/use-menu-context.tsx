"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// Types
export interface MenuContextType {
  dashboardId?: string;
  workspaceId?: string;
  menuId?: string;
  userId?: string;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuContextProvider({
  children,
  dashboardId,
  workspaceId,
  menuId,
  userId,
}: {
  children: ReactNode;
  dashboardId?: string;
  workspaceId?: string;
  menuId?: string;
  userId?: string;
}) {
  return (
    <MenuContext.Provider value={{ dashboardId, workspaceId, menuId, userId }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContextSafe() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("Menu context is missing");
  }
  return context;
}

export function useMenuContext(): MenuContextType {
  const context = useContext(MenuContext);
  if (context) return context;
  // fallback to route-based context if not wrapped in provider
  const params = useParams();
  const pathname = usePathname();
  const dashboardId = params.dashboard as string;
  const workspaceId = params.workspace as string;
  const dashboardMenuId = params.dashboard_menu as string;
  const workspaceMenuId = params.workspace_menu as string;
  const menuId = workspaceId ? workspaceMenuId : dashboardMenuId;
  const userId = "user_1";
  return { dashboardId, workspaceId, menuId, userId };
}

export function MenuContextErrorPlaceholder() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Menu Context Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>Menu context is missing or invalid.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This page was loaded without a valid menu context. Please navigate using the sidebar, or contact your administrator if this issue persists.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
