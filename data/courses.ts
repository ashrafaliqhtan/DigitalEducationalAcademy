export interface Instructor {
  id: string
  name: string
  avatar: string
  bio: string
  title: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  duration: number // in minutes
  videoUrl: string
  isPreview: boolean
}

export interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  price: number
  discountPrice?: number
  category: string
  level: string
  thumbnail: string
  duration: number // in hours
  lessonsCount: number
  instructors: Instructor[]
  rating: number
  ratingCount: number
  studentsCount: number
  updatedAt: string
  objectives: string[]
  requirements: string[]
  tags: string[]
  sections: Section[]
  featured?: boolean
  popular?: boolean
  new?: boolean
}

export const instructors: Instructor[] = [
  {
    id: "ins-1",
    name: "Dr. Ahmed Al-Farsi",
    avatar: "/placeholder.svg?height=400&width=400&text=Dr.+Ahmed",
    bio: "Professor of Computer Science with over 15 years of experience in web development and software engineering.",
    title: "Professor of Computer Science",
  },
  {
    id: "ins-2",
    name: "Dr. Fatima Al-Qasimi",
    avatar: "/placeholder.svg?height=400&width=400&text=Dr.+Fatima",
    bio: "Research specialist with a PhD in Academic Research Methodology from UAE University.",
    title: "Research Methodology Specialist",
  },
  {
    id: "ins-3",
    name: "Mohammad Al-Sulaiman",
    avatar: "/placeholder.svg?height=400&width=400&text=Mohammad",
    bio: "Senior UX Designer with 10+ years of experience working with Fortune 500 companies.",
    title: "Senior UX/UI Designer",
  },
  {
    id: "ins-4",
    name: "Dr. Nora Al-Mansouri",
    avatar: "/placeholder.svg?height=400&width=400&text=Dr.+Nora",
    bio: "Academic writing expert and published author with expertise in research paper writing and thesis development.",
    title: "Academic Writing Specialist",
  },
]

