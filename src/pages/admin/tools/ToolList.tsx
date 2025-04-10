
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
import { Switch } from "@/components/ui/switch";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import PageHeader from "@/components/PageHeader";
import { Tool } from "@/types/models";
import { fetchTools, updateTool, deleteTool } from "@/lib/data-utils";

const ToolList = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await fetchTools();
      setTools(data);
    } catch (error) {
      toast.error("Failed to load tools");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      const updated = await updateTool(id, { isActive });
      if (updated) {
        setTools(tools.map(tool => tool.id === id ? { ...tool, isActive } : tool));
        toast.success(`Tool ${isActive ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      toast.error("Failed to update tool status");
      console.error(error);
    }
  };

  const openDeleteDialog = (id: string) => {
    setToolToDelete(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!toolToDelete) return;

    try {
      const success = await deleteTool(toolToDelete);
      if (success) {
        setTools(tools.filter(tool => tool.id !== toolToDelete));
        toast.success("Tool deleted successfully");
      } else {
        toast.error("Failed to delete tool");
      }
    } catch (error) {
      toast.error("Failed to delete tool");
      console.error(error);
    } finally {
      setDialogOpen(false);
      setToolToDelete(null);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      converter: "bg-blue-100 text-blue-800",
      editor: "bg-green-100 text-green-800",
      analyzer: "bg-purple-100 text-purple-800",
      generator: "bg-amber-100 text-amber-800",
      utility: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <PageHeader
        title="Tools"
        description="Manage your image to text tools"
        action={{
          label: "Add Tool",
          path: "/admin/tools/new",
          icon: <Plus size={16} />,
        }}
      />

      {loading ? (
        <div className="text-center py-8">Loading tools...</div>
      ) : tools.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
          <p className="text-gray-500 mb-4">Start by adding your first tool.</p>
          <Button asChild className="bg-admin-primary hover:bg-admin-primary-hover">
            <Link to="/admin/tools/new" className="flex items-center gap-2">
              <Plus size={16} />
              Add Tool
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTypeColor(tool.type)}>
                      {tool.type.charAt(0).toUpperCase() + tool.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={tool.isActive}
                      onCheckedChange={(checked) => handleStatusChange(tool.id, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="Preview"
                      >
                        <Link to={`/admin/tools/${tool.id}/preview`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title="Edit"
                      >
                        <Link to={`/admin/tools/${tool.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Delete"
                        onClick={() => openDeleteDialog(tool.id)}
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
        title="Delete Tool"
        message="Are you sure you want to delete this tool? This action cannot be undone."
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default ToolList;
