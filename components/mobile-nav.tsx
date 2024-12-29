"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, GraduationCap, ListTodo, FileText, Home } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const routes = [
{
  label: "Home",
  icon: Home,
  href: "/",
},
{
  label: "Classes",
  icon: GraduationCap,
  href: "/classes",
},
{
  label: "Schedule",
  icon: Calendar,
  href: "/schedule",
},
{
  label: "To-Do List",
  icon: ListTodo,
  href: "/todo",
},
{
  label: "Notes & PDFs",
  icon: FileText,
  href: "/notes",
},
]

export function MobileNav() {
const pathname = usePathname()

return (
  <nav className="md:hidden">
    <ul className="flex space-x-2">
      {routes.map((route) => (
        <li key={route.href}>
          <Button
            asChild
            variant={pathname === route.href ? "secondary" : "ghost"}
            size="icon"
            className={cn(
              "w-9 h-9",
              pathname === route.href && "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-700",
            )}
          >
            <Link href={route.href}>
              <route.icon className="h-5 w-5" />
              <span className="sr-only">{route.label}</span>
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  </nav>
)
}

