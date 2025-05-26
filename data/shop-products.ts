export interface Product {
  id: string
  name: string
  description: string
  price: number
  discountPrice?: number
  category: string
  tags: string[]
  rating: number
  reviewCount: number
  images: string[]
  features: string[]
  fileFormat: string[]
  compatibleWith: string[]
  downloadSize: string
  createdAt: string
  updatedAt: string
  bestSeller?: boolean
  new?: boolean
  image?: string
  inStock?: boolean
  reviews?: number
}

export const products: Product[] = [
  {
    id: "cv-template-modern",
    name: "Modern CV Template",
    description:
      "A clean, modern CV template perfect for professionals in any industry. This template includes matching cover letter and references page.",
    price: 29,
    discountPrice: 19,
    category: "cv-templates",
    tags: ["cv", "resume", "professional", "modern"],
    rating: 4.8,
    reviewCount: 124,
    images: [
      "/placeholder.svg?height=600&width=800&text=Modern+CV+Template",
      "/placeholder.svg?height=600&width=800&text=Modern+CV+Preview+1",
      "/placeholder.svg?height=600&width=800&text=Modern+CV+Preview+2",
    ],
    features: [
      "Clean, modern design",
      "Matching cover letter",
      "References page",
      "Easy to customize",
      "ATS-friendly format",
      "Multiple color schemes",
    ],
    fileFormat: ["DOCX", "PDF", "INDD"],
    compatibleWith: ["Microsoft Word", "Adobe InDesign", "Google Docs"],
    downloadSize: "15MB",
    createdAt: "2023-01-15",
    updatedAt: "2023-06-20",
    bestSeller: true,
  },
  {
    id: "academic-research-template",
    name: "Academic Research Paper Template",
    description:
      "A professionally formatted template for academic research papers, theses, and dissertations. Includes proper citation formats and section layouts.",
    price: 24,
    category: "academic",
    tags: ["academic", "research", "paper", "thesis"],
    rating: 4.7,
    reviewCount: 89,
    images: [
      "/placeholder.svg?height=600&width=800&text=Academic+Research+Template",
      "/placeholder.svg?height=600&width=800&text=Academic+Template+Preview+1",
      "/placeholder.svg?height=600&width=800&text=Academic+Template+Preview+2",
    ],
    features: [
      "Proper academic formatting",
      "Citation guides included",
      "Section templates",
      "Table and figure formatting",
      "Multiple citation styles (APA, MLA, Chicago)",
      "Bibliography template",
    ],
    fileFormat: ["DOCX", "PDF", "LaTeX"],
    compatibleWith: ["Microsoft Word", "LaTeX editors", "Google Docs"],
    downloadSize: "12MB",
    createdAt: "2023-02-10",
    updatedAt: "2023-07-15",
  },
  {
    id: "business-proposal-template",
    name: "Business Proposal Template",
    description:
      "A professional business proposal template designed to win clients and secure deals. Includes all necessary sections and professional layouts.",
    price: 39,
    discountPrice: 29,
    category: "business",
    tags: ["business", "proposal", "professional", "sales"],
    rating: 4.9,
    reviewCount: 156,
    images: [
      "/placeholder.svg?height=600&width=800&text=Business+Proposal+Template",
      "/placeholder.svg?height=600&width=800&text=Business+Proposal+Preview+1",
      "/placeholder.svg?height=600&width=800&text=Business+Proposal+Preview+2",
    ],
    features: [
      "Professional design",
      "Complete proposal sections",
      "Executive summary template",
      "Pricing table templates",
      "Terms and conditions section",
      "Customizable charts and graphs",
    ],
    fileFormat: ["DOCX", "PDF", "PPTX"],
    compatibleWith: ["Microsoft Word", "Microsoft PowerPoint", "Google Docs", "Google Slides"],
    downloadSize: "25MB",
    createdAt: "2023-03-05",
    updatedAt: "2023-08-10",
    bestSeller: true,
  },
  {
    id: "presentation-template-minimal",
    name: "Minimal Presentation Template",
    description:
      "A clean, minimal presentation template with modern design elements. Perfect for business, academic, or creative presentations.",
    price: 19,
    category: "presentations",
    tags: ["presentation", "slides", "minimal", "modern"],
    rating: 4.6,
    reviewCount: 112,
    images: [
      "/placeholder.svg?height=600&width=800&text=Minimal+Presentation+Template",
      "/placeholder.svg?height=600&width=800&text=Presentation+Preview+1",
      "/placeholder.svg?height=600&width=800&text=Presentation+Preview+2",
    ],
    features: [
      "50+ unique slide layouts",
      "Minimal, clean design",
      "Easy to customize",
      "Animation presets",
      "Icon library included",
      "16:9 widescreen format",
    ],
    fileFormat: ["PPTX", "KEY", "PDF"],
    compatibleWith: ["Microsoft PowerPoint", "Apple Keynote", "Google Slides"],
    downloadSize: "35MB",
    createdAt: "2023-04-20",
    updatedAt: "2023-09-05",
    new: true,
  },
  {
    id: "academic-poster-template",
    name: "Academic Research Poster Template",
    description:
      "A professional academic poster template for conferences and research presentations. Designed to effectively communicate research findings.",
    price: 34,
    category: "academic",
    tags: ["academic", "poster", "research", "conference"],
    rating: 4.7,
    reviewCount: 78,
    images: [
      "/placeholder.svg?height=600&width=800&text=Academic+Poster+Template",
      "/placeholder.svg?height=600&width=800&text=Poster+Preview+1",
      "/placeholder.svg?height=600&width=800&text=Poster+Preview+2",
    ],
    features: [
      "Standard academic poster size",
      "Well-structured layout",
      "Easy to customize",
      "Data visualization templates",
      "Citation section",
      "High-resolution output",
    ],
    fileFormat: ["PPTX", "PDF", "AI"],
    compatibleWith: ["Microsoft PowerPoint", "Adobe Illustrator", "Adobe InDesign"],
    downloadSize: "45MB",
    createdAt: "2023-05-15",
    updatedAt: "2023-10-01",
  },
  {
    id: "creative-cv-template",
    name: "Creative CV Template",
    description:
      "A creative and eye-catching CV template perfect for designers, artists, and creative professionals. Stand out from the crowd with this unique design.",
    price: 24,
    discountPrice: 19,
    category: "cv-templates",
    tags: ["cv", "resume", "creative", "design"],
    rating: 4.8,
    reviewCount: 95,
    images: [
      "/placeholder.svg?height=600&width=800&text=Creative+CV+Template",
      "/placeholder.svg?height=600&width=800&text=Creative+CV+Preview+1",
      "/placeholder.svg?height=600&width=800&text=Creative+CV+Preview+2",
    ],
    features: [
      "Creative, unique design",
      "Portfolio section",
      "Skills visualization",
      "Matching cover letter",
      "Multiple color options",
      "Icon pack included",
    ],
    fileFormat: ["DOCX", "PDF", "PSD", "INDD"],
    compatibleWith: ["Microsoft Word", "Adobe Photoshop", "Adobe InDesign"],
    downloadSize: "28MB",
    createdAt: "2023-06-10",
    updatedAt: "2023-11-05",
    new: true,
  },
  {
    id: "business-plan-template",
    name: "Comprehensive Business Plan Template",
    description:
      "A detailed business plan template with all necessary sections to create a professional and compelling business plan for investors or bank loans.",
    price: 49,
    discountPrice: 39,
    category: "business",
    tags: ["business", "plan", "startup", "investor"],
    rating: 4.9,
    reviewCount: 132,
    images: [
      "/placeholder.svg?height=600&width=800&text=Business+Plan+Template",
      "/placeholder.svg?height=600&width=800&text=Business+Plan+Preview+1",
      "/placeholder.svg?height=600&width=800&text=Business+Plan+Preview+2",
    ],
    features: [
      "Complete business plan structure",
      "Financial projections templates",
      "Market analysis framework",
      "Executive summary guide",
      "SWOT analysis template",
      "Investor-ready formatting",
    ],
    fileFormat: ["DOCX", "PDF", "XLSX"],
    compatibleWith: ["Microsoft Word", "Microsoft Excel", "Google Docs", "Google Sheets"],
    downloadSize: "32MB",
    createdAt: "2023-07-20",
    updatedAt: "2023-12-15",
    bestSeller: true,
  },
  {
    id: "corporate-presentation-template",
    name: "Corporate Presentation Template",
    description:
      "A professional corporate presentation template suitable for business reports, company overviews, and investor presentations.",
    price: 29,
    category: "presentations",
    tags: ["presentation", "corporate", "business", "professional"],
    rating: 4.7,
    reviewCount: 108,
    images: [
      "/placeholder.svg?height=600&width=800&text=Corporate+Presentation+Template",
      "/placeholder.svg?height=600&width=800&text=Corporate+Preview+1",
      "/placeholder.svg?height=600&width=800&text=Corporate+Preview+2",
    ],
    features: [
      "80+ unique slide layouts",
      "Professional corporate design",
      "Data visualization slides",
      "Infographic elements",
      "Icon library included",
      "Animation presets",
    ],
    fileFormat: ["PPTX", "KEY", "PDF"],
    compatibleWith: ["Microsoft PowerPoint", "Apple Keynote", "Google Slides"],
    downloadSize: "48MB",
    createdAt: "2023-08-05",
    updatedAt: "2024-01-10",
  },
  {
    id: "1",
    name: "Complete Programming Course Bundle",
    description:
      "Master multiple programming languages with our comprehensive course bundle including Python, JavaScript, and React.",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300&text=Programming+Bundle",
    category: "courses",
    inStock: true,
    rating: 4.8,
    reviews: 245,
  },
  {
    id: "2",
    name: "Research Paper Template Pack",
    description: "Professional academic templates for research papers, thesis, and dissertations in various formats.",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300&text=Research+Templates",
    category: "templates",
    inStock: true,
    rating: 4.6,
    reviews: 128,
  },
  {
    id: "3",
    name: "Data Science Masterclass",
    description: "Learn data analysis, machine learning, and visualization with hands-on projects and real datasets.",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300&text=Data+Science",
    category: "courses",
    inStock: true,
    rating: 4.9,
    reviews: 312,
  },
  {
    id: "4",
    name: "Presentation Design Toolkit",
    description: "Professional PowerPoint and Google Slides templates for academic and business presentations.",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300&text=Presentation+Kit",
    category: "templates",
    inStock: true,
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "5",
    name: "Web Development Bootcamp",
    description: "Full-stack web development course covering HTML, CSS, JavaScript, Node.js, and databases.",
    price: 179.99,
    image: "/placeholder.svg?height=300&width=300&text=Web+Dev+Bootcamp",
    category: "courses",
    inStock: true,
    rating: 4.8,
    reviews: 456,
  },
  {
    id: "6",
    name: "Academic Writing Guide",
    description: "Comprehensive guide to academic writing with examples, templates, and best practices.",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300&text=Writing+Guide",
    category: "ebooks",
    inStock: true,
    rating: 4.5,
    reviews: 67,
  },
]

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category)
}

