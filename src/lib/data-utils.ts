import { v4 as uuidv4 } from "uuid";
import { Tool, BlogPost, StaticPage, ToolType } from "@/types/models";

// Mock data storage (in a real app, this would be an API call)
let toolsData: Tool[] = [
  {
    id: "1",
    name: "Image to Text Converter",
    slug: "image-to-text",
    description: "Convert your images to text with high accuracy",
    content: "<p>Our advanced image to text converter uses OCR technology to extract text from images.</p>",
    type: "converter",
    featuredImage: "/placeholder.svg",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: "Image to Text Converter | Extract Text from Images",
    keywords: "image to text, ocr, optical character recognition, extract text from image",
    ogImage: "/placeholder.svg",
    twitterImage: "/placeholder.svg",
    facebookImage: "/placeholder.svg",
    canonical: "https://example.com/tools/image-to-text",
    isIndexed: true,
    isFollowed: true
  },
  {
    id: "2",
    name: "Text Editor",
    slug: "text-editor",
    description: "Simple text editor for your needs",
    content: "<p>A versatile text editor with formatting options and more.</p>",
    type: "editor",
    featuredImage: "/placeholder.svg",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: "Online Text Editor | Format and Edit Text",
    keywords: "text editor, online text editor, format text",
    ogImage: "/placeholder.svg",
    twitterImage: "/placeholder.svg",
    facebookImage: "/placeholder.svg",
    canonical: "https://example.com/tools/text-editor",
    isIndexed: true,
    isFollowed: true
  }
];

let blogsData: BlogPost[] = [
  {
    id: "1",
    title: "How to Extract Text from Images",
    slug: "how-to-extract-text-from-images",
    excerpt: "Learn the best ways to extract text from images using OCR technology",
    content: "<p>In this guide, we'll show you how to efficiently extract text from images using OCR (Optical Character Recognition) technology.</p>",
    featuredImage: "/placeholder.svg",
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Learn the best ways to extract text from images using OCR technology. Step-by-step guide with examples.",
    keywords: "extract text from images, ocr guide, image to text tutorial",
    ogImage: "/placeholder.svg",
    twitterImage: "/placeholder.svg",
    facebookImage: "/placeholder.svg",
    canonical: "https://example.com/blog/how-to-extract-text-from-images",
    isIndexed: true,
    isFollowed: true
  }
];

let pagesData: StaticPage[] = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: "<h1>Privacy Policy</h1><p>This is the privacy policy for our website.</p>",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Privacy Policy for TextiFy - Learn how we handle your data",
    keywords: "privacy policy, privacy, data protection",
    ogImage: "/placeholder.svg",
    twitterImage: "/placeholder.svg",
    facebookImage: "/placeholder.svg",
    canonical: "https://example.com/privacy-policy",
    isIndexed: true,
    isFollowed: true
  },
  {
    id: "terms-conditions",
    title: "Terms and Conditions",
    slug: "terms-conditions",
    content: "<h1>Terms and Conditions</h1><p>These are the terms and conditions for using our website.</p>",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Terms and Conditions for using TextiFy services",
    keywords: "terms, conditions, legal, terms of service",
    ogImage: "/placeholder.svg",
    twitterImage: "/placeholder.svg",
    facebookImage: "/placeholder.svg",
    canonical: "https://example.com/terms-conditions",
    isIndexed: true,
    isFollowed: true
  },
  {
    id: "dmca-policy",
    title: "DMCA Policy",
    slug: "dmca-policy",
    content: "<h1>DMCA Policy</h1><p>This is our DMCA policy.</p>",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "DMCA Policy for TextiFy - Copyright information",
    keywords: "dmca, copyright, takedown",
    ogImage: "/placeholder.svg",
    twitterImage: "/placeholder.svg",
    facebookImage: "/placeholder.svg",
    canonical: "https://example.com/dmca-policy",
    isIndexed: true,
    isFollowed: true
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    slug: "disclaimer",
    content: "<h1>Disclaimer</h1><p>This is our disclaimer.</p>",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Disclaimer for TextiFy services",
    keywords: "disclaimer, liability",
    ogImage: "/placeholder.svg",
    twitterImage: "/placeholder.svg",
    facebookImage: "/placeholder.svg",
    canonical: "https://example.com/disclaimer",
    isIndexed: true,
    isFollowed: true
  }
];

// Tool CRUD operations
export const fetchTools = (): Promise<Tool[]> => {
  return Promise.resolve([...toolsData]);
};

export const fetchToolById = (id: string): Promise<Tool | null> => {
  const tool = toolsData.find(t => t.id === id);
  return Promise.resolve(tool || null);
};

export const createTool = (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> => {
  const newTool: Tool = {
    ...tool,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  toolsData.push(newTool);
  return Promise.resolve(newTool);
};

export const updateTool = (id: string, tool: Partial<Tool>): Promise<Tool | null> => {
  const index = toolsData.findIndex(t => t.id === id);
  if (index === -1) return Promise.resolve(null);
  
  toolsData[index] = {
    ...toolsData[index],
    ...tool,
    updatedAt: new Date().toISOString()
  };
  
  return Promise.resolve(toolsData[index]);
};

export const deleteTool = (id: string): Promise<boolean> => {
  const initialLength = toolsData.length;
  toolsData = toolsData.filter(t => t.id !== id);
  return Promise.resolve(initialLength > toolsData.length);
};

// Blog CRUD operations
export const fetchBlogPosts = (): Promise<BlogPost[]> => {
  return Promise.resolve([...blogsData]);
};

export const fetchBlogPostById = (id: string): Promise<BlogPost | null> => {
  const post = blogsData.find(p => p.id === id);
  return Promise.resolve(post || null);
};

export const createBlogPost = (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  const newPost: BlogPost = {
    ...post,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  blogsData.push(newPost);
  return Promise.resolve(newPost);
};

export const updateBlogPost = (id: string, post: Partial<BlogPost>): Promise<BlogPost | null> => {
  const index = blogsData.findIndex(p => p.id === id);
  if (index === -1) return Promise.resolve(null);
  
  blogsData[index] = {
    ...blogsData[index],
    ...post,
    updatedAt: new Date().toISOString()
  };
  
  return Promise.resolve(blogsData[index]);
};

export const deleteBlogPost = (id: string): Promise<boolean> => {
  const initialLength = blogsData.length;
  blogsData = blogsData.filter(p => p.id !== id);
  return Promise.resolve(initialLength > blogsData.length);
};

// Page CRUD operations
export const fetchPages = (): Promise<StaticPage[]> => {
  return Promise.resolve([...pagesData]);
};

export const fetchPageById = (id: string): Promise<StaticPage | null> => {
  const page = pagesData.find(p => p.id === id);
  return Promise.resolve(page || null);
};

export const updatePage = (id: string, page: Partial<StaticPage>): Promise<StaticPage | null> => {
  const index = pagesData.findIndex(p => p.id === id);
  if (index === -1) return Promise.resolve(null);
  
  pagesData[index] = {
    ...pagesData[index],
    ...page,
    lastUpdated: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return Promise.resolve(pagesData[index]);
};

// Helper for slug generation
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Get tool type options
export const getToolTypeOptions = (): { value: ToolType; label: string }[] => {
  return [
    { value: 'converter', label: 'Converter' },
    { value: 'editor', label: 'Editor' },
    { value: 'analyzer', label: 'Analyzer' },
    { value: 'generator', label: 'Generator' },
    { value: 'utility', label: 'Utility' }
  ];
};
