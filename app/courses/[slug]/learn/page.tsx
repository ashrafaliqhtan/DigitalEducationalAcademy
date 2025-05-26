import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CourseSidebar from "@/components/courses/course-sidebar"
import VideoPlayer from "@/components/courses/video-player"
import QuizComponent from "@/components/courses/quiz-component"
import AssignmentComponent from "@/components/courses/assignment-component"
import { getCourseBySlug } from "@/services/course-service"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function CourseLearnPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { lesson?: string }
}) {
  const course = await getCourseBySlug(params.slug)

  if (!course) {
    notFound()
  }

  // Get current user
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to sign in if not authenticated
    redirect(`/sign-in?redirect=/courses/${params.slug}/learn`)
  }

  // Check if user is enrolled
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle()

  // If not enrolled and not a preview lesson, redirect to course page
  const lessonId = searchParams.lesson

  // Find the current lesson
  let currentLesson: any = null
  let currentSectionIndex = 0
  let currentLessonIndex = 0

  // Flatten all sections and lessons
  const allSections = course.sections || []

  // Find the current lesson and its indices
  for (let i = 0; i < allSections.length; i++) {
    const section = allSections[i]
    const lessons = section.lessons || []

    for (let j = 0; j < lessons.length; j++) {
      if (lessons[j].id === lessonId) {
        currentLesson = lessons[j]
        currentSectionIndex = i
        currentLessonIndex = j
        break
      }
    }

    if (currentLesson) break
  }

  // If no lesson specified or lesson not found, use the first lesson
  if (!currentLesson && allSections.length > 0 && allSections[0].lessons?.length > 0) {
    currentLesson = allSections[0].lessons[0]
    currentSectionIndex = 0
    currentLessonIndex = 0
  }

  if (!currentLesson) {
    // No lessons available
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">No Lessons Available</h1>
        <p className="mb-6">This course doesn't have any lessons yet.</p>
        <Button asChild>
          <a href={`/courses/${params.slug}`}>Back to Course</a>
        </Button>
      </div>
    )
  }

  // If not enrolled and not a preview lesson, redirect to course page
  if (!enrollment && !currentLesson.is_preview) {
    redirect(`/courses/${params.slug}`)
  }

  // Get next and previous lessons
  let nextLesson: any = null
  let prevLesson: any = null

  // Find next lesson
  if (currentLessonIndex < allSections[currentSectionIndex].lessons.length - 1) {
    // Next lesson in same section
    nextLesson = allSections[currentSectionIndex].lessons[currentLessonIndex + 1]
  } else if (currentSectionIndex < allSections.length - 1) {
    // First lesson in next section
    const nextSection = allSections[currentSectionIndex + 1]
    if (nextSection.lessons?.length > 0) {
      nextLesson = nextSection.lessons[0]
    }
  }

  // Find previous lesson
  if (currentLessonIndex > 0) {
    // Previous lesson in same section
    prevLesson = allSections[currentSectionIndex].lessons[currentLessonIndex - 1]
  } else if (currentSectionIndex > 0) {
    // Last lesson in previous section
    const prevSection = allSections[currentSectionIndex - 1]
    if (prevSection.lessons?.length > 0) {
      prevLesson = prevSection.lessons[prevSection.lessons.length - 1]
    }
  }

  // Update last accessed
  if (enrollment) {
    await supabase
      .from("enrollments")
      .update({
        last_accessed: new Date().toISOString(),
        current_lesson_id: currentLesson.id,
      })
      .eq("id", enrollment.id)
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <CourseSidebar sections={allSections} currentLessonId={currentLesson.id} courseSlug={params.slug} />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl py-6 space-y-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
              <p className="text-muted-foreground">{currentLesson.description}</p>
            </div>

            {/* Video Player */}
            {currentLesson.video_url && (
              <div className="aspect-video overflow-hidden rounded-lg border bg-black">
                <VideoPlayer
                  videoUrl={currentLesson.video_url}
                  lessonId={currentLesson.id}
                  userId={user.id}
                  progress={0}
                />
              </div>
            )}

            {/* Lesson Content */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="pt-6">
                <div className="prose max-w-none">
                  <p>{currentLesson.description || "No additional content available for this lesson."}</p>
                </div>
              </TabsContent>

              <TabsContent value="discussion" className="pt-6">
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">Discussion feature coming soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="pt-6">
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">No additional resources available for this lesson.</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Quiz or Assignment */}
            {currentLesson.type === "quiz" && (
              <Suspense fallback={<div>Loading quiz...</div>}>
                <QuizComponent lessonId={currentLesson.id} userId={user.id} />
              </Suspense>
            )}

            {currentLesson.type === "assignment" && (
              <Suspense fallback={<div>Loading assignment...</div>}>
                <AssignmentComponent lessonId={currentLesson.id} userId={user.id} />
              </Suspense>
            )}

            <Separator />

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {prevLesson ? (
                <Button variant="outline" asChild>
                  <a href={`/courses/${params.slug}/learn?lesson=${prevLesson.id}`}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </a>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Lesson
                </Button>
              )}

              {nextLesson ? (
                <Button asChild>
                  <a href={`/courses/${params.slug}/learn?lesson=${nextLesson.id}`}>
                    Next Lesson
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button asChild>
                  <a href={`/courses/${params.slug}`}>
                    Complete Course
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
