import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Award,
  Trophy,
  Heart,
  Mail,
  FileText,
  LogOut,
  Upload,
  BookText,
  User
} from "lucide-react";
import { Link, useLocation } from "wouter";
import CertificationsManager from "@/components/admin/CertificationsManager";
import BlogPostsManager from "@/components/admin/BlogPostsManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import SkillsManager from "@/components/admin/SkillsManager";
import MessagesManager from "@/components/admin/MessagesManager";
import AchievementsManager from "@/components/admin/AchievementsManager";
import HobbiesManager from "@/components/admin/HobbiesManager";
import AboutManager from "@/components/admin/AboutManager";
import MediaUploadsManager from "@/components/admin/MediaUploadsManager";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin navbar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {user?.username} ({user?.role})
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-8 flex flex-wrap">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="uploads">Media Upload</TabsTrigger>
          </TabsList>

          {/* Dashboard overview */}
          <TabsContent value="dashboard">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="Projects" 
                description="Manage your portfolio projects" 
                icon={<Briefcase className="h-6 w-6 text-primary" />} 
                link="/admin/projects"
              />
              <DashboardCard 
                title="Experience" 
                description="Update work experience details" 
                icon={<FileText className="h-6 w-6 text-primary" />} 
                link="/admin/experience"
              />
              <DashboardCard 
                title="Skills" 
                description="Add or update your technical skills" 
                icon={<GraduationCap className="h-6 w-6 text-primary" />} 
                link="/admin/skills"
              />
              <DashboardCard 
                title="Certifications" 
                description="Manage your certification list" 
                icon={<Award className="h-6 w-6 text-primary" />} 
                link="/admin/certifications"
              />
              <DashboardCard 
                title="Achievements" 
                description="Update your key achievements" 
                icon={<Trophy className="h-6 w-6 text-primary" />} 
                link="/admin/achievements"
              />
              <DashboardCard 
                title="Hobbies" 
                description="Personalize your hobbies section" 
                icon={<Heart className="h-6 w-6 text-primary" />} 
                link="/admin/hobbies"
              />
              <DashboardCard 
                title="Messages" 
                description="View contact form submissions" 
                icon={<Mail className="h-6 w-6 text-primary" />} 
                link="/admin/messages"
              />
              <DashboardCard 
                title="Blog Posts" 
                description="Create and manage blog content" 
                icon={<BookText className="h-6 w-6 text-primary" />} 
                link="/admin/blog"
              />
              <DashboardCard 
                title="Media Upload" 
                description="Upload and manage media files" 
                icon={<Upload className="h-6 w-6 text-primary" />} 
                link="/admin/uploads"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Welcome to your portfolio admin dashboard. From here you can manage all aspects of your 
                portfolio website content. Choose a section from the tabs above to get started.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Add or update projects to showcase your work</li>
                <li>Keep your work experience current</li>
                <li>Update your skills as you learn new technologies</li>
                <li>Add new certifications as you earn them</li>
                <li>Track your achievements and milestones</li>
                <li>Personalize your hobbies section</li>
                <li>Create and publish blog posts about your expertise</li>
                <li>Respond to messages from visitors</li>
              </ul>
            </div>
          </TabsContent>

          {/* Placeholders for other tabs */}
          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>
          
          <TabsContent value="experience">
            <h2 className="text-2xl font-bold mb-6">Experience Management</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Manage your work experience entries here.
            </p>
            <div className="text-center py-12">
              <p className="text-gray-500 italic">Experience management UI will be implemented here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>
          
          <TabsContent value="certifications">
            <CertificationsManager />
          </TabsContent>
          
          <TabsContent value="achievements">
            <AchievementsManager />
          </TabsContent>
          
          <TabsContent value="hobbies">
            <HobbiesManager />
          </TabsContent>
          
          <TabsContent value="blog">
            <BlogPostsManager />
          </TabsContent>
          
          <TabsContent value="messages">
            <MessagesManager />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutManager />
          </TabsContent>
          
          <TabsContent value="uploads">
            <MediaUploadsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Dashboard card component
function DashboardCard({ 
  title, 
  description, 
  icon, 
  link 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  link: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{description}</CardDescription>
        <Link href={link}>
          <Button variant="outline" size="sm" className="w-full">
            Manage
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}