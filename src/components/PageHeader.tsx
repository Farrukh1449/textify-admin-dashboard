
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    path: string;
    icon?: React.ReactNode;
  };
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      
      {action && (
        <div className="mt-4 sm:mt-0">
          <Button asChild className="bg-admin-primary hover:bg-admin-primary-hover">
            <Link to={action.path} className="flex items-center gap-2">
              {action.icon}
              {action.label}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
