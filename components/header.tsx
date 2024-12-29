"use client"

import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MobileNav } from "@/components/mobile-nav"

export function Header() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-14 items-center px-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="text-xl font-semibold text-slate-900">Student Portal</div>
        <div className="ml-auto">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

