import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Trophy, 
  Pencil, 
  Trash2, 
  PlusCircle, 
  CalendarIcon,
  Search,
  ImageIcon
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { 
  insertAchievementSchema, 
  type Achievement, 
  type InsertAchievement 
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Extended schema for form validation
const achievementFormSchema = insertAchievementSchema.extend({
  date: z.date().optional().nullable(),
});

type AchievementFormValues = z.infer<typeof achievementFormSchema>;

export default function AchievementsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  
  const { toast } = useToast();

  // Query achievements
  const { data: achievements = [], isLoading, error: achievementsError } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/achievements");
        if (!response.ok) {
          console.error("Failed to fetch achievements:", response.status, response.statusText);
          return [];
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching achievements:", error);
        toast({
          title: "Error",
          description: "Failed to load achievements. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  // Create achievement mutation
  const createAchievementMutation = useMutation({
    mutationFn: async (data: InsertAchievement) => {
      const response = await apiRequest("POST", "/api/admin/achievements", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Success",
        description: "Achievement created successfully",
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

  // Update achievement mutation
  const updateAchievementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAchievement> }) => {
      const response = await apiRequest("PUT", `/api/admin/achievements/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      setIsEditDialogOpen(false);
      setCurrentAchievement(null);
      toast({
        title: "Success",
        description: "Achievement updated successfully",
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

  // Delete achievement mutation
  const deleteAchievementMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/achievements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      toast({
        title: "Success",
        description: "Achievement deleted successfully",
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

  // Create form
  const createForm = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: null,
      imageUrl: "",
      sortOrder: 0,
    },
  });

  // Edit form
  const editForm = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: null,
      imageUrl: "",
      sortOrder: 0,
    },
  });

  const handleEditAchievement = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    
    editForm.reset({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date ? new Date(achievement.date) : null,
      imageUrl: achievement.imageUrl || "",
      sortOrder: achievement.sortOrder,
    });
    
    setIsEditDialogOpen(true);
  };

  const handleDeleteAchievement = (achievement: Achievement) => {
    deleteAchievementMutation.mutate(achievement.id);
  };

  const onCreateSubmit = (data: AchievementFormValues) => {
    // Convert the date to ISO string if it exists
    const formattedData = {
      ...data,
      date: data.date ? data.date.toISOString() : null,
    };
    
    createAchievementMutation.mutate(formattedData as InsertAchievement);
  };

  const onEditSubmit = (data: AchievementFormValues) => {
    if (!currentAchievement) return;
    
    // Convert the date to ISO string if it exists
    const formattedData = {
      ...data,
      date: data.date ? data.date.toISOString() : null,
    };
    
    updateAchievementMutation.mutate({ 
      id: currentAchievement.id, 
      data: formattedData as Partial<InsertAchievement> 
    });
  };

  // Filter achievements based on search term
  const filteredAchievements = achievements.filter(achievement => 
    achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Achievements Management</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Add and update your professional and personal achievements.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search achievements..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Achievement</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievement Title *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Best Employee Award" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Details about this achievement"
                            className="min-h-[100px]"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When this achievement was received
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="sortOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Lower numbers display first
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={createForm.control}
                    name="imageUrl"
                    render={({ field }) => {
                      const fieldValue = field.value ?? "";
                      return (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} value={fieldValue} placeholder="https://example.com/image.jpg" />
                          </FormControl>
                          <FormDescription>
                            URL to an image related to this achievement
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAchievementMutation.isPending || !createForm.formState.isValid}
                  >
                    {createAchievementMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500">Loading achievements...</p>
        </div>
      ) : filteredAchievements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Trophy className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">
              {searchTerm 
                ? "No achievements match your search criteria" 
                : "You haven't added any achievements yet"}
            </p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Achievement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAchievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-medium">{achievement.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{achievement.description}</TableCell>
                    <TableCell>
                      {achievement.date ? format(new Date(achievement.date), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell>
                      {achievement.imageUrl ? (
                        <div className="relative h-8 w-8 rounded overflow-hidden">
                          <img 
                            src={achievement.imageUrl} 
                            alt={achievement.title}
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>{achievement.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditAchievement(achievement)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{achievement.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAchievement(achievement)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Achievement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Achievement</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achievement Title *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Best Employee Award" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Details about this achievement"
                          className="min-h-[100px]"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When this achievement was received
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Lower numbers display first
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="imageUrl"
                  render={({ field }) => {
                    const fieldValue = field.value ?? "";
                    return (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} value={fieldValue} placeholder="https://example.com/image.jpg" />
                        </FormControl>
                        <FormDescription>
                          URL to an image related to this achievement
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateAchievementMutation.isPending || !editForm.formState.isValid}
                >
                  {updateAchievementMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}