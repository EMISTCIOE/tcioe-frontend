export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

// Notice API Types
export interface NoticeMedia {
  uuid: string;
  file: string;
  caption: string;
  mediaType: "DOCUMENT" | "IMAGE" | "VIDEO";
}

export interface NoticeDepartment {
  uuid: string;
  name: string;
}

export interface NoticeCategory {
  uuid: string;
  name: string;
}

export interface NoticeAuthor {
  uuid: string;
  fullName: string;
  photo: string | null;
}

export interface Notice {
  uuid: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  isFeatured: boolean;
  department: NoticeDepartment;
  category: NoticeCategory;
  publishedAt: string;
  medias: NoticeMedia[];
  author: NoticeAuthor;
}

export interface NoticesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notice[];
}

export interface NoticeCategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NoticeCategory[];
}

export interface NoticeDepartmentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NoticeDepartment[];
}

export interface Department {
  name: string;
  description: string;
  icon: string; // Lucide icon name
  href: string;
  head: {
    name: string;
    image: string;
    message: string;
  };
  programs: Array<{
    level: string;
    name: string;
    duration: string;
    description: string;
  }>;
  faculty: Array<{
    name: string;
    position: string;
    image: string;
    specialization: string;
  }>;
  facilities: string[];
  research: Array<{
    title: string;
    description: string;
  }>;
}

export interface Program {
  level: "undergraduate" | "graduate";
  name: string;
  department: string;
  duration: string;
  description: string;
  curriculum: string[];
  admissionRequirements: string[];
}

export interface Faculty {
  name: string;
  position: string;
  image: string;
  specialization: string;
  department: string;
}

export interface StudentStats {
  totalStudents: number;
  graduates: number;
  undergraduates: number;
  internationalStudents: number;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface College {
  info: {
    name: string;
    established: string;
    affiliation: string;
    location: string;
  };
  departments: Department[];
  programs: Program[];
  faculty: Faculty[];
  students: StudentStats;
  news: NewsItem[];
  events: Event[];
  notices: Notice[];
  announcements: string[];
  gallery: GalleryItem[];
}

// Props interfaces for components
export interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  ctaButtons: Array<{
    label: string;
    href: string;
    variant: "primary" | "secondary";
  }>;
}

export interface CampusChiefMessageProps {
  name: string;
  title: string;
  image: string;
  message: string;
  fullMessage?: string;
}

export interface QuickStatsProps {
  stats: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
}

export interface NewsEventsProps {
  news: NewsItem[];
}

export interface DepartmentsOverviewProps {
  departments: Array<{
    name: string;
    description: string;
    icon: string;
    href: string;
  }>;
}

export interface DepartmentPageProps {
  department: Department;
}

export interface AcademicPageProps {
  programs: Program[];
  calendar: Array<{
    date: string;
    event: string;
    type: "exam" | "holiday" | "registration" | "other";
  }>;
}

export interface GallerySectionProps {
  images: GalleryItem[];
}

export interface QuickLinksSectionProps {
  links: Array<{
    label: string;
    href: string;
    icon: string; // Lucide icon name
  }>;
}

// Download API Types
export interface Download {
  uuid: string;
  title: string;
  description: string;
  file: string;
  createdAt: string;
}

export interface DownloadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Download[];
}

// Department Public API Types
export interface DepartmentListItem {
  uuid: string;
  name: string;
  slug: string;
  shortName?: string;
  briefDescription?: string;
  thumbnail?: string | null;
}

export interface DepartmentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepartmentListItem[];
}

export interface DepartmentSocialLink {
  uuid: string;
  platform:
    | "FACEBOOK"
    | "INSTAGRAM"
    | "TWITTER"
    | "LINKEDIN"
    | "YOUTUBE"
    | "WEBSITE";
  url: string;
}

export interface DepartmentDetail extends DepartmentListItem {
  detailedDescription?: string;
  phoneNo?: string | null;
  email?: string | null;
  socialLinks?: DepartmentSocialLink[];
}

export interface DepartmentProgramItem {
  uuid: string;
  name: string;
  shortName?: string;
  slug: string;
  description?: string;
  programType: "BACHELORS" | "MASTERS" | "DIPLOMA" | "OTHER";
  thumbnail?: string | null;
}

