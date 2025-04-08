import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRight, BookOpenIcon, Loader2 } from "lucide-react";

export default function BlogPage() {
  const [, setLocation] = useLocation();

  const { data: blogPosts = [], isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog");
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      return response.json();
    },
  });

  // Only show published posts
  const publishedPosts = blogPosts.filter(post => post.published);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Error Loading Blog</h2>
        <p className="text-gray-600 dark:text-gray-300">
          There was an error loading the blog posts. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (publishedPosts.length === 0) {
    return (
      <div className="container py-16 px-4 mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
          <BookOpenIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h2 className="text-2xl font-medium text-center">No blog posts yet</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
            Check back later for articles on software development, technology insights, and project showcases.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 px-4 mx-auto">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            {post.featuredImageUrl && (
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer" 
                onClick={() => setLocation(`/blog/${post.slug}`)}>
                {post.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <CalendarIcon className="h-3 w-3" />
                {format(new Date(post.publishDate), "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {post.excerpt || post.content.substring(0, 150) + "..."}
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="p-0 h-auto font-medium text-primary hover:text-primary/80 hover:bg-transparent"
                onClick={() => setLocation(`/blog/${post.slug}`)}
              >
                Read more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}