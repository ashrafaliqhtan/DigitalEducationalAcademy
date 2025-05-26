import { Suspense } from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnrolledCoursesList from "@/components/dashboard/enrolled-courses-list"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton"
import { getEnrolledCourses } from "@/app/actions/enrollment-actions"

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in?redirect=/dashboard")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get enrolled courses
  const { courses } = await getEnrolledCourses()

  // Calculate overall progress
  const totalCourses = courses?.length || 0
  const completedCourses = courses?.filter((course) => course.status === "completed").length || 0
  const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Get initials for avatar
  const getInitials = (name: string): string => {
    if (!name) return "U"

    // For email addresses, use the first letter
    if (name.includes("@")) {
      return name.charAt(0).toUpperCase()
    }

    // For names, use first letter of each word (up to 2)
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || user.email?.split("@")[0] || "Student"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="stats">Learning Stats</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Suspense fallback={<DashboardSkeleton />}>
            <EnrolledCoursesList courses={courses} />
          </Suspense>
        </TabsContent>

        <TabsContent value="stats">
          <DashboardStats courses={courses} />
        </TabsContent>

        <TabsContent value="certificates">
          <div className="bg-muted/40 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground mb-6">Complete a course to earn your first certificate</p>
            <div className="max-w-md mx-auto border border-dashed rounded-lg p-8 bg-background">
              <div className="aspect-[1.4/1] relative bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Certificate Preview</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
