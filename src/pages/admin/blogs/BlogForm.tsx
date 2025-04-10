
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploader from "@/components/ImageUploader";
import SeoFields from "@/components/SeoFields";
import { BlogPost, SeoFields as SeoFieldsType } from "@/types/models";
import { fetchBlogPostById, createBlogPost, updateBlogPost, generateSlug } from "@/lib/data-utils";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [titleChanged, setTitleChanged] = useState(false);
  
  const [blog, setBlog] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    isPublished: false,
    publishedAt: null,
    description: "",
    keywords: "",
    ogImage: "",
    twitterImage: "",
    facebookImage: "",
    canonical: "",
    isIndexed: true,
    isFollowed: true
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchBlogPostById(id)
        .then(data => {
          if (data) {
            setBlog(data);
          } else {
            toast.error("Blog post not found");
            navigate("/admin/blogs");
          }
        })
        .catch(error => {
          toast.error("Failed to load blog post");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing, navigate]);

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setBlog(prev => ({ ...prev, [field]: value }));
    
    if (field === 'title' && !isEditing) {
      setTitleChanged(true);
    }
  };
  
  const handleSeoChange = (field: keyof SeoFieldsType, value: any) => {
    setBlog(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (titleChanged && blog.title) {
      const newSlug = generateSlug(blog.title);
      setBlog(prev => ({ 
        ...prev, 
        slug: newSlug,
        canonical: `https://example.com/blog/${newSlug}`
      }));
      setTitleChanged(false);
    }
  }, [titleChanged, blog.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blog.title || !blog.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setSubmitting(true);
      
      if (isEditing && id) {
        await updateBlogPost(id, blog);
        toast.success("Blog post updated successfully");
      } else {
        await createBlogPost(blog as Omit<BlogPost, "id" | "createdAt" | "updatedAt">);
        toast.success("Blog post created successfully");
      }
      
      navigate("/admin/blogs");
    } catch (error) {
      toast.error("Failed to save blog post");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (isEditing && id) {
      navigate(`/admin/blogs/${id}/preview`);
    } else {
      toast.error("Save the blog post first to preview it");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading blog post...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/blogs")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit Blog Post" : "Add Blog Post"}</h1>
        </div>
        
        <div className="flex gap-2">
          {isEditing && (
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          )}
          
          <Button
            type="submit"
            form="blog-form"
            className="bg-admin-primary hover:bg-admin-primary-hover flex items-center gap-2"
            disabled={submitting}
          >
            <Save className="h-4 w-4" />
            {submitting ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>

      <form id="blog-form" onSubmit={handleSubmit}>
        <Tabs defaultValue="content">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
                <div>
                  <Label htmlFor="title">Blog Title</Label>
                  <Input
                    id="title"
                    value={blog.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter blog title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={blog.slug || ""}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="blog-post-slug"
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={blog.excerpt || ""}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    placeholder="Enter a short excerpt"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Published Status</h5>
                    <p className="text-sm text-gray-500">Post is visible on the website</p>
                  </div>
                  <Switch 
                    checked={blog.isPublished ?? false}
                    onCheckedChange={(checked) => {
                      handleInputChange("isPublished", checked);
                      if (checked) {
                        handleInputChange("publishedAt", new Date().toISOString());
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Label htmlFor="featured-image" className="mb-2 block">Featured Image</Label>
                  <ImageUploader
                    value={blog.featuredImage || ""}
                    onChange={(value) => handleInputChange("featuredImage", value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <Label htmlFor="content" className="mb-2 block">Content</Label>
              <RichTextEditor
                value={blog.content || ""}
                onChange={(value) => handleInputChange("content", value)}
                placeholder="Write your blog post content here..."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="seo">
            <SeoFields 
              values={blog}
              onChange={handleSeoChange}
            />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default BlogForm;
