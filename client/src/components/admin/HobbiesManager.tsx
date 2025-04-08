import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Heart, 
  Pencil, 
  Trash2, 
  PlusCircle, 
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
import { useToast } from "@/hooks/use-toast";

import { 
  insertHobbySchema, 
  type Hobby, 
  type InsertHobby 
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Extended schema for form validation
const hobbyFormSchema = insertHobbySchema.extend({});

type HobbyFormValues = z.infer<typeof hobbyFormSchema>;

export default function HobbiesManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentHobby, setCurrentHobby] = useState<Hobby | null>(null);
  
  const { toast } = useToast();

  // Query hobbies
  const { data: hobbies = [], isLoading, error: hobbiesError } = useQuery<Hobby[]>({
    queryKey: ["/api/hobbies"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/hobbies");
        if (!response.ok) {
          console.error("Failed to fetch hobbies:", response.status, response.statusText);
          return [];
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching hobbies:", error);
        toast({
          title: "Error",
          description: "Failed to load hobbies. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  // Create hobby mutation
  const createHobbyMutation = useMutation({
    mutationFn: async (data: InsertHobby) => {
      const response = await apiRequest("POST", "/api/admin/hobbies", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hobbies"] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Success",
        description: "Hobby created successfully",
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

  // Update hobby mutation
  const updateHobbyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertHobby> }) => {
      const response = await apiRequest("PUT", `/api/admin/hobbies/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hobbies"] });
      setIsEditDialogOpen(false);
      setCurrentHobby(null);
      toast({
        title: "Success",
        description: "Hobby updated successfully",
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

  // Delete hobby mutation
  const deleteHobbyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/hobbies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hobbies"] });
      toast({
        title: "Success",
        description: "Hobby deleted successfully",
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
  const createForm = useForm<HobbyFormValues>({
    resolver: zodResolver(hobbyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      sortOrder: 0,
    },
  });

  // Edit form
  const editForm = useForm<HobbyFormValues>({
    resolver: zodResolver(hobbyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      sortOrder: 0,
    },
  });

  const handleEditHobby = (hobby: Hobby) => {
    setCurrentHobby(hobby);
    
    editForm.reset({
      name: hobby.name,
      description: hobby.description || "",
      imageUrl: hobby.imageUrl || "",
      sortOrder: hobby.sortOrder,
    });
    
    setIsEditDialogOpen(true);
  };

  const handleDeleteHobby = (hobby: Hobby) => {
    deleteHobbyMutation.mutate(hobby.id);
  };

  const onCreateSubmit = (data: HobbyFormValues) => {
    createHobbyMutation.mutate(data as InsertHobby);
  };

  const onEditSubmit = (data: HobbyFormValues) => {
    if (!currentHobby) return;
    updateHobbyMutation.mutate({ 
      id: currentHobby.id, 
      data: data as Partial<InsertHobby> 
    });
  };

  // Filter hobbies based on search term
  const filteredHobbies = hobbies.filter(hobby => 
    hobby.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (hobby.description && hobby.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Hobbies Management</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Add and update your hobbies and interests.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hobbies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Hobby
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Hobby</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hobby Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Photography" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => {
                      const fieldValue = field.value ?? "";
                      return (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              value={fieldValue}
                              placeholder="A brief description of your hobby"
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
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
                              URL to an image representing this hobby
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
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
                    disabled={createHobbyMutation.isPending || !createForm.formState.isValid}
                  >
                    {createHobbyMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500">Loading hobbies...</p>
        </div>
      ) : filteredHobbies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Heart className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">
              {searchTerm 
                ? "No hobbies match your search criteria" 
                : "You haven't added any hobbies yet"}
            </p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Hobby
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Hobbies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHobbies.map((hobby) => (
                  <TableRow key={hobby.id}>
                    <TableCell className="font-medium">{hobby.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{hobby.description || "—"}</TableCell>
                    <TableCell>
                      {hobby.imageUrl ? (
                        <div className="relative h-8 w-8 rounded overflow-hidden">
                          <img 
                            src={hobby.imageUrl} 
                            alt={hobby.name}
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>{hobby.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditHobby(hobby)}
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
                              <AlertDialogTitle>Delete Hobby</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{hobby.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteHobby(hobby)}
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

      {/* Edit Hobby Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Hobby</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hobby Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Photography" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => {
                    const fieldValue = field.value ?? "";
                    return (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={fieldValue}
                            placeholder="A brief description of your hobby"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="imageUrl"
                    render={({ field }) => {
                      const fieldValue = field.value ?? "";
                      return (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              value={fieldValue}
                              placeholder="https://example.com/image.jpg" 
                            />
                          </FormControl>
                          <FormDescription>
                            URL to an image representing this hobby
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
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
                  disabled={updateHobbyMutation.isPending || !editForm.formState.isValid}
                >
                  {updateHobbyMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}