export interface NewsItem {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  image?: string
}

export interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
}

export interface Notice {
  id: string
  title: string
  date: string
  category: string
  fileUrl?: string
}

export interface Department {
  name: string
  description: string
  icon: string // Lucide icon name
  href: string
  head: {
    name: string
    image: string
    message: string
  }
  programs: Array<{
    level: string
    name: string
    duration: string
    description: string
  }>
  faculty: Array<{
    name: string
    position: string
    image: string
    specialization: string
  }>
  facilities: string[]
  research: Array<{
    title: string
    description: string
  }>
}

export interface Program {
  level: "undergraduate" | "graduate"
  name: string
  department: string
  duration: string
  description: string
  curriculum: string[]
  admissionRequirements: string[]
}

export interface Faculty {
  name: string
  position: string
  image: string
  specialization: string
  department: string
}

export interface StudentStats {
  totalStudents: number
  graduates: number
  undergraduates: number
  internationalStudents: number
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  caption?: string
}

export interface College {
  info: {
    name: string
    established: string
    affiliation: string
    location: string
  }
  departments: Department[]
  programs: Program[]
  faculty: Faculty[]
  students: StudentStats
  news: NewsItem[]
  events: Event[]
  notices: Notice[]
  announcements: string[]
  gallery: GalleryItem[]
}

// Props interfaces for components
export interface HeroSectionProps {
  backgroundImage: string
  title: string
  subtitle: string
  ctaButtons: Array<{
    label: string
    href: string
    variant: "primary" | "secondary"
  }>
}

export interface CampusChiefMessageProps {
  name: string
  title: string
  image: string
  message: string
  fullMessage?: string
}

export interface QuickStatsProps {
  stats: Array<{
    label: string
    value: string
    icon: string
  }>
}

export interface NewsEventsProps {
  news: NewsItem[]
}

export interface DepartmentsOverviewProps {
  departments: Array<{
    name: string
    description: string
    icon: string
    href: string
  }>
}

export interface DepartmentPageProps {
  department: Department
}

export interface AcademicPageProps {
  programs: Program[]
  calendar: Array<{
    date: string
    event: string
    type: "exam" | "holiday" | "registration" | "other"
  }>
}

export interface GallerySectionProps {
  images: GalleryItem[]
}

export interface QuickLinksSectionProps {
  links: Array<{
    label: string
    href: string
    icon: string // Lucide icon name
  }>
}
