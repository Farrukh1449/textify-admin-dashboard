
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchBlogPostById } from "@/lib/data-utils";
import { BlogPost } from "@/types/models";

const BlogPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
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
  }, [id, navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-8">Loading preview...</div>;
  }

  if (!blog) {
    return <div className="text-center py-8">Blog post not found</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/blogs")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Preview Blog Post</h1>
        </div>
        
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/blogs/${id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="relative">
          {blog.featuredImage ? (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No featured image</span>
            </div>
          )}
          
          <div className="absolute top-4 right-4">
            <Badge variant={blog.isPublished ? "default" : "secondary"} className={blog.isPublished ? "bg-green-500" : ""}>
              {blog.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <p className="text-gray-500 mb-4">
            {blog.isPublished ? `Published on ${formatDate(blog.publishedAt)}` : "Draft"}
            {" • "}
            Last updated on {formatDate(blog.updatedAt)}
          </p>
          
          {blog.excerpt && (
            <div className="mb-6 italic text-gray-600 border-l-4 border-admin-primary pl-4 py-2">
              {blog.excerpt}
            </div>
          )}
          
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
        
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="font-semibold mb-2">SEO Preview</h3>
          <div className="border border-gray-300 rounded-md p-4 bg-white">
            <div className="text-blue-600 text-lg font-medium">{blog.title}</div>
            <div className="text-green-600 text-sm">{blog.canonical}</div>
            <div className="text-gray-600 mt-1">{blog.description}</div>
          </div>
          
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Keywords:</span> {blog.keywords}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Indexing:</span> {blog.isIndexed ? "Indexed" : "Not indexed"}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Following:</span> {blog.isFollowed ? "Links followed" : "Links not followed"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
