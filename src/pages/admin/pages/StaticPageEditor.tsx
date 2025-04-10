
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";
import SeoFields from "@/components/SeoFields";
import { StaticPage, SeoFields as SeoFieldsType } from "@/types/models";
import { fetchPageById, updatePage } from "@/lib/data-utils";

const StaticPageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [page, setPage] = useState<Partial<StaticPage>>({
    title: "",
    slug: "",
    content: "",
    lastUpdated: "",
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
    if (id) {
      fetchPageById(id)
        .then(data => {
          if (data) {
            setPage(data);
          } else {
            toast.error("Page not found");
            navigate("/admin");
          }
        })
        .catch(error => {
          toast.error("Failed to load page");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, navigate]);

  const handleInputChange = (field: keyof StaticPage, value: any) => {
    setPage(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSeoChange = (field: keyof SeoFieldsType, value: any) => {
    setPage(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!page.content) {
      toast.error("Content is required");
      return;
    }

    try {
      setSubmitting(true);
      
      if (id) {
        await updatePage(id, {
          ...page,
          lastUpdated: new Date().toISOString()
        });
        toast.success("Page updated successfully");
      }
      
      navigate("/admin");
    } catch (error) {
      toast.error("Failed to save page");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (id) {
      navigate(`/admin/pages/${id}/preview`);
    }
  };

  const getPageTitle = () => {
    switch(id) {
      case "privacy-policy":
        return "Privacy Policy";
      case "terms-conditions":
        return "Terms and Conditions";
      case "dmca-policy":
        return "DMCA Policy";
      case "disclaimer":
        return "Disclaimer";
      default:
        return "Static Page";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading page...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit {getPageTitle()}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          
          <Button
            type="submit"
            form="page-form"
            className="bg-admin-primary hover:bg-admin-primary-hover flex items-center gap-2"
            disabled={submitting}
          >
            <Save className="h-4 w-4" />
            {submitting ? "Saving..." : "Update"}
          </Button>
        </div>
      </div>

      <form id="page-form" onSubmit={handleSubmit}>
        <Tabs defaultValue="content">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <RichTextEditor
                value={page.content || ""}
                onChange={(value) => handleInputChange("content", value)}
                placeholder={`Write your ${getPageTitle()} content here...`}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="seo">
            <SeoFields 
              values={page}
              onChange={handleSeoChange}
            />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default StaticPageEditor;
