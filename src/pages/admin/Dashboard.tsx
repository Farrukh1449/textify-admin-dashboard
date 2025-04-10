
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Wrench, 
  BookText, 
  FileText, 
  Shield, 
  AlertTriangle, 
  Scale, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { fetchTools, fetchBlogPosts, fetchPages } from "@/lib/data-utils";

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const Dashboard = () => {
  const [tools, setTools] = useState(0);
  const [blogs, setBlogs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [toolsData, blogsData] = await Promise.all([
          fetchTools(),
          fetchBlogPosts()
        ]);
        
        setTools(toolsData.length);
        setBlogs(blogsData.length);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const stats: DashboardStat[] = [
    {
      title: "Tools",
      value: tools,
      description: "Manage your image to text conversion tools",
      path: "/admin/tools",
      icon: <Wrench className="h-8 w-8 text-admin-primary" />
    },
    {
      title: "Blog Posts",
      value: blogs,
      description: "Manage your blog content",
      path: "/admin/blogs",
      icon: <BookText className="h-8 w-8 text-admin-primary" />
    }
  ];

  const pages = [
    {
      title: "Privacy Policy",
      description: "Manage your privacy policy page",
      path: "/admin/pages/privacy-policy/edit",
      icon: <Shield className="h-8 w-8 text-admin-primary" />
    },
    {
      title: "Terms and Conditions",
      description: "Manage your terms and conditions page",
      path: "/admin/pages/terms-conditions/edit",
      icon: <Scale className="h-8 w-8 text-admin-primary" />
    },
    {
      title: "DMCA Policy",
      description: "Manage your DMCA policy page",
      path: "/admin/pages/dmca-policy/edit",
      icon: <FileText className="h-8 w-8 text-admin-primary" />
    },
    {
      title: "Disclaimer",
      description: "Manage your disclaimer page",
      path: "/admin/pages/disclaimer/edit",
      icon: <AlertTriangle className="h-8 w-8 text-admin-primary" />
    }
  ];

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-gray-500 text-sm mt-1">{stat.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to={stat.path} className="flex items-center justify-between">
                  Manage {stat.title}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <h2 className="text-xl font-bold mb-4">Static Pages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((page, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{page.title}</CardTitle>
              {page.icon}
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">{page.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to={page.path} className="flex items-center justify-between">
                  Edit Page
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