export interface DepartmentProgramsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepartmentProgramItem[];
}

export interface DepartmentStaffItem {
  uuid: string;
  title?: string | null; // e.g., Er., Dr., Ar.
  name: string;
  designation: string;
  photo?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  message?: string | null;
  displayOrder?: number;
}

export interface DepartmentStaffsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepartmentStaffItem[];
}

export interface DepartmentEventItem {
  uuid: string;
  title: string;
  descriptionShort?: string;
  eventType: "CULTURAL" | "ACADEMIC" | "SPORTS" | "TECHNICAL" | "OTHER";
  eventStartDate: string;
  eventEndDate: string;
  thumbnail?: string | null;
}

export interface DepartmentEventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepartmentEventItem[];
}

// Department Plans have the same shape as downloads
export interface DepartmentPlansResponse extends DownloadsResponse {}


// Campus Report API Types
export interface FiscalSession {
  uuid: string;
  sessionFull: string;
  sessionShort: string;
}

export interface CampusReport {
  uuid: string;
  reportType: "SELF_STUDY" | "ANNUAL" | "FINANCIAL" | "ACADEMIC" | "OTHER";
  fiscalSession: FiscalSession;
  publishedDate: string;
  file: string;
}

export interface CampusReportsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CampusReport[];
}

// API Query Parameters
export interface PaginatedQueryParams {
  page?: number;
  limit?: number;
}

export interface SearchableQueryParams extends PaginatedQueryParams {
  search?: string;
}

// Event API Types
export interface CampusEventGallery {
  uuid: string;
  image: string;
  caption: string;
}

export interface CampusEvent {
  uuid: string;
  title: string;
  descriptionShort: string;
  descriptionDetailed?: string;
  eventType: "CULTURAL" | "ACADEMIC" | "SPORTS" | "TECHNICAL" | "OTHER";
  eventStartDate: string;
  eventEndDate: string;
  thumbnail: string;
  gallery?: CampusEventGallery[];
}

export interface CampusEventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CampusEvent[];
}

export interface ClubEvent {
  uuid: string;
  title: string;
  clubName: string;
  date: string;
  thumbnail: string;
  descriptionShort?: string;
  descriptionDetailed?: string;
  gallery?: CampusEventGallery[];
}

export interface ClubEventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClubEvent[];
}

// Club API Types
export interface ClubMember {
  uuid: string;
  fullName: string;
  designation: string;
  photo?: string;
}

export interface Club {
  uuid: string;
  name: string;
  slug?: string; // URL-friendly name like 'ecast', 'robotics-club'
  shortDescription: string;
  detailedDescription?: string;
  thumbnail: string;
  websiteUrl?: string; // Optional website URL
  members?: ClubMember[];
}

export interface ClubsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Club[];
}

// Union API Types
export interface UnionMember {
  uuid: string;
  fullName: string;
  designation: string;
  photo?: string;
}

export interface Union {
  uuid: string;
  name: string;
  thumbnail: string;
  shortDescription: string;
  detailedDescription?: string;
  websiteUrl?: string;
  members?: UnionMember[];
}

export interface UnionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Union[];
}

// Academic Calendar API Types
export interface AcademicCalendar {
  uuid: string;
  programType: "BACHELORS" | "MASTERS" | "DIPLOMA" | "OTHER";
  startYear: number;
  endYear: number;
  file: string;
}

export interface AcademicCalendarsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AcademicCalendar[];
}

// Campus Info API Types
export interface SocialLink {
  uuid: string;
  platform:
    | "FACEBOOK"
    | "INSTAGRAM"
    | "TWITTER"
    | "LINKEDIN"
    | "YOUTUBE"
    | "WEBSITE";
  url: string;
}

export interface CampusInfo {
  name: string;
  phoneNumber: string;
  email: string;
  organizationChart: string;
  location: string;
  socialLinks: SocialLink[];
}

// Feedback API Types
export interface FeedbackSubmission {
  fullName: string;
  rollNumber: string;
  email: string;
  feedbackOrSuggestion: string;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
}

export interface InaugurationGalleryProps {
  items: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
}
