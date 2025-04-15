// src/components/providers/sidebar-provider.tsx
"use client";

import { SidebarMenu } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  return <SidebarMenu>{children}</SidebarMenu>;
};