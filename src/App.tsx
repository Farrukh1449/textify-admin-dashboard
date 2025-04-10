
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createElement } from "react";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ToolList from "./pages/admin/tools/ToolList";
import ToolForm from "./pages/admin/tools/ToolForm";
import ToolPreview from "./pages/admin/tools/ToolPreview";
import BlogList from "./pages/admin/blogs/BlogList";
import BlogForm from "./pages/admin/blogs/BlogForm";
import BlogPreview from "./pages/admin/blogs/BlogPreview";
import StaticPageEditor from "./pages/admin/pages/StaticPageEditor";
import StaticPagePreview from "./pages/admin/pages/StaticPagePreview";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect from home to admin dashboard */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              
              {/* Tools Routes */}
              <Route path="tools" element={<ToolList />} />
              <Route path="tools/new" element={<ToolForm />} />
              <Route path="tools/:id/edit" element={<ToolForm />} />
              <Route path="tools/:id/preview" element={<ToolPreview />} />
              
              {/* Blog Routes */}
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/new" element={<BlogForm />} />
              <Route path="blogs/:id/edit" element={<BlogForm />} />
              <Route path="blogs/:id/preview" element={<BlogPreview />} />
              
              {/* Static Pages Routes */}
              <Route path="pages/:id/edit" element={<StaticPageEditor />} />
              <Route path="pages/:id/preview" element={<StaticPagePreview />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
