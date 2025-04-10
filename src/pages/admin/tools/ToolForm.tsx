
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploader from "@/components/ImageUploader";
import SeoFields from "@/components/SeoFields";
import { Tool, ToolType, SeoFields as SeoFieldsType } from "@/types/models";
import { fetchToolById, createTool, updateTool, generateSlug, getToolTypeOptions } from "@/lib/data-utils";

const ToolForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);
  
  const [tool, setTool] = useState<Partial<Tool>>({
    name: "",
    slug: "",
    description: "",
    content: "",
    type: "converter",
    featuredImage: "",
    isActive: true,
    title: "",
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
      fetchToolById(id)
        .then(data => {
          if (data) {
            setTool(data);
          } else {
            toast.error("Tool not found");
            navigate("/admin/tools");
          }
        })
        .catch(error => {
          toast.error("Failed to load tool");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing, navigate]);

  const handleInputChange = (field: keyof Tool, value: any) => {
    setTool(prev => ({ ...prev, [field]: value }));
    
    if (field === 'name' && !isEditing) {
      setNameChanged(true);
    }
  };
  
  const handleSeoChange = (field: keyof SeoFieldsType, value: any) => {
    setTool(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (nameChanged && tool.name) {
      const newSlug = generateSlug(tool.name);
      setTool(prev => ({ 
        ...prev, 
        slug: newSlug,
        title: tool.name,
        canonical: `https://example.com/tools/${newSlug}`
      }));
      setNameChanged(false);
    }
  }, [nameChanged, tool.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tool.name || !tool.type) {
      toast.error("Name and type are required");
      return;
    }

    try {
      setSubmitting(true);
      
      if (isEditing && id) {
        await updateTool(id, tool);
        toast.success("Tool updated successfully");
      } else {
        await createTool(tool as Omit<Tool, "id" | "createdAt" | "updatedAt">);
        toast.success("Tool created successfully");
      }
      
      navigate("/admin/tools");
    } catch (error) {
      toast.error("Failed to save tool");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (isEditing && id) {
      navigate(`/admin/tools/${id}/preview`);
    } else {
      toast.error("Save the tool first to preview it");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tool...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/tools")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit Tool" : "Add Tool"}</h1>
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
            form="tool-form"
            className="bg-admin-primary hover:bg-admin-primary-hover flex items-center gap-2"
            disabled={submitting}
          >
            <Save className="h-4 w-4" />
            {submitting ? "Saving..." : isEditing ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <form id="tool-form" onSubmit={handleSubmit}>
        <Tabs defaultValue="content">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
                <div>
                  <Label htmlFor="name">Tool Name</Label>
                  <Input
                    id="name"
                    value={tool.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter tool name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={tool.slug || ""}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="tool-slug"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Tool Type</Label>
                  <Select
                    value={tool.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getToolTypeOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={tool.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter a short description"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Active Status</h5>
                    <p className="text-sm text-gray-500">Tool is visible on the website</p>
                  </div>
                  <Switch 
                    checked={tool.isActive ?? true}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Label htmlFor="featured-image" className="mb-2 block">Featured Image</Label>
                  <ImageUploader
                    value={tool.featuredImage || ""}
                    onChange={(value) => handleInputChange("featuredImage", value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <Label htmlFor="content" className="mb-2 block">Content</Label>
              <RichTextEditor
                value={tool.content || ""}
                onChange={(value) => handleInputChange("content", value)}
                placeholder="Write your tool content here..."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="seo">
            <SeoFields 
              values={tool}
              onChange={handleSeoChange}
            />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default ToolForm;
