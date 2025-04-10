
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import PageHeader from "@/components/PageHeader";
import StatusToggle from "@/components/StatusToggle";
import { BlogPost } from "@/types/models";
import { fetchBlogPosts, updateBlogPost, deleteBlogPost } from "@/lib/data-utils";

const BlogList = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await fetchBlogPosts();
      setBlogs(data);
    } catch (error) {
      toast.error("Failed to load blog posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, isPublished: boolean) => {
    try {
      const updated = await updateBlogPost(id, { 
        isPublished,
        publishedAt: isPublished ? new Date().toISOString() : null
      });
      
      if (updated) {
        setBlogs(blogs.map(blog => blog.id === id ? { ...blog, isPublished, publishedAt: isPublished ? new Date().toISOString() : null } : blog));
        toast.success(`Blog post ${isPublished ? 'published' : 'unpublished'} successfully`);
      }
    } catch (error) {
      toast.error("Failed to update blog post status");
      console.error(error);
    }
  };

  const handleIndexChange = async (id: string, isIndexed: boolean) => {
    try {
      const updated = await updateBlogPost(id, { isIndexed });
      if (updated) {
        setBlogs(blogs.map(blog => blog.id === id ? { ...blog, isIndexed } : blog));
        toast.success(`Blog post is now ${isIndexed ? 'indexed' : 'not indexed'}`);
      }
    } catch (error) {
      toast.error("Failed to update indexing status");
      console.error(error);
    }
  };

  const handleFollowChange = async (id: string, isFollowed: boolean) => {
    try {
      const updated = await updateBlogPost(id, { isFollowed });
      if (updated) {
        setBlogs(blogs.map(blog => blog.id === id ? { ...blog, isFollowed } : blog));
        toast.success(`Blog post links are now ${isFollowed ? 'followed' : 'not followed'}`);
      }
    } catch (error) {
      toast.error("Failed to update follow status");
      console.error(error);
    }
  };

  const openDeleteDialog = (id: string) => {
    setBlogToDelete(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      const success = await deleteBlogPost(blogToDelete);
      if (success) {
        // Remove the deleted blog from state to update UI immediately
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogToDelete));
        toast.success("Blog post deleted successfully");
      } else {
        toast.error("Failed to delete blog post");
      }
    } catch (error) {
      toast.error("Failed to delete blog post");
      console.error(error);
    } finally {
      setDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not published";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        description="Manage your blog content"
        action={{
          label: "Add Post",
          path: "/admin/blogs/new",
          icon: <Plus size={16} />,
        }}
      />

      {loading ? (
        <div className="text-center py-8">Loading blog posts...</div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-500 mb-4">Start by adding your first blog post.</p>
          <Button asChild className="bg-admin-primary hover:bg-admin-primary-hover">
            <Link to="/admin/blogs/new" className="flex items-center gap-2">
              <Plus size={16} />
              Add Post
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>SEO Options</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusToggle
                        pressed={blog.isPublished}
                        onPressedChange={(pressed) => handleStatusChange(blog.id, pressed)}
                        enabledText="Active"
                        disabledText="Inactive"
                      />
                      <span className="text-sm text-gray-500 ml-2">
                        {blog.isPublished ? formatDate(blog.publishedAt) : "Draft"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <StatusToggle
                        pressed={blog.isIndexed}
                        onPressedChange={(pressed) => handleIndexChange(blog.id, pressed)}
                        enabledText="Index"
                        disabledText="Noindex"
                      />
                      <StatusToggle
                        pressed={blog.isFollowed}
                        onPressedChange={(pressed) => handleFollowChange(blog.id, pressed)}
                        enabledText="Follow"
                        disabledText="Nofollow"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(blog.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="Preview"
                      >
                        <Link to={`/admin/blogs/${blog.id}/preview`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="Edit"
                      >
                        <Link to={`/admin/blogs/${blog.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Delete"
                        onClick={() => openDeleteDialog(blog.id)}
                        className="text-red-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmationDialog
        isOpen={dialogOpen}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default BlogList;
