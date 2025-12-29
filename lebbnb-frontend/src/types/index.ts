// API Response Types
export interface Property {
  _id: string;
  title: string;
  address: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Home {
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  featuredProperties?: Property[];
  sections?: Section[];
  testimonials?: Testimonial[];
  stats?: Stat[];
}

export interface Section {
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface Testimonial {
  name: string;
  text: string;
  rating?: number;
  image?: string;
}

export interface Stat {
  label: string;
  value: string;
  icon?: string;
}

export interface About {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  mission?: string;
  vision?: string;
  values?: string[];
  teamMembers?: TeamMember[];
  companyStats?: CompanyStat[];
  images?: string[];
}

export interface TeamMember {
  name: string;
  position: string;
  bio?: string;
  image?: string;
}

export interface CompanyStat {
  label: string;
  value: string;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: 'new' | 'read' | 'replied';
  reply?: string;
  replyDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
}
