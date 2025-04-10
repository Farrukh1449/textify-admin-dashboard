
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "./ImageUploader";
import { SeoFields as SeoFieldsType } from "@/types/models";

interface SeoFieldsProps {
  values: Partial<SeoFieldsType>;
  onChange: (field: keyof SeoFieldsType, value: any) => void;
}

const SeoFields = ({ values, onChange }: SeoFieldsProps) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium border-b pb-2">SEO Settings</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="title">Meta Title</Label>
            <Input
              id="title"
              value={values.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Meta title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={values.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Meta description"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={values.keywords || ""}
              onChange={(e) => onChange("keywords", e.target.value)}
              placeholder="Keywords separated by commas"
            />
          </div>
          
          <div>
            <Label htmlFor="canonical">Canonical URL</Label>
            <Input
              id="canonical"
              value={values.canonical || ""}
              onChange={(e) => onChange("canonical", e.target.value)}
              placeholder="https://example.com/page"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h4 className="text-md font-medium mb-4">Social Media Images</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImageUploader
              label="OG Image"
              value={values.ogImage || ""}
              onChange={(value) => onChange("ogImage", value)}
            />
            
            <ImageUploader
              label="Twitter Image"
              value={values.twitterImage || ""}
              onChange={(value) => onChange("twitterImage", value)}
            />
            
            <ImageUploader
              label="Facebook Image"
              value={values.facebookImage || ""}
              onChange={(value) => onChange("facebookImage", value)}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h4 className="text-md font-medium mb-4">Indexing Settings</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Index this page</h5>
                <p className="text-sm text-gray-500">Allow search engines to index this page</p>
              </div>
              <Switch 
                checked={values.isIndexed ?? true}
                onCheckedChange={(checked) => onChange("isIndexed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Follow links</h5>
                <p className="text-sm text-gray-500">Allow search engines to follow links on this page</p>
              </div>
              <Switch 
                checked={values.isFollowed ?? true}
                onCheckedChange={(checked) => onChange("isFollowed", checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoFields;
