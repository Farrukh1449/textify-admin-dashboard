
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPageById } from "@/lib/data-utils";
import { StaticPage } from "@/types/models";

const StaticPagePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
    return <div className="text-center py-8">Loading preview...</div>;
  }

  if (!page) {
    return <div className="text-center py-8">Page not found</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Preview {getPageTitle()}</h1>
        </div>
        
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/pages/${id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
          <p className="text-gray-500 mb-8">Last updated on {formatDate(page.lastUpdated)}</p>
          
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
        
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="font-semibold mb-2">SEO Preview</h3>
          <div className="border border-gray-300 rounded-md p-4 bg-white">
            <div className="text-blue-600 text-lg font-medium">{page.title}</div>
            <div className="text-green-600 text-sm">{page.canonical}</div>
            <div className="text-gray-600 mt-1">{page.description}</div>
          </div>
          
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Keywords:</span> {page.keywords}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Indexing:</span> {page.isIndexed ? "Indexed" : "Not indexed"}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Following:</span> {page.isFollowed ? "Links followed" : "Links not followed"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticPagePreview;