export const courses: Course[] = [
  {
    id: "course-1",
    slug: "web-development-fundamentals",
    title: "Web Development Fundamentals",
    description: "Learn the core concepts of HTML, CSS, and JavaScript to build modern websites.",
    longDescription:
      "This comprehensive course takes you from the very basics of web development to building fully functional websites. You'll start by learning HTML structure, move on to styling with CSS, and then add interactivity with JavaScript. By the end of this course, you'll have built several real-world projects and gained the skills needed to create responsive and attractive websites from scratch.",
    price: 99,
    discountPrice: 79,
    category: "programming",
    level: "beginner",
    thumbnail: "/placeholder.svg?height=400&width=700&text=Web+Development",
    duration: 24, // hours
    lessonsCount: 42,
    instructors: [instructors[0]],
    rating: 4.8,
    ratingCount: 1250,
    studentsCount: 5680,
    updatedAt: "2023-10-15",
    objectives: [
      "Understand HTML structure and semantic elements",
      "Create responsive layouts with CSS Flexbox and Grid",
      "Build interactive features with JavaScript",
      "Connect to APIs and handle data",
      "Deploy websites to production environments",
    ],
    requirements: [
      "Basic computer skills",
      "No prior programming experience required",
      "A computer with internet access",
    ],
    tags: ["html", "css", "javascript", "web", "frontend"],
    featured: true,
    popular: true,
    sections: [
      {
        id: "section-1-1",
        title: "Introduction to Web Development",
        lessons: [
          {
            id: "lesson-1-1-1",
            title: "Course Overview and Web Development Landscape",
            description: "An introduction to the course and overview of modern web development.",
            duration: 15,
            videoUrl: "https://example.com/videos/web-dev-intro",
            isPreview: true,
          },
          {
            id: "lesson-1-1-2",
            title: "Setting Up Your Development Environment",
            description: "Installing and configuring the tools you'll need for web development.",
            duration: 25,
            videoUrl: "https://example.com/videos/dev-environment",
            isPreview: false,
          },
          {
            id: "lesson-1-1-3",
            title: "Understanding How the Web Works",
            description: "Learn about HTTP, servers, clients, and how websites are delivered to users.",
            duration: 30,
            videoUrl: "https://example.com/videos/how-web-works",
            isPreview: false,
          },
        ],
      },
      {
        id: "section-1-2",
        title: "HTML Fundamentals",
        lessons: [
          {
            id: "lesson-1-2-1",
            title: "HTML Document Structure",
            description: "Learn about HTML tags, elements, and document structure.",
            duration: 35,
            videoUrl: "https://example.com/videos/html-structure",
            isPreview: true,
          },
          {
            id: "lesson-1-2-2",
            title: "Working with Text and Lists",
            description: "Format text, create headings, paragraphs, and different types of lists.",
            duration: 28,
            videoUrl: "https://example.com/videos/html-text-lists",
            isPreview: false,
          },
          {
            id: "lesson-1-2-3",
            title: "Adding Links and Images",
            description: "Create hyperlinks, add images, and understand file paths.",
            duration: 32,
            videoUrl: "https://example.com/videos/html-links-images",
            isPreview: false,
          },
        ],
      },
      {
        id: "section-1-3",
        title: "CSS Styling",
        lessons: [
          {
            id: "lesson-1-3-1",
            title: "Introduction to CSS",
            description: "Learn CSS syntax, selectors, and how to apply styles to HTML elements.",
            duration: 40,
            videoUrl: "https://example.com/videos/css-intro",
            isPreview: false,
          },
          {
            id: "lesson-1-3-2",
            title: "Working with Colors and Fonts",
            description: "Apply colors, customize typography, and import web fonts.",
            duration: 30,
            videoUrl: "https://example.com/videos/css-colors-fonts",
            isPreview: false,
          },
          {
            id: "lesson-1-3-3",
            title: "Box Model and Layout",
            description: "Understand the CSS box model, margins, padding, and borders.",
            duration: 45,
            videoUrl: "https://example.com/videos/css-box-model",
            isPreview: false,
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    slug: "academic-research-methodology",
    title: "Academic Research Methodology",
    description: "Master the techniques and methodologies for conducting effective academic research.",
    longDescription:
      "This course covers all aspects of academic research from formulating research questions to writing and publishing your findings. You'll learn various research methodologies, data collection techniques, analysis methods, and how to write compelling research papers. The course includes practical exercises and real-world examples from different academic disciplines.",
    price: 129,
    category: "research",
    level: "intermediate",
    thumbnail: "/placeholder.svg?height=400&width=700&text=Research+Methodology",
    duration: 20, // hours
    lessonsCount: 35,
    instructors: [instructors[1]],
    rating: 4.7,
    ratingCount: 850,
    studentsCount: 3240,
    updatedAt: "2023-11-05",
    objectives: [
      "Formulate effective research questions and hypotheses",
      "Design research studies with appropriate methodologies",
      "Collect and analyze data using various techniques",
      "Write and structure academic papers",
      "Navigate the publication process",
    ],
    requirements: [
      "Basic understanding of academic writing",
      "No prior research experience required",
      "Access to academic databases (recommendations provided)",
    ],
    tags: ["research", "academic", "methodology", "writing", "analysis"],
    featured: true,
    sections: [
      {
        id: "section-2-1",
        title: "Introduction to Academic Research",
        lessons: [
          {
            id: "lesson-2-1-1",
            title: "The Nature and Importance of Research",
            description: "Understand what research is and why it's important in academics.",
            duration: 25,
            videoUrl: "https://example.com/videos/research-intro",
            isPreview: true,
          },
          {
            id: "lesson-2-1-2",
            title: "Types of Research and Research Paradigms",
            description: "Explore different types of research and philosophical approaches.",
            duration: 35,
            videoUrl: "https://example.com/videos/research-types",
            isPreview: false,
          },
          {
            id: "lesson-2-1-3",
            title: "Developing Research Questions",
            description: "Learn how to formulate effective research questions and hypotheses.",
            duration: 30,
            videoUrl: "https://example.com/videos/research-questions",
            isPreview: false,
          },
        ],
      },
      {
        id: "section-2-2",
        title: "Research Design",
        lessons: [
          {
            id: "lesson-2-2-1",
            title: "Quantitative Research Methods",
            description: "Understand experimental, survey, and correlational research designs.",
            duration: 45,
            videoUrl: "https://example.com/videos/quantitative-methods",
            isPreview: true,
          },
          {
            id: "lesson-2-2-2",
            title: "Qualitative Research Methods",
            description: "Learn about case studies, ethnography, and grounded theory approaches.",
            duration: 40,
            videoUrl: "https://example.com/videos/qualitative-methods",
            isPreview: false,
          },
          {
            id: "lesson-2-2-3",
            title: "Mixed Methods Research",
            description: "Combine quantitative and qualitative approaches effectively.",
            duration: 35,
            videoUrl: "https://example.com/videos/mixed-methods",
            isPreview: false,
          },
        ],
      },
      {
        id: "section-2-3",
        title: "Data Collection and Analysis",
        lessons: [
          {
            id: "lesson-2-3-1",
            title: "Sampling Techniques",
            description: "Learn about different sampling methods and how to select research participants.",
            duration: 30,
            videoUrl: "https://example.com/videos/sampling",
            isPreview: false,
          },
          {
            id: "lesson-2-3-2",
            title: "Surveys and Questionnaires",
            description: "Design effective surveys and questionnaires for research.",
            duration: 35,
            videoUrl: "https://example.com/videos/surveys",
            isPreview: false,
          },
          {
            id: "lesson-2-3-3",
            title: "Statistical Analysis Fundamentals",
            description: "Introduction to basic statistical tests and data interpretation.",
            duration: 50,
            videoUrl: "https://example.com/videos/statistics",
            isPreview: false,
          },
        ],
      },
    ],
  },
  {
    id: "course-3",
    slug: "advanced-powerpoint-presentations",
    title: "Advanced PowerPoint Presentations",
    description: "Create professional, engaging presentations that captivate your audience.",
    longDescription:
      "Take your presentation skills to the next level with this comprehensive course on creating professional PowerPoint presentations. You'll learn advanced design techniques, animation principles, data visualization methods, and presentation strategies that will help you deliver compelling content. From basic slides to complex interactive presentations, you'll master all aspects of PowerPoint.",
    price: 79,
    discountPrice: 59,
    category: "design",
    level: "all-levels",
    thumbnail: "/placeholder.svg?height=400&width=700&text=PowerPoint+Presentations",
    duration: 15, // hours
    lessonsCount: 28,
    instructors: [instructors[2]],
    rating: 4.9,
    ratingCount: 1500,
    studentsCount: 6800,
    updatedAt: "2023-12-01",
    objectives: [
      "Design visually appealing slides with professional layouts",
      "Create engaging animations and transitions",
      "Develop effective data visualizations and infographics",
      "Utilize advanced PowerPoint features",
      "Deliver impactful presentations that engage your audience",
    ],
    requirements: [
      "Basic familiarity with Microsoft PowerPoint",
      "Microsoft PowerPoint 2016 or later (including Office 365)",
      "No design experience required",
    ],
    tags: ["powerpoint", "presentations", "design", "public speaking", "business"],
    new: true,
    popular: true,
    sections: [
      {
        id: "section-3-1",
        title: "Presentation Design Principles",
        lessons: [
          {
            id: "lesson-3-1-1",
            title: "The Elements of Effective Presentations",
            description: "Learn what makes presentations effective and engaging.",
            duration: 20,
            videoUrl: "https://example.com/videos/presentation-elements",
            isPreview: true,
          },
          {
            id: "lesson-3-1-2",
            title: "Visual Design Fundamentals",
            description: "Understand color theory, typography, and layout principles for presentations.",
            duration: 35,
            videoUrl: "https://example.com/videos/visual-design",
            isPreview: false,
          },
          {
            id: "lesson-3-1-3",
            title: "Creating Professional Slide Templates",
            description: "Design custom templates and master slides for consistent presentations.",
            duration: 30,
            videoUrl: "https://example.com/videos/slide-templates",
            isPreview: false,
          },
        ],
      },
      {
        id: "section-3-2",
        title: "Advanced PowerPoint Techniques",
        lessons: [
          {
            id: "lesson-3-2-1",
            title: "Working with Smart Graphics and Diagrams",
            description: "Create and customize SmartArt graphics and complex diagrams.",
            duration: 40,
            videoUrl: "https://example.com/videos/smart-graphics",
            isPreview: true,
          },
          {
            id: "lesson-3-2-2",
            title: "Advanced Animation Techniques",
            description: "Create complex animations and motion paths for engaging presentations.",
            duration: 45,
            videoUrl: "https://example.com/videos/advanced-animation",
            isPreview: false,
          },
          {
            id: "lesson-3-2-3",
            title: "Interactive Elements and Hyperlinks",
            description: "Add interactive elements and navigation to your presentations.",
            duration: 35,
            videoUrl: "https://example.com/videos/interactive-elements",
            isPreview: false,
          },
        ],
      },
      {
        id: "section-3-3",
        title: "Data Visualization",
        lessons: [
          {
            id: "lesson-3-3-1",
            title: "Creating Effective Charts and Graphs",
            description: "Design clear and impactful data visualizations for your presentations.",
            duration: 30,
            videoUrl: "https://example.com/videos/charts-graphs",
            isPreview: false,
          },
          {
            id: "lesson-3-3-2",
            title: "Custom Infographics",
            description: "Create custom infographics to present complex information visually.",
            duration: 40,
            videoUrl: "https://example.com/videos/infographics",
            isPreview: false,
          },
          {
            id: "lesson-3-3-3",
            title: "Working with External Data",
            description: "Link and update charts from Excel and other data sources.",
            duration: 35,
            videoUrl: "https://example.com/videos/external-data",
            isPreview: false,
          },
        ],
      },
    ],
  },
  {
    id: "course-4",
    slug: "academic-writing-essentials",
    title: "Academic Writing Essentials",
    description: "Master the art of academic writing for research papers, essays, and dissertations.",
    longDescription:
      "This comprehensive course covers all aspects of academic writing from planning and research to drafting and revision. Learn how to write clear, concise, and compelling academic papers that meet scholarly standards. The course covers various citation styles, structuring arguments, literature reviews, and techniques for overcoming writer's block and editing effectively.",
    price: 89,
    category: "writing",
    level: "beginner",
    thumbnail: "/placeholder.svg?height=400&width=700&text=Academic+Writing",
    duration: 18, // hours
    lessonsCount: 32,
    instructors: [instructors[3]],
    rating: 4.6,
    ratingCount: 920,
    studentsCount: 4100,
    updatedAt: "2023-10-25",
    objectives: [
      "Structure academic papers effectively",
      "Develop clear and compelling thesis statements",
      "Use proper citation and referencing styles",
      "Write literature reviews and research methodologies",
      "Edit and revise academic papers professionally",
    ],
    requirements: [
      "Basic writing skills",
      "Interest in academic writing",
      "No prior academic writing experience required",
    ],
    tags: ["writing", "academic", "research", "essays", "papers"],
    new: true,
    sections: [
      {
        id: "section-4-1",
        title: "Foundations of Academic Writing",
        lessons: [
          {
            id: "lesson-4-1-1",
            title: "Understanding Academic Writing",
            description: "Learn what makes academic writing different from other forms of writing.",
            duration: 25,
            videoUrl: "https://example.com/videos/academic-writing-intro",
            isPreview: true,
          },
          {
            id: "lesson-4-1-2",
            title: "Planning Your Academic Paper",
            description: "Strategies for planning and organizing your academic writing projects.",
            duration: 30,
            videoUrl: "https://example.com/videos/planning-papers",
            isPreview: false,
          },
          {
            id: "lesson-4-1-3",
            title: "Developing Research Questions and Thesis Statements",
            description: "Learn to craft focused research questions and effective thesis statements.",
            duration: 35,
            videoUrl: "https://example.com/videos/thesis-statements",
            isPreview: false,
          },
        ],
      },
      {
        id: "section-4-2",
        title: "Structure and Organization",
        lessons: [
          {
            id: "lesson-4-2-1",
            title: "Academic Paper Structures",
            description: "Understanding different paper structures for various academic purposes.",
            duration: 40,
            videoUrl: "https://example.com/videos/paper-structures",
            isPreview: true,
          },
          {
            id: "lesson-4-2-2",
            title: "Writing Effective Introductions and Conclusions",
            description: "Techniques for creating engaging introductions and conclusive endings.",
            duration: 35,
            videoUrl: "https://example.com/videos/intros-conclusions",
            isPreview: false,
          },
          {
            id: "lesson-4-2-3",
            title: "Paragraph Development and Coherence",
            description: "Creating well-structured paragraphs and maintaining coherence throughout your paper.",
            duration: 30,
            videoUrl: "https://example.com/videos/paragraphs",
            isPreview: false,
          },
        ],
      },
      {
        id: "section-4-3",
        title: "Citation and Referencing",
        lessons: [
          {
            id: "lesson-4-3-1",
            title: "Understanding Citation Styles",
            description: "Overview of major citation styles and when to use each one.",
            duration: 25,
            videoUrl: "https://example.com/videos/citation-styles",
            isPreview: false,
          },
          {
            id: "lesson-4-3-2",
            title: "APA Style in Depth",
            description: "Comprehensive guide to using APA style for citations and references.",
            duration: 45,
            videoUrl: "https://example.com/videos/apa-style",
            isPreview: false,
          },
          {
            id: "lesson-4-3-3",
            title: "Avoiding Plagiarism",
            description: "Understanding plagiarism and strategies to ensure academic integrity.",
            duration: 30,
            videoUrl: "https://example.com/videos/avoiding-plagiarism",
            isPreview: false,
          },
        ],
      },
    ],
  },
]

export const getCourseBySlug = (slug: string): Course | undefined => {
  return courses.find((course) => course.slug === slug)
}

export const getCourseById = (id: string): Course | undefined => {
  return courses.find((course) => course.id === id)
}

export const getRelatedCourses = (courseId: string, limit = 3): Course[] => {
  const course = getCourseById(courseId)
  if (!course) return []

  // Get courses in the same category, excluding the current course
  const sameCategory = courses.filter((c) => c.category === course.category && c.id !== courseId)

  // If we have enough courses in the same category, return those
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  // Otherwise, add courses with similar tags
  const coursesByTags = courses.filter((c) => {
    if (c.id === courseId || sameCategory.includes(c)) return false

    // Check if there are any common tags
    return c.tags.some((tag) => course.tags.includes(tag))
  })

  return [...sameCategory, ...coursesByTags].slice(0, limit)
}

export const getPopularCourses = (limit = 4): Course[] => {
  return courses
    .filter((course) => course.popular)
    .sort((a, b) => b.studentsCount - a.studentsCount)
    .slice(0, limit)
}

export const getFeaturedCourses = (limit = 4): Course[] => {
  return courses
    .filter((course) => course.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export const getNewCourses = (limit = 4): Course[] => {
  return courses
    .filter((course) => course.new)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

export const getCoursesByCategory = (category: string, limit?: number): Course[] => {
  const filteredCourses = courses.filter((course) => course.category === category)
  return limit ? filteredCourses.slice(0, limit) : filteredCourses
}

export const searchCourses = (query: string): Course[] => {
  const searchTerms = query.toLowerCase().split(" ")

  return courses.filter((course) => {
    const searchString =
      `${course.title} ${course.description} ${course.category} ${course.tags.join(" ")}`.toLowerCase()

    // Check if any of the search terms are in the searchString
    return searchTerms.some((term) => searchString.includes(term))
  })
}

export const getCategories = () => {
  return [
    { id: "programming", name: "Programming" },
    { id: "research", name: "Research" },
    { id: "design", name: "Design" },
    { id: "writing", name: "Academic Writing" },
  ]
}

export const getLevels = () => {
  return [
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
    { id: "all-levels", name: "All Levels" },
  ]
}
