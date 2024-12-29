"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download } from 'lucide-react'
import html2canvas from 'html2canvas'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const timeSlots = Array.from({ length: 14 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`)

interface Class {
  id: string
  code: string
  name: string
  schedule?: string
  instructor: string
  room: string
}

interface ScheduleItem {
  day: string
  time: string
  class: Class
}

const fontSizes = [
  { value: "12", label: "Small" },
  { value: "14", label: "Medium" },
  { value: "16", label: "Large" },
  { value: "18", label: "Extra Large" },
]

export default function SchedulePage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [customization, setCustomization] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    accentColor: "#4f46e5",
    fontSize: "14",
  })
  const scheduleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch classes from an API or local storage in a real application
    const fetchedClasses = [
      {
        id: "1",
        code: "CS101",
        name: "Introduction to Computer Science",
        schedule: "MWF 9:00 AM - 10:30 AM",
        instructor: "Dr. Smith",
        room: "Room 301"
      },
      {
        id: "2",
        code: "MATH201",
        name: "Advanced Calculus",
        schedule: "TTH 1:00 PM - 2:30 PM",
        instructor: "Prof. Johnson",
        room: "Room 205"
      },
    ]
    setClasses(fetchedClasses)
  }, [])

  const addToSchedule = () => {
    if (selectedClass) {
      const classToAdd = classes.find(c => c.id === selectedClass)
      if (classToAdd) {
        const scheduleItems = classToAdd.schedule?.split(', ').map(item => {
          const [day, time] = item.split(' ')
          const [startTime, endTime] = time.split(' - ')
          return { day, startTime, endTime }
        })
        
        scheduleItems?.forEach(item => {
          const startHour = parseInt(item.startTime.split(':')[0])
          const endHour = parseInt(item.endTime.split(':')[0])
          for (let hour = startHour; hour < endHour; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`
            setSchedule(prev => [...prev, { 
              day: item.day, 
              time, 
              class: classToAdd 
            }])
          }
        })
      }
      setSelectedClass("")
    }
  }

  const removeFromSchedule = (day: string, time: string) => {
    setSchedule(schedule.filter(item => !(item.day === day && item.time === time)))
  }

  const handleCustomizationChange = (key: string, value: string) => {
    setCustomization(prev => ({ ...prev, [key]: value }))
  }

  const exportSchedule = async () => {
    if (scheduleRef.current) {
      const canvas = await html2canvas(scheduleRef.current)
      const image = canvas.toDataURL("image/png")
      const link = document.createElement('a')
      link.href = image
      link.download = 'my-schedule.png'
      link.click()
    }
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Schedule Maker</h2>
        <p className="text-sm text-slate-500">Create and manage your customized class schedule</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customizable Schedule</CardTitle>
          <CardDescription>Add your classes and customize the appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((class_) => (
                    <SelectItem key={class_.id} value={class_.id}>
                      {class_.code} - {class_.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addToSchedule}>Add to Schedule</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => handleCustomizationChange('backgroundColor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <Input
                  id="textColor"
                  type="color"
                  value={customization.textColor}
                  onChange={(e) => handleCustomizationChange('textColor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <Input
                  id="accentColor"
                  type="color"
                  value={customization.accentColor}
                  onChange={(e) => handleCustomizationChange('accentColor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={customization.fontSize}
                  onValueChange={(value) => handleCustomizationChange('fontSize', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div 
              ref={scheduleRef}
              className="border rounded-lg overflow-hidden"
              style={{
                backgroundColor: customization.backgroundColor,
                color: customization.textColor,
                fontSize: `${customization.fontSize}px`,
              }}
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100" style={{ backgroundColor: customization.accentColor }}>
                    <th className="p-2 border-b">Time</th>
                    {daysOfWeek.map((day) => (
                      <th key={day} className="p-2 border-b">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time}>
                      <td className="p-2 border-b border-r font-medium">{time}</td>
                      {daysOfWeek.map((day) => {
                        const scheduleItem = schedule.find(item => item.day === day && item.time === time)
                        return (
                          <td key={`${day}-${time}`} className="p-2 border-b border-r">
                            {scheduleItem ? (
                              <div className="p-2 rounded" style={{ backgroundColor: customization.accentColor }}>
                                <p className="font-medium">{scheduleItem.class.code}</p>
                                <p className="text-xs">{scheduleItem.class.room}</p>
                                <button
                                  onClick={() => removeFromSchedule(day, time)}
                                  className="text-xs mt-1"
                                  style={{ color: customization.backgroundColor }}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : null}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={exportSchedule}>
              <Download className="mr-2 h-4 w-4" />
              Export Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

