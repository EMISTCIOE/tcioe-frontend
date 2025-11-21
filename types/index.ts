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
  isApprovedByDepartment?: boolean;
  isApprovedByCampus?: boolean;
  is_approved_by_department?: boolean;
  is_approved_by_campus?: boolean;
  department: NoticeDepartment | null;
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

export interface GlobalGalleryItem {
  uuid: string;
  image: string;
  caption?: string | null;
  sourceType: string;
  sourceName: string;
  sourceContext?: string | null;
  sourceIdentifier: string;
  createdAt: string;
}

export interface GlobalEventReference {
  uuid: string;
  name: string;
}

export interface GlobalEvent {
  uuid: string;
  title: string;
  description?: string | null;
  eventType?: "CULTURAL" | "ACADEMIC" | "SPORTS" | "TECHNICAL" | "OTHER";
  eventStartDate: string | null;
  eventEndDate?: string | null;
  location?: string;
  registrationLink?: string | null;
  thumbnail?: string | null;
  unions?: GlobalEventReference[];
  clubs?: GlobalEventReference[];
  departments?: GlobalEventReference[];
  createdAt: string;
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
    image?: string | null; // optional department logo/thumbnail
  }>;
}

export interface DepartmentPageProps {
  department: Department;
}

export interface CampusDivisionOfficial {
  uuid: string;
  titlePrefix?: string | null;
  titlePrefixDisplay?: string | null;
  fullName: string;
  designation: string;
  designationDisplay?: string | null;
  photo?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
}

export interface CampusDivisionSummary {
  uuid: string;
  name: string;
  slug: string;
  shortDescription: string;
  thumbnail?: string | null;
  displayOrder: number;
}

export interface CampusDivisionDetail extends CampusDivisionSummary {
  detailedDescription?: string | null;
  objectives?: string | null;
  achievements?: string | null;
  heroImage?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  officials: CampusDivisionOfficial[];
  departmentHead?: CampusDivisionOfficial | null;
}

export interface CampusDivisionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CampusDivisionSummary[];
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
  images: GlobalGalleryItem[];
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

export interface GlobalGalleryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GlobalGalleryItem[];
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

export interface ProgramCatalogItem extends DepartmentProgramItem {
  department: DepartmentListItem;
}

export interface ProgramCatalogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProgramCatalogItem[];
}

export interface DepartmentSubjectAcademicProgram {
  uuid: string;
  name: string;
  shortName?: string | null;
  slug: string;
}

export interface DepartmentSubjectItem {
  uuid: string;
  name: string;
  slug: string;
  code: string;
  semester: string;
  program: string;
  topicsCovered: string;
  academicProgram?: DepartmentSubjectAcademicProgram | null;
}

export interface DepartmentSubjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepartmentSubjectItem[];
}

export interface DepartmentResearchItem {
  id: string;
  title: string;
  abstract?: string;
  researchType?: string | null;
  status?: string | null;
  department?: DepartmentListItem | null;
  fundingAgency?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  thumbnail?: string | null;
  isFeatured?: boolean;
  participantsCount?: number;
  categories?: Array<{ id: string; name: string; color?: string | null }>;
  createdAt?: string | null;
}

export interface DepartmentResearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepartmentResearchItem[];
}

export interface DepartmentProjectItem {
  id: string;
  title: string;
  abstract?: string;
  projectType?: string | null;
  status?: string | null;
  department?: DepartmentListItem | null;
  supervisorName?: string | null;
  academicYear?: string | null;
  thumbnail?: string | null;
  isFeatured?: boolean;
  createdAt?: string | null;
}

export interface DepartmentProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepartmentProjectItem[];
}

export interface DepartmentJournalAuthor {
  id: string;
  givenName: string;
  familyName?: string | null;
  affiliation?: string | null;
}

export interface DepartmentJournalItem {
  id: string;
  title: string;
  genre?: string | null;
  datePublished?: string | null;
  doiId?: string | null;
  abstract?: string | null;
  discipline?: string | null;
  authors?: DepartmentJournalAuthor[];
  department?: DepartmentListItem | null;
}

export interface DepartmentJournalResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DepartmentJournalItem[];
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
  registrationLink?: string | null;
  location?: string;
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
  description?: string; // From GlobalEvent backend
  eventType: "CULTURAL" | "ACADEMIC" | "SPORTS" | "TECHNICAL" | "OTHER";
  eventStartDate: string | null;
  eventEndDate: string | null;
  thumbnail: string | null;
  registrationLink?: string | null;
  location?: string;
  gallery?: CampusEventGallery[];
  union?: UnionSummary | null;
  // Additional fields for GlobalEvent compatibility
  clubs?: Array<{
    uuid: string;
    name: string;
  }>;
  departments?: Array<{
    uuid: string;
    name: string;
  }>;
}

export interface CampusEventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CampusEvent[];
}

export interface DepartmentSummary {
  uuid: string;
  name: string;
}

export interface UnionSummary {
  uuid: string;
  name: string;
  department?: DepartmentSummary | null;
}

export interface ClubEvent {
  uuid: string;
  title: string;
  clubName: string;
  date: string | null;
  eventStartDate?: string | null; // For GlobalEvent compatibility
  eventEndDate?: string | null; // For GlobalEvent compatibility
  thumbnail: string | null;
  descriptionShort?: string;
  descriptionDetailed?: string;
  description?: string; // From GlobalEvent backend
  registrationLink?: string | null;
  location?: string | null; // Make sure this is nullable
  gallery?: CampusEventGallery[];
  // Add fields from GlobalEvent for better compatibility
  eventType?: "CULTURAL" | "ACADEMIC" | "SPORTS" | "TECHNICAL" | "OTHER";
  clubs?: Array<{
    uuid: string;
    name: string;
  }>;
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
  department?: DepartmentSummary | null;
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
  department?: DepartmentSummary | null;
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

export type StaffTitlePrefix =
  | "ER"
  | "PROF"
  | "DR"
  | "MR"
  | "MRS"
  | "MS"
  | "AR"
  | "ASSOC_PROF"
  | "ASST_PROF"
  | "LECTURER"
  | "TECHNICIAN"
  | "OTHER";

export interface CampusKeyOfficial {
  uuid: string;
  titlePrefix: StaffTitlePrefix | null;
  fullName: string;
  designation: string;
  designationDisplay: string;
  message: string | null;
  photo: string | null;
  email: string | null;
  phoneNumber: string | null;
  isKeyOfficial: boolean;
}

export interface CampusKeyOfficialsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CampusKeyOfficial[];
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
