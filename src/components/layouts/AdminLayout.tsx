
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, CalendarDays, Users, FileText, MessageSquare, ClipboardList, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    });
  };

  const menuItems = [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Sessions', url: '/admin/sessions', icon: CalendarDays },
    { title: 'Mentors', url: '/admin/mentors', icon: Users },
    { title: 'Receipts', url: '/admin/receipts', icon: FileText },
    { title: 'Messages', url: '/admin/messages', icon: MessageSquare },
    { title: 'Audit Logs', url: '/admin/audit-logs', icon: ClipboardList },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="px-6 py-3">
            <div className="flex items-center">
              <h1 className={`text-xl font-bold text-primary ${isCollapsed ? 'hidden' : 'block'}`}>PayTech</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-auto mb-4">
              <SidebarGroupLabel className={isCollapsed ? 'hidden' : 'block'}>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-3 text-red-500">
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger onClick={() => setIsCollapsed(!isCollapsed)} />
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.name}</span>
                <span className="block text-xs text-gray-500">{user?.email}</span>
              </div>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
