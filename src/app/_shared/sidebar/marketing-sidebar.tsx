"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Info, Briefcase, FileText, Mail, Image, Users, Settings, ChevronsUpDown, Menu } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Map of routes to icons
const routeIcons = {
  "/marketing-dashboard": Home,
  "/marketing/aboutus": Info,
  "/marketing/portfolio": Briefcase,
  "/marketing/blog": FileText,
  "/marketing/contact": Mail,
  "/marketing/gallery": Image,
  "/marketing/team": Users,
  "/marketing/settings": Settings,
}

// Navigation items
const navigationItems = [
  { title: "Home", path: "/home", icon: Home },
  { title: "About Us", path: "/marketing/aboutus", icon: Info },
  { title: "Portfolio", path: "/marketing/portfolio", icon: Briefcase },
  { title: "Blog", path: "/marketing/blog", icon: FileText },
  { title: "Contact", path: "/marketing/contact", icon: Mail },
  { title: "Gallery", path: "/marketing/gallery", icon: Image },
  { title: "Team", path: "/marketing/team", icon: Users },
  { title: "Settings", path: "/marketing/settings", icon: Settings },
]

export function MarketingSidebar() {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Marketing</span>
                <span className="truncate text-xs">Dashboard</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <Link href={item.path} passHref>
                  <SidebarMenuButton isActive={pathname === item.path} tooltip={item.title}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/marketing/contact" passHref>
              <SidebarMenuButton>
                <Mail className="size-4" />
                <span>Contact Us</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// Mobile navigation for small screens
export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="px-2 py-6">
          <div className="mb-4 flex items-center">
            <Briefcase className="mr-2 h-6 w-6" />
            <h2 className="text-lg font-semibold">Marketing Dashboard</h2>
          </div>
          <nav className="grid gap-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
