"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { FileUp, CheckCircle2, Clock } from "lucide-react"

interface AssignmentComponentProps {
  lessonId: string
  userId: string
}

export default function AssignmentComponent({ lessonId, userId }: AssignmentComponentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  // Submit assignment
  const handleSubmit = async () => {
    if (!content && !file) {
      toast({
        title: "Submission Required",
        description: "Please provide either text content or upload a file",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Update lesson progress
      await supabase.from("lesson_progress").upsert({
        enrollment_id: userId,
        lesson_id: lessonId,
        completed: true,
        last_watched: new Date().toISOString(),
      })

      toast({
        title: "Assignment Submitted",
        description: "Your assignment has been submitted successfully",
      })

      setSubmitted(true)
      router.refresh()
    } catch (error) {
      console.error("Error submitting assignment:", error)
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Assignment Submitted
          </CardTitle>
          <CardDescription>Your assignment has been submitted successfully</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Submission Complete</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Submitted on{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {content && (
              <div className="border rounded-md p-3 bg-muted/50">
                <p className="whitespace-pre-wrap">{content}</p>
              </div>
            )}

            {file && (
              <div className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                <span className="text-primary">{file.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment</CardTitle>
        <CardDescription>Complete this assignment to finish the lesson</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Due: No due date</span>
          </div>

          <div className="prose max-w-none">
            <h3>Instructions</h3>
            <p>
              Write a short essay (300-500 words) explaining what you've learned in this lesson and how you plan to
              apply it. You can also upload a file if needed.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Your Answer</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your answer here..."
                rows={8}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="file">Upload File (Optional)</Label>
              <Input id="file" type="file" onChange={handleFileChange} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Accepted file types: PDF, DOCX, TXT, JPG, PNG (max 10MB)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={submitting || (!content && !file)} className="ml-auto">
          {submitting ? "Submitting..." : "Submit Assignment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
