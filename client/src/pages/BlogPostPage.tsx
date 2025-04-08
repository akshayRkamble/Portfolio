import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useEffect } from "react";
import { format } from "date-fns";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarIcon, ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog post");
      }
      return response.json();
    },
  });

  // If the post isn't published and we're not in the admin section, redirect to the blog list
  useEffect(() => {
    if (post && !post.published) {
      const path = window.location.pathname;
      if (!path.includes('/admin')) {
        setLocation('/blog');
      }
    }
  }, [post, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container py-16 px-4 mx-auto max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/blog")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </div>
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Blog Post Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => setLocation("/blog")}>View All Posts</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 px-4 mx-auto max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/blog")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Button>
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        {post.featuredImageUrl && (
          <div className="relative h-[300px] w-full overflow-hidden rounded-lg mb-8">
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-8">
          <CalendarIcon className="h-4 w-4" />
          <time dateTime={new Date(post.publishDate).toISOString()}>
            {format(new Date(post.publishDate), "MMMM d, yyyy")}
          </time>
        </div>

        {post.excerpt && (
          <div className="text-xl mb-8 font-medium text-gray-600 dark:text-gray-300 italic">
            {post.excerpt}
          </div>
        )}

        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: formatBlogContent(post.content) }}
        />
      </article>
    </div>
  );
}

// Helper function to format blog content
// This converts newlines to paragraphs for simple formatting
function formatBlogContent(content: string): string {
  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/);
  
  // Convert single newlines to <br> within paragraphs
  const formattedParagraphs = paragraphs.map(para => 
    para.trim().replace(/\n/g, '<br>')
  );
  
  // Wrap each formatted paragraph in <p> tags, filtering out empty paragraphs
  return formattedParagraphs
    .filter(para => para.length > 0)
    .map(para => `<p>${para}</p>`)
    .join('');
}