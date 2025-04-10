
// Base model with common fields
export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// SEO related fields for both tools and blog posts
export interface SeoFields {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  twitterImage: string;
  facebookImage: string;
  canonical: string;
  isIndexed: boolean;
  isFollowed: boolean;
}

// Tool types
export type ToolType = 'converter' | 'editor' | 'analyzer' | 'generator' | 'utility';

// Tool model
export interface Tool extends BaseModel, SeoFields {
  name: string;
  slug: string;
  description: string;
  content: string;
  type: ToolType;
  featuredImage: string;
  isActive: boolean;
}

// Blog post model
export interface BlogPost extends BaseModel, SeoFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  isPublished: boolean;
  publishedAt: string | null;
}

// Static page model
export interface StaticPage extends BaseModel, SeoFields {
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
}

// Confirmation dialog props
export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}
