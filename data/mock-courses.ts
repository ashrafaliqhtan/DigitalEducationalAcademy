import type { CourseWithDetails } from "@/contexts/enrollment-context"

// Mock categories
export const mockCategories = [
  { id: "programming", name: "Programming" },
  { id: "design", name: "Design" },
  { id: "business", name: "Business" },
  { id: "marketing", name: "Marketing" },
  { id: "personal-development", name: "Personal Development" },
]

// Mock instructors
export const mockInstructors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    bio: "PhD in Computer Science with 10+ years of teaching experience",
    avatar_url: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    bio: "Award-winning educator specializing in web development",
    avatar_url: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    bio: "UX/UI design expert with experience at major tech companies",
    avatar_url: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "David Kim",
    bio: "Entrepreneur and business strategy consultant",
    avatar_url: "/placeholder.svg?height=200&width=200",
  },
]

// Mock courses
export const mockCourses: CourseWithDetails[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    slug: "intro-web-development",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    price: 49.99,
    is_featured: true,
    is_popular: true,
    is_new: true,
    level: "beginner",
    duration: "8 weeks",
    total_lessons: 24,
    total_students: 1250,
    category_id: "programming",
    created_at: new Date(2023, 0, 15).toISOString(),
    updated_at: new Date(2023, 1, 20).toISOString(),
    category: mockCategories.find((c) => c.id === "programming"),
    instructors: [mockInstructors[0], mockInstructors[1]],
    sections: [
      {
        id: "s1",
        title: "Getting Started with HTML",
        course_id: "1",
        order: 1,
        lessons: [
          { id: "l1", title: "Introduction to HTML", section_id: "s1", order: 1, duration: "15:00" },
          { id: "l2", title: "HTML Elements and Tags", section_id: "s1", order: 2, duration: "20:00" },
          { id: "l3", title: "Creating Your First Webpage", section_id: "s1", order: 3, duration: "25:00" },
        ],
      },
      {
        id: "s2",
        title: "CSS Fundamentals",
        course_id: "1",
        order: 2,
        lessons: [
          { id: "l4", title: "Introduction to CSS", section_id: "s2", order: 1, duration: "18:00" },
          { id: "l5", title: "Selectors and Properties", section_id: "s2", order: 2, duration: "22:00" },
          { id: "l6", title: "Box Model and Layout", section_id: "s2", order: 3, duration: "28:00" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Advanced JavaScript Programming",
    slug: "advanced-javascript",
    description: "Take your JavaScript skills to the next level with advanced concepts and modern frameworks.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    price: 79.99,
    is_featured: true,
    is_popular: true,
    is_new: false,
    level: "advanced",
    duration: "10 weeks",
    total_lessons: 30,
    total_students: 850,
    category_id: "programming",
    created_at: new Date(2023, 2, 10).toISOString(),
    updated_at: new Date(2023, 3, 5).toISOString(),
    category: mockCategories.find((c) => c.id === "programming"),
    instructors: [mockInstructors[1]],
    sections: [
      {
        id: "s3",
        title: "Advanced JavaScript Concepts",
        course_id: "2",
        order: 1,
        lessons: [
          { id: "l7", title: "Closures and Scope", section_id: "s3", order: 1, duration: "22:00" },
          { id: "l8", title: "Prototypes and Inheritance", section_id: "s3", order: 2, duration: "25:00" },
          { id: "l9", title: "Asynchronous JavaScript", section_id: "s3", order: 3, duration: "30:00" },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    slug: "ui-ux-design",
    description: "Learn the fundamentals of user interface and user experience design.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    price: 59.99,
    is_featured: true,
    is_popular: false,
    is_new: true,
    level: "intermediate",
    duration: "6 weeks",
    total_lessons: 18,
    total_students: 720,
    category_id: "design",
    created_at: new Date(2023, 4, 20).toISOString(),
    updated_at: new Date(2023, 5, 15).toISOString(),
    category: mockCategories.find((c) => c.id === "design"),
    instructors: [mockInstructors[2]],
    sections: [
      {
        id: "s4",
        title: "Design Fundamentals",
        course_id: "3",
        order: 1,
        lessons: [
          { id: "l10", title: "Introduction to UI/UX", section_id: "s4", order: 1, duration: "20:00" },
          { id: "l11", title: "Color Theory", section_id: "s4", order: 2, duration: "18:00" },
          { id: "l12", title: "Typography Basics", section_id: "s4", order: 3, duration: "22:00" },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Business Strategy for Startups",
    slug: "business-strategy",
    description: "Learn how to develop effective business strategies for your startup.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    price: 69.99,
    is_featured: false,
    is_popular: true,
    is_new: false,
    level: "all-levels",
    duration: "8 weeks",
    total_lessons: 24,
    total_students: 950,
    category_id: "business",
    created_at: new Date(2023, 6, 5).toISOString(),
    updated_at: new Date(2023, 7, 10).toISOString(),
    category: mockCategories.find((c) => c.id === "business"),
    instructors: [mockInstructors[3]],
    sections: [
      {
        id: "s5",
        title: "Market Analysis",
        course_id: "4",
        order: 1,
        lessons: [
          { id: "l13", title: "Understanding Your Market", section_id: "s5", order: 1, duration: "25:00" },
          { id: "l14", title: "Competitor Analysis", section_id: "s5", order: 2, duration: "28:00" },
          { id: "l15", title: "Market Positioning", section_id: "s5", order: 3, duration: "24:00" },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Digital Marketing Fundamentals",
    slug: "digital-marketing",
    description: "Master the basics of digital marketing including SEO, social media, and content marketing.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    price: 54.99,
    is_featured: false,
    is_popular: true,
    is_new: true,
    level: "beginner",
    duration: "6 weeks",
    total_lessons: 18,
    total_students: 1100,
    category_id: "marketing",
    created_at: new Date(2023, 8, 15).toISOString(),
    updated_at: new Date(2023, 9, 20).toISOString(),
    category: mockCategories.find((c) => c.id === "marketing"),
    instructors: [mockInstructors[3]],
    sections: [
      {
        id: "s6",
        title: "SEO Fundamentals",
        course_id: "5",
        order: 1,
        lessons: [
          { id: "l16", title: "Introduction to SEO", section_id: "s6", order: 1, duration: "20:00" },
          { id: "l17", title: "On-Page Optimization", section_id: "s6", order: 2, duration: "22:00" },
          { id: "l18", title: "Off-Page Optimization", section_id: "s6", order: 3, duration: "25:00" },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Mindfulness and Productivity",
    slug: "mindfulness-productivity",
    description: "Learn techniques to improve focus, reduce stress, and boost productivity.",
    thumbnail: "/placeholder.svg?height=400&width=600",
    price: 39.99,
    is_featured: true,
    is_popular: false,
    is_new: false,
    level: "all-levels",
    duration: "4 weeks",
    total_lessons: 12,
    total_students: 1500,
    category_id: "personal-development",
    created_at: new Date(2023, 10, 10).toISOString(),
    updated_at: new Date(2023, 11, 5).toISOString(),
    category: mockCategories.find((c) => c.id === "personal-development"),
    instructors: [mockInstructors[2]],
    sections: [
      {
        id: "s7",
        title: "Introduction to Mindfulness",
        course_id: "6",
        order: 1,
        lessons: [
          { id: "l19", title: "What is Mindfulness?", section_id: "s7", order: 1, duration: "15:00" },
          { id: "l20", title: "Benefits of Mindfulness", section_id: "s7", order: 2, duration: "18:00" },
          { id: "l21", title: "Basic Mindfulness Practices", section_id: "s7", order: 3, duration: "20:00" },
        ],
      },
    ],
  },
]

// Generate more courses for a robust dataset
export const generateMoreCourses = (count: number): CourseWithDetails[] => {
  const additionalCourses: CourseWithDetails[] = []

  for (let i = 0; i < count; i++) {
    const id = `${7 + i}`
    const categoryIndex = i % mockCategories.length
    const instructorIndex = i % mockInstructors.length

    additionalCourses.push({
      id,
      title: `Course ${id}: ${mockCategories[categoryIndex].name} Essentials`,
      slug: `course-${id}-${mockCategories[categoryIndex].id}-essentials`,
      description: `A comprehensive course on ${mockCategories[categoryIndex].name.toLowerCase()} fundamentals and advanced techniques.`,
      thumbnail: `/placeholder.svg?height=400&width=600&text=Course${id}`,
      price: 49.99 + i * 5,
      is_featured: i % 3 === 0,
      is_popular: i % 4 === 0,
      is_new: i % 5 === 0,
      level: i % 3 === 0 ? "beginner" : i % 3 === 1 ? "intermediate" : "advanced",
      duration: `${4 + (i % 8)} weeks`,
      total_lessons: 12 + (i % 20),
      total_students: 500 + i * 50,
      category_id: mockCategories[categoryIndex].id,
      created_at: new Date(2023, i % 12, 1 + (i % 28)).toISOString(),
      updated_at: new Date(2023, (i + 1) % 12, 1 + (i % 28)).toISOString(),
      category: mockCategories[categoryIndex],
      instructors: [mockInstructors[instructorIndex]],
      sections: [
        {
          id: `s${8 + i}`,
          title: `${mockCategories[categoryIndex].name} Fundamentals`,
          course_id: id,
          order: 1,
          lessons: [
            {
              id: `l${22 + i * 3}`,
              title: `Introduction to ${mockCategories[categoryIndex].name}`,
              section_id: `s${8 + i}`,
              order: 1,
              duration: `${15 + (i % 10)}:00`,
            },
            {
              id: `l${23 + i * 3}`,
              title: `${mockCategories[categoryIndex].name} Principles`,
              section_id: `s${8 + i}`,
              order: 2,
              duration: `${18 + (i % 12)}:00`,
            },
            {
              id: `l${24 + i * 3}`,
              title: `Advanced ${mockCategories[categoryIndex].name} Techniques`,
              section_id: `s${8 + i}`,
              order: 3,
              duration: `${20 + (i % 15)}:00`,
            },
          ],
        },
      ],
    })
  }

  return additionalCourses
}

// Add more courses to the mock data
export const allMockCourses = [...mockCourses, ...generateMoreCourses(14)]

// Filter functions to match the API
export const getMockCourses = (options?: {
  limit?: number
  category?: string
  level?: string
  featured?: boolean
  popular?: boolean
  isNew?: boolean
  search?: string
}) => {
  let filteredCourses = [...allMockCourses]

  if (options?.category) {
    filteredCourses = filteredCourses.filter((course) => course.category_id === options.category)
  }

  if (options?.level) {
    filteredCourses = filteredCourses.filter((course) => course.level === options.level)
  }

  if (options?.featured) {
    filteredCourses = filteredCourses.filter((course) => course.is_featured)
  }

  if (options?.popular) {
    filteredCourses = filteredCourses.filter((course) => course.is_popular)
  }

  if (options?.isNew) {
    filteredCourses = filteredCourses.filter((course) => course.is_new)
  }

  if (options?.search) {
    const searchLower = options.search.toLowerCase()
    filteredCourses = filteredCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchLower) || course.description.toLowerCase().includes(searchLower),
    )
  }

  // Sort by created_at descending
  filteredCourses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  if (options?.limit) {
    filteredCourses = filteredCourses.slice(0, options.limit)
  }

  return filteredCourses
}

export const getMockCourseBySlug = (slug: string) => {
  return allMockCourses.find((course) => course.slug === slug) || null
}

export const getMockRelatedCourses = (courseId: string, limit = 3) => {
  const course = allMockCourses.find((c) => c.id === courseId)
  if (!course) return []

  return allMockCourses.filter((c) => c.category_id === course.category_id && c.id !== courseId).slice(0, limit)
}
