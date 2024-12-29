"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit, ChevronRight, ChevronLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"

interface ClassSchedule {
  days: string[];
  startTime: string;
  endTime: string;
}

interface Class {
  id: string
  code: string
  name: string
  schedule: ClassSchedule[]
  instructor: string
  room: string
}

interface Todo {
  id: string
  title: string
  dueDate: string
  completed: boolean
  class: string
}

const initialClasses: Class[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    schedule: [
      { days: ['Monday', 'Wednesday'], startTime: '08:00', endTime: '10:00' },
      { days: ['Friday'], startTime: '13:00', endTime: '14:00' }
    ],
    instructor: "Dr. Smith",
    room: "Room 301"
  },
  {
    id: "2",
    code: "MATH201",
    name: "Advanced Calculus",
    schedule: [
      { days: ['Tuesday', 'Thursday'], startTime: '13:00', endTime: '14:30' }
    ],
    instructor: "Prof. Johnson",
    room: "Room 205"
  },
]

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Complete CS101 Assignment",
    dueDate: "2024-01-10",
    completed: false,
    class: "CS101"
  },
  {
    id: "2",
    title: "Study for Math Exam",
    dueDate: "2024-01-15",
    completed: true,
    class: "MATH201"
  },
]

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(initialClasses)
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newClass, setNewClass] = useState<Omit<Class, 'id'>>({
    code: "",
    name: "",
    schedule: [{ days: [], startTime: "", endTime: "" }],
    instructor: "",
    room: ""
  })
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingClass, setViewingClass] = useState<Class | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingClass) {
      setEditingClass({ ...editingClass, [name]: value })
    } else {
      setNewClass({ ...newClass, [name]: value })
    }
  }

  const handleScheduleChange = (index: number, field: keyof ClassSchedule, value: string | string[]) => {
    const updatedSchedule = editingClass ? [...editingClass.schedule] : [...newClass.schedule]
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value }
    if (editingClass) {
      setEditingClass({ ...editingClass, schedule: updatedSchedule })
    } else {
      setNewClass({ ...newClass, schedule: updatedSchedule })
    }
  }

  const addScheduleSlot = () => {
    const updatedSchedule = editingClass ? [...editingClass.schedule] : [...newClass.schedule]
    updatedSchedule.push({ days: [], startTime: "", endTime: "" })
    if (editingClass) {
      setEditingClass({ ...editingClass, schedule: updatedSchedule })
    } else {
      setNewClass({ ...newClass, schedule: updatedSchedule })
    }
  }

  const removeScheduleSlot = (index: number) => {
    const updatedSchedule = editingClass ? [...editingClass.schedule] : [...newClass.schedule]
    updatedSchedule.splice(index, 1)
    if (editingClass) {
      setEditingClass({ ...editingClass, schedule: updatedSchedule })
    } else {
      setNewClass({ ...newClass, schedule: updatedSchedule })
    }
  }

  const validateClass = (class_: Omit<Class, 'id'>) => {
    if (!class_.code || !class_.name || !class_.instructor || !class_.room) {
      return "Please fill in all fields."
    }
    if (class_.schedule.length === 0) {
      return "Please add at least one schedule slot."
    }
    for (const slot of class_.schedule) {
      if (slot.days.length === 0 || !slot.startTime || !slot.endTime) {
        return "Please complete all schedule information."
      }
    }
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const classToValidate = editingClass || newClass
    const validationError = validateClass(classToValidate)
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    if (editingClass) {
      setClasses(classes.map(c => c.id === editingClass.id ? editingClass : c))
      setEditingClass(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Class updated",
        description: `${editingClass.code} - ${editingClass.name} has been updated.`,
      })
    } else {
      const newClassWithId = {
        ...newClass,
        id: (classes.length + 1).toString(),
      }
      setClasses([...classes, newClassWithId])
      setNewClass({
        code: "",
        name: "",
        schedule: [{ days: [], startTime: "", endTime: "" }],
        instructor: "",
        room: ""
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Class added",
        description: `${newClass.code} - ${newClass.name} has been added to your classes.`,
      })
    }
    setCurrentStep(1)
  }

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id))
    toast({
      title: "Class deleted",
      description: "The class has been removed from your list.",
    })
  }

  const editClass = (class_: Class) => {
    setEditingClass(class_)
    setIsEditDialogOpen(true)
  }

  const viewClassDetails = (class_: Class) => {
    setViewingClass(class_)
    setIsViewDialogOpen(true)
  }

  const formatSchedule = (schedule: ClassSchedule[]) => {
    return schedule.map(slot => {
      const days = slot.days.map(day => day.slice(0, 3)).join(', ')
      return `${days} ${slot.startTime} - ${slot.endTime}`
    }).join('; ')
  }

  const renderFormStep = () => {
    const currentClass = editingClass || newClass
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Class Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={currentClass.code}
                    onChange={handleInputChange}
                    placeholder="e.g., CS101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentClass.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  value={currentClass.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g., Dr. Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  name="room"
                  value={currentClass.room}
                  onChange={handleInputChange}
                  placeholder="e.g., Room 301"
                />
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <div className="space-y-4">
            {currentClass.schedule.map((slot, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">Schedule Slot {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${day}-${index}`}
                              checked={slot.days.includes(day)}
                              onCheckedChange={(checked) => {
                                const updatedDays = checked
                                  ? [...slot.days, day]
                                  : slot.days.filter(d => d !== day)
                                handleScheduleChange(index, 'days', updatedDays)
                              }}
                            />
                            <Label htmlFor={`${day}-${index}`}>{day.slice(0, 3)}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`startTime-${index}`}>Start Time</Label>
                        <Input
                          id={`startTime-${index}`}
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`endTime-${index}`}>End Time</Label>
                        <Input
                          id={`endTime-${index}`}
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                {index > 0 && (
                  <CardFooter className="flex justify-end pt-4">
                    <Button variant="destructive" size="sm" onClick={() => removeScheduleSlot(index)}>
                      Remove Slot
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
            <Button variant="outline" onClick={addScheduleSlot}>
              Add Schedule Slot
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">My Classes</h2>
          <p className="text-sm text-slate-500">Manage your enrolled classes and schedules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) setCurrentStep(1)
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
                <DialogDescription>
                  {currentStep === 1 ? 'Enter the basic details of the class.' : 'Set up the class schedule.'}
                </DialogDescription>
              </DialogHeader>
              {renderFormStep()}
              <DialogFooter className="mt-6">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                {currentStep < 2 ? (
                  <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit">
                    {editingClass ? 'Update Class' : 'Add Class'}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((class_) => (
          <Card key={class_.id} className="relative hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{class_.name}</CardTitle>
                  <CardDescription>{class_.code}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            editClass(class_);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Class</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteClass(class_.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Class</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Schedule:</span>
                  <span className="font-medium text-right">{formatSchedule(class_.schedule)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Instructor:</span>
                  <span className="font-medium">{class_.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room:</span>
                  <span className="font-medium">{class_.room}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => viewClassDetails(class_)}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="space-y-2 mb-6">
            <DialogTitle className="text-2xl font-semibold">{viewingClass?.name}</DialogTitle>
            <DialogDescription className="text-lg">
              {viewingClass?.code} - Detailed Information
            </DialogDescription>
          </DialogHeader>
          {viewingClass && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-lg font-medium">Schedule</Label>
                  <p className="text-base">{formatSchedule(viewingClass.schedule)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-medium">Instructor</Label>
                  <p className="text-base">{viewingClass.instructor}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-medium">Room</Label>
                  <p className="text-base">{viewingClass.room}</p>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-lg font-medium">Assignments</Label>
                <div className="space-y-3">
                  {todos.filter(todo => todo.class === viewingClass.code).map((todo) => ( // MAPPING OUT ALL PRESENT TO ITEMS IN TO DO LIST
                    <div key={todo.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-100 rounded-lg">
                      <span className="text-base font-medium mb-2 sm:mb-0">{todo.title}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-600">Due: {todo.dueDate}</span>
                        <span className={`text-sm px-3 py-1 rounded-full ${todo.completed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

