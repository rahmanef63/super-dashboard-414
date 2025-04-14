import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MarketingSidebar, MobileNavigation } from "./_components/marketing-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { DevToolsProvider } from "../../shared/dev-tools/dev-tools-provider"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <MarketingSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <MobileNavigation />
            <h1 className="text-xl font-semibold">Marketing</h1>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <DevToolsProvider>{children}</DevToolsProvider>
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            <p>© 2025 Marketing Dashboard. All rights reserved.</p>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
