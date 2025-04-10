
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchToolById } from "@/lib/data-utils";
import { Tool } from "@/types/models";

const ToolPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
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
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center py-8">Loading preview...</div>;
  }

  if (!tool) {
    return <div className="text-center py-8">Tool not found</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/tools")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Preview Tool</h1>
        </div>
        
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/tools/${id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="relative">
          {tool.featuredImage ? (
            <img
              src={tool.featuredImage}
              alt={tool.name}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No featured image</span>
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant={tool.isActive ? "default" : "secondary"} className="bg-admin-primary">
              {tool.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline" className="bg-white">
              {tool.type.charAt(0).toUpperCase() + tool.type.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
          <p className="text-gray-600 mb-6">{tool.description}</p>
          
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: tool.content }} />
        </div>
        
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="font-semibold mb-2">SEO Preview</h3>
          <div className="border border-gray-300 rounded-md p-4 bg-white">
            <div className="text-blue-600 text-lg font-medium">{tool.title}</div>
            <div className="text-green-600 text-sm">{tool.canonical}</div>
            <div className="text-gray-600 mt-1">{tool.description}</div>
          </div>
          
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Keywords:</span> {tool.keywords}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Indexing:</span> {tool.isIndexed ? "Indexed" : "Not indexed"}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Following:</span> {tool.isFollowed ? "Links followed" : "Links not followed"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPreview;
