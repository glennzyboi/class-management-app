"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, Search, Edit, Trash, ChevronDown } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Todo {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  class: string
  notes: string[]
}

const initialTodos: Todo[] = [ // EXAMPLE DATA ONLY FIX LATER WHEN WORKING WITH BACKEND
  {
    id: "1",
    title: "Complete CS101 Assignment",
    description: "Finish the programming assignment on data structures",
    dueDate: "2024-01-10",
    completed: false,
    class: "CS101",
    notes: ["Review linked lists", "Implement binary search tree"]
  },
  {
    id: "2",
    title: "Study for Math Exam",
    description: "Prepare for the upcoming calculus exam",
    dueDate: "2024-01-15",
    completed: true,
    class: "MATH201",
    notes: ["Practice integration techniques", "Review limits and derivatives"]
  },
]

export default function TodoPage() {
  const classes = ["All", "CS101", "MATH201"] // EXAMPLE CLASSES ONLY FIX LATER WHEN WORKING WITH BACKEND


  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTask, setNewTask] = useState<Omit<Todo, 'id' | 'completed' | 'notes'>>({ 
    title: "", 
    description: "",
    dueDate: "", 
    class: ""
  })
  const [editingTask, setEditingTask] = useState<Todo | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingTask) {
      setEditingTask({ ...editingTask, [name]: value })
    } else {
      setNewTask({ ...newTask, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTask) {
      setTodos(todos.map(todo => todo.id === editingTask.id ? editingTask : todo))
      setEditingTask(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Task updated",
        description: `"${editingTask.title}" has been updated.`,
      })
    } else {
      const newTodo: Todo = {
        id: (todos.length + 1).toString(),
        ...newTask,
        completed: false,
        notes: []
      }
      setTodos([...todos, newTodo])
      setNewTask({ title: "", description: "", dueDate: "", class: "" })
      setIsAddDialogOpen(false)
      toast({
        title: "Task added",
        description: `"${newTask.title}" has been added to your to-do list.`,
      })
    }
  }

  const toggleTaskCompletion = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTask = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
    toast({
      title: "Task deleted",
      description: "The task has been removed from your to-do list.",
    })
  }

  const editTask = (task: Todo) => {
    setEditingTask(task)
    setIsEditDialogOpen(true)
  }

  const addNote = (taskId: string, note: string) => {
    setTodos(todos.map(todo => 
      todo.id === taskId ? { ...todo, notes: [...todo.notes, note] } : todo
    ))
  }

  const removeNote = (taskId: string, noteIndex: number) => {
    setTodos(todos.map(todo => 
      todo.id === taskId ? { ...todo, notes: todo.notes.filter((_, index) => index !== noteIndex) } : todo
    ))
  }

  const sortedTodos = todos
    .filter(todo => todo.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">To-Do List</h2>
          <p className="text-sm text-slate-500">Keep track of your tasks and assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Enter the details of the new task you want to add.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="class" className="text-right">
                    Class
                  </Label>
                  <Select 
                    name="class" 
                    value={newTask.class} 
                    onValueChange={(value) => setNewTask({...newTask, class: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.filter(c => c !== "All").map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Manage your upcoming tasks and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {sortedTodos.map((todo) => (
              <Collapsible key={todo.id}>
                <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTaskCompletion(todo.id)}
                  />
                  <div className="flex-1">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <div>
                        <p className={`font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {todo.title}
                        </p>
                        <p className="text-sm text-slate-500">Due: {todo.dueDate} | Class: {todo.class}</p>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="mt-2 ml-8 space-y-2 p-4 bg-slate-100 rounded-lg">
                    <p className="text-sm text-slate-600">{todo.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Notes:</h4>
                      {todo.notes.map((note, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded">
                          <p className="text-sm flex-1">{note}</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeNote(todo.id, index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add a note"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addNote(todo.id, e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const input = document.querySelector(`input[placeholder="Add a note"]`) as HTMLInputElement
                            if (input && input.value) {
                              addNote(todo.id, input.value)
                              input.value = ''
                            }
                          }}
                        >
                          Add Note
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => editTask(todo)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteTask(todo.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the details of your task.
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={editingTask.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={editingTask.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="edit-dueDate"
                    name="dueDate"
                    type="date"
                    value={editingTask.dueDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-class" className="text-right">
                    Class
                  </Label>
                  <Select 
                    name="class" 
                    value={editingTask.class} 
                    onValueChange={(value) => setEditingTask({...editingTask, class: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.filter(c => c !== "All").map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Task</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

