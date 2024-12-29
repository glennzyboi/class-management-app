"use client"

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, File, Search } from 'lucide-react'
import { useToast } from "@/components/use-toast"

interface Note {
  id: string
  title: string
  type: string
  size: string
  date: string
  class: string
  file?: File
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "CS101 Lecture Notes",
    type: "PDF",
    size: "2.4 MB",
    date: "2024-01-05",
    class: "CS101"
  },
  {
    id: "2",
    title: "Math Study Guide",
    type: "PDF",
    size: "1.8 MB",
    date: "2024-01-03",
    class: "MATH201"
  },
  {
    id: "3",
    title: "CS101 Assignment 1",
    type: "PDF",
    size: "1.2 MB",
    date: "2024-01-07",
    class: "CS101"
  },
  {
    id: "4",
    title: "MATH201 Formula Sheet",
    type: "PDF",
    size: "0.5 MB",
    date: "2024-01-08",
    class: "MATH201"
  },
]

const classes = ["All Classes", "CS101", "MATH201"]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("All Classes")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const filteredNotes = notes.filter(note => 
    (selectedClass === "All Classes" || note.class === selectedClass) &&
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const newNote: Note = {
          id: (notes.length + 1).toString(),
          title: file.name,
          type: file.type.split('/')[1].toUpperCase(),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          date: new Date().toISOString().split('T')[0],
          class: "Uncategorized",
          file: file
        }
        setNotes(prevNotes => [...prevNotes, newNote])
      })
      toast({
        title: "File(s) uploaded",
        description: `${files.length} file(s) have been added to your notes.`,
      })
    }
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Notes & PDFs</h2>
          <p className="text-sm text-slate-500">Access and share your study materials</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.txt"
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Files</CardTitle>
          <CardDescription>Browse and manage your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50"
              >
                <div className="p-2 rounded-lg bg-indigo-50">
                  <File className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{note.title}</p>
                  <div className="flex space-x-4 text-sm text-slate-500">
                    <span>{note.type}</span>
                    <span>{note.size}</span>
                    <span>{note.date}</span>
                    <span>{note.class}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  if (note.file) {
                    const url = URL.createObjectURL(note.file)
                    window.open(url, '_blank')
                  } else {
                    toast({
                      title: "File not available",
                      description: "This file cannot be downloaded as it was not uploaded in this session.",
                      variant: "destructive"
                    })
                  }
                }}>
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

