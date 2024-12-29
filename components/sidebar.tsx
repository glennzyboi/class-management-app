"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, GraduationCap, ListTodo, FileText, Home } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/sidebar-provider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    tooltip: "Go to the home page"
  },
  {
    label: "Classes",
    icon: GraduationCap,
    href: "/classes",
    tooltip: "View and manage your classes"
  },
  {
    label: "Schedule",
    icon: Calendar,
    href: "/schedule",
    tooltip: "Create and customize your schedule"
  },
  {
    label: "To-Do List",
    icon: ListTodo,
    href: "/todo",
    tooltip: "Manage your tasks and assignments"
  },
  {
    label: "Notes & PDFs",
    icon: FileText,
    href: "/notes",
    tooltip: "Access and share study materials"
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen } = useSidebar()

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex-shrink-0 overflow-y-auto bg-white border-r transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <nav className="flex flex-col h-full py-6 px-3">
          {routes.map((route) => (
            <Tooltip key={route.href}>
              <TooltipTrigger asChild>
                {!isOpen ? (
                  <div className="w-full">
                    <Link 
                      href={route.href}
                      className={cn(
                        "flex items-center justify-center w-full p-3 mb-2 rounded-md transition-colors duration-200",
                        pathname === route.href 
                          ? "bg-indigo-100 text-indigo-700" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        "flex-col"
                      )}
                    >
                      <route.icon className="h-6 w-6" />
                    </Link>
                  </div>
                ) : (
                  <Link 
                    href={route.href}
                    className={cn(
                      "flex items-center justify-start w-full p-3 mb-2 rounded-md transition-colors duration-200 space-x-3",
                      pathname === route.href 
                        ? "bg-indigo-100 text-indigo-700" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <route.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">
                      {route.label}
                    </span>
                  </Link>
                )}
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right">
                  <p>{route.tooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  )
}