export const getRelatedProducts = (productId: string, limit = 4): Product[] => {
  const currentProduct = getProductById(productId)
  if (!currentProduct) return []

  // Get products in the same category, excluding the current product
  const sameCategory = products.filter(
    (product) => product.category === currentProduct.category && product.id !== productId,
  )

  // If we have enough products in the same category, return those
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  // Otherwise, add products with similar tags
  const productsByTags = products.filter((product) => {
    if (product.id === productId || sameCategory.includes(product)) return false

    // Check if there are any common tags
    return product.tags?.some((tag) => currentProduct.tags?.includes(tag))
  })

  return [...sameCategory, ...productsByTags].slice(0, limit)
}

export const getCategories = () => {
  return [
    { id: "cv-templates", name: "CV Templates" },
    { id: "presentations", name: "Presentation Templates" },
    { id: "academic", name: "Academic Templates" },
    { id: "business", name: "Business Templates" },
    { id: "courses", name: "Courses" },
    { id: "templates", name: "Templates" },
    { id: "ebooks", name: "E-books" },
    { id: "all", name: "All Products" },
  ]
}

export const getFeaturedProducts = (limit = 4): Product[] => {
  // Get bestsellers first
  const bestsellers = products.filter((product) => product.bestSeller)

  // If we have enough bestsellers, return those
  if (bestsellers.length >= limit) {
    return bestsellers.slice(0, limit)
  }

  // Otherwise, add new products
  const newProducts = products.filter((product) => product.new && !product.bestSeller)

  // If we still don't have enough, add highest rated products
  if ([...bestsellers, ...newProducts].length < limit) {
    const highestRated = products
      .filter((product) => !product.bestSeller && !product.new)
      .sort((a, b) => b.rating - a.rating)

    return [...bestsellers, ...newProducts, ...highestRated].slice(0, limit)
  }

  return [...bestsellers, ...newProducts].slice(0, limit)
}
