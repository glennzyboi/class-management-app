import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Calendar, ListTodo, FileText } from 'lucide-react'
import Link from "next/link"

const features = [
  {
    title: "Class Management",
    description: "View and manage your enrolled classes",
    icon: GraduationCap,
    href: "/classes"
  },
  {
    title: "Schedule Maker",
    description: "Create and customize your class schedule",
    icon: Calendar,
    href: "/schedule"
  },
  {
    title: "To-Do Lists",
    description: "Keep track of assignments and tasks",
    icon: ListTodo,
    href: "/todo"
  },
  {
    title: "Notes & Resources",
    description: "Access and share class materials",
    icon: FileText,
    href: "/notes"
  },
]

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Welcome to Student Portal</h1>
        <p className="text-lg text-slate-600">Manage your academic life with ease</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href} className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-indigo-500/20">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-indigo-100">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">{feature.title}</CardTitle>
                <CardDescription className="text-sm text-slate-500">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

