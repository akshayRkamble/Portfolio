import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  User, 
  Save,
  ImageIcon,
  FileIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { 
  insertAboutInfoSchema, 
  type AboutInfo, 
  type InsertAboutInfo 
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Extended schema for form validation
const aboutFormSchema = insertAboutInfoSchema.extend({});

type AboutFormValues = z.infer<typeof aboutFormSchema>;

export default function AboutManager() {
  const { toast } = useToast();

  // Query about info
  const { data: aboutInfo, isLoading, error } = useQuery<AboutInfo | undefined>({
    queryKey: ["/api/about"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/about");
        if (response.status === 404) {
          console.log("About info not found, returning empty object");
          return undefined;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch about information");
        }
        return response.json();
      } catch (err) {
        console.error("Error fetching about info:", err);
        return undefined;
      }
    },
  });

  // Create/update about info mutation
  const updateAboutMutation = useMutation({
    mutationFn: async (data: InsertAboutInfo) => {
      const response = await apiRequest("POST", "/api/admin/about", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({
        title: "Success",
        description: "About information updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      headline: aboutInfo?.headline || "",
      bio: aboutInfo?.bio || "",
      profileImageUrl: aboutInfo?.profileImageUrl || "",
      resumeUrl: aboutInfo?.resumeUrl || "",
    },
    values: {
      headline: aboutInfo?.headline || "",
      bio: aboutInfo?.bio || "",
      profileImageUrl: aboutInfo?.profileImageUrl || "",
      resumeUrl: aboutInfo?.resumeUrl || "",
    },
  });

  // Update form values when data loads
  const onSubmit = (data: AboutFormValues) => {
    updateAboutMutation.mutate(data as InsertAboutInfo);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">About Section Management</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Update your bio, headline, and other personal information.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500">Loading about information...</p>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Headline *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Full Stack Developer with expertise in React and Node.js" 
                            required 
                          />
                        </FormControl>
                        <FormDescription>
                          This appears prominently on your profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biography *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Write a detailed biography about yourself here..." 
                            className="min-h-[200px]" 
                            required
                          />
                        </FormControl>
                        <FormDescription>
                          A detailed description of your professional background and skills
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="profileImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Image URL</FormLabel>
                          <div className="flex gap-4 items-start">
                            <div className="flex-1">
                              <FormControl>
                                <Input 
                                  {...field} 
                                  value={field.value || ""}
                                  placeholder="https://example.com/profile.jpg" 
                                />
                              </FormControl>
                              <FormDescription>
                                Link to your profile image
                              </FormDescription>
                              <FormMessage />
                            </div>
                            {field.value ? (
                              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 border flex-shrink-0">
                                <img 
                                  src={field.value} 
                                  alt="Profile Preview" 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = ""; 
                                    (e.target as HTMLImageElement).className = "hidden";
                                    e.currentTarget.parentElement!.classList.add("flex", "items-center", "justify-center");
                                    const placeholder = document.createElement("div");
                                    placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>';
                                    e.currentTarget.parentElement!.appendChild(placeholder);
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gray-100 border flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="resumeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume URL</FormLabel>
                          <div className="flex gap-4 items-start">
                            <div className="flex-1">
                              <FormControl>
                                <Input 
                                  {...field} 
                                  value={field.value || ""}
                                  placeholder="https://example.com/resume.pdf" 
                                />
                              </FormControl>
                              <FormDescription>
                                Link to your downloadable resume
                              </FormDescription>
                              <FormMessage />
                            </div>
                            <div className="h-12 w-12 bg-gray-100 border rounded flex items-center justify-center flex-shrink-0">
                              <FileIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={updateAboutMutation.isPending || !form.formState.isValid}
                    className="w-full md:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateAboutMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}