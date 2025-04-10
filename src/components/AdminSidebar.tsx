
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wrench, 
  BookText, 
  FileText, 
  Shield, 
  AlertTriangle, 
  Scale, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  title: string;
  path: string;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, title, path, onClick }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-admin-accent hover:text-admin-primary",
          isActive ? "bg-admin-accent text-admin-primary font-medium" : "text-gray-600"
        )
      }
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </NavLink>
  );
};

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection = ({ title, children }: SidebarSectionProps) => (
  <div className="pb-4">
    <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
      {title}
    </h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 transform border-r border-gray-200 bg-white p-4 transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-admin-primary">TextiFy Admin</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <SidebarItem 
            icon={LayoutDashboard} 
            title="Dashboard" 
            path="/admin" 
            onClick={closeSidebar}
          />

          <SidebarSection title="Content Management">
            <SidebarItem 
              icon={Wrench} 
              title="Tools" 
              path="/admin/tools" 
              onClick={closeSidebar}
            />
            <SidebarItem 
              icon={BookText} 
              title="Blog" 
              path="/admin/blogs" 
              onClick={closeSidebar}
            />
          </SidebarSection>

          <SidebarSection title="Pages">
            <SidebarItem 
              icon={Shield} 
              title="Privacy Policy" 
              path="/admin/pages/privacy-policy/edit" 
              onClick={closeSidebar}
            />
            <SidebarItem 
              icon={Scale} 
              title="Terms & Conditions" 
              path="/admin/pages/terms-conditions/edit" 
              onClick={closeSidebar}
            />
            <SidebarItem 
              icon={FileText} 
              title="DMCA Policy" 
              path="/admin/pages/dmca-policy/edit" 
              onClick={closeSidebar}
            />
            <SidebarItem 
              icon={AlertTriangle} 
              title="Disclaimer" 
              path="/admin/pages/disclaimer/edit" 
              onClick={closeSidebar}
            />
          </SidebarSection>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
