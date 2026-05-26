export interface Slide {
  id: string;
  title: string;
  description: string;
  image: string; // Background class, icon-identifier or inline illustration type
  order: number;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  message: string;
  role: string;
}

export interface ServiceDetail {
  id: string; // e.g. ai-ads, web-mobile, graphic-design
  title: string;
  description: string;
  features: string[];
  icon: string; // Lucide icon identifier
  color: string; // Tailwind color class or hex
}

export interface AboutSection {
  companyHistory: string;
  historyTitle: string;
  vision: string;
  mission: string;
}

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  percentage: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectPost {
  id: string;
  title: string;
  categoryId: string;
  videoUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  websiteUrl?: string;
  description: string; // HTML rich text format
  status: 'draft' | 'publish';
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  message: string;
  createdAt: string;
}

export interface SystemStats {
  totalPosts: number;
  categoriesCount: number;
  recentActivities: string[];
}
