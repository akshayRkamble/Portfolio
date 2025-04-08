import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import { 
  Award, 
  Pencil, 
  Trash2, 
  PlusCircle, 
  X, 
  Calendar, 
  Save, 
  Search,
  ExternalLink
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { 
  insertCertificationSchema, 
  type Certification, 
  type InsertCertification 
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Extended schema for form validation
const certificationFormSchema = insertCertificationSchema.extend({
  issueDate: z.string().min(1, "Issue date is required"),
  // Convert timestamp fields to string for form handling
  expiryDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
});

type CertificationFormValues = z.infer<typeof certificationFormSchema>;

export default function CertificationsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCertification, setCurrentCertification] = useState<Certification | null>(null);
  
  const { toast } = useToast();

  // Query certifications
  const { data: certifications = [], isLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
    queryFn: async () => {
      const response = await fetch("/api/certifications");
      if (!response.ok) {
        throw new Error("Failed to fetch certifications");
      }
      return response.json();
    },
  });

  // Create certification mutation
  const createCertificationMutation = useMutation({
    mutationFn: async (data: InsertCertification) => {
      const response = await apiRequest("POST", "/api/admin/certifications", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Certification created successfully",
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

  // Update certification mutation
  const updateCertificationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCertification> }) => {
      const response = await apiRequest("PUT", `/api/admin/certifications/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      setIsEditDialogOpen(false);
      setCurrentCertification(null);
      toast({
        title: "Success",
        description: "Certification updated successfully",
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

  // Delete certification mutation
  const deleteCertificationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/certifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      toast({
        title: "Success",
        description: "Certification deleted successfully",
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
  const createForm = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: {
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: undefined,
      description: "",
      credentialId: "",
      credentialUrl: "",
      imageUrl: "",
      sortOrder: 0,
    },
  });

  // Edit form
  const editForm = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: {
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: undefined,
      description: "",
      credentialId: "",
      credentialUrl: "",
      imageUrl: "",
      sortOrder: 0,
    },
  });

  const handleEditCertification = (certification: Certification) => {
    setCurrentCertification(certification);
    
    // Format dates for the form
    const formatDate = (date: Date | null | undefined) => {
      if (!date) return "";
      return format(new Date(date), "yyyy-MM-dd");
    };
    
    editForm.reset({
      name: certification.name,
      issuer: certification.issuer,
      issueDate: formatDate(certification.issueDate),
      expiryDate: certification.expiryDate ? formatDate(certification.expiryDate) : "",
      description: certification.description || "",
      credentialId: certification.credentialId || "",
      credentialUrl: certification.credentialUrl || "",
      imageUrl: certification.imageUrl || "",
      sortOrder: certification.sortOrder,
    });
    
    setIsEditDialogOpen(true);
  };

  const handleDeleteCertification = (certification: Certification) => {
    deleteCertificationMutation.mutate(certification.id);
  };

  const onCreateSubmit = (data: CertificationFormValues) => {
    // Convert string dates to Date objects for the backend
    const formattedData = {
      ...data,
      issueDate: new Date(data.issueDate),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
    };
    createCertificationMutation.mutate(formattedData as unknown as InsertCertification);
  };

  const onEditSubmit = (data: CertificationFormValues) => {
    if (!currentCertification) return;
    // Convert string dates to Date objects for the backend
    const formattedData = {
      ...data,
      issueDate: new Date(data.issueDate),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
    };
    updateCertificationMutation.mutate({ 
      id: currentCertification.id, 
      data: formattedData as unknown as Partial<InsertCertification> 
    });
  };

  // Filter certifications based on search term
  const filteredCertifications = certifications.filter(cert => 
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Certifications Management</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Add and manage your professional certifications.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search certifications..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Certification</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Certification Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="AWS Certified Developer" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="issuer"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Issuing Organization *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Amazon Web Services" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (if applicable)</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ""}
                            onChange={e => field.onChange(e.target.value || "")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value || ''} 
                            placeholder="Brief description of the certification" 
                            className="min-h-[100px]" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="credentialId"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Credential ID</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} placeholder="ABC123DEF456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="credentialUrl"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Credential URL</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} placeholder="https://example.com/verify/ABC123DEF456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} placeholder="https://example.com/badge.png" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
                    disabled={createCertificationMutation.isPending || !createForm.formState.isValid}
                  >
                    {createCertificationMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500">Loading certifications...</p>
        </div>
      ) : filteredCertifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Award className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">
              {searchTerm 
                ? "No certifications matching your search" 
                : "No certifications found"}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsCreateDialogOpen(true)}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Certification
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Certifications ({filteredCertifications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Issuer</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertifications.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.name}</TableCell>
                      <TableCell>{cert.issuer}</TableCell>
                      <TableCell>
                        {format(new Date(cert.issueDate), "MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditCertification(cert)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Certification</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{cert.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCertification(cert)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          {cert.credentialUrl && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(cert.credentialUrl!, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View Credential</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Certification Name *</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="issuer"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Issuing Organization *</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (if applicable)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value || ""}
                          onChange={e => field.onChange(e.target.value || "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value || ''} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="credentialId"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Credential ID</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="credentialUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Credential URL</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setCurrentCertification(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateCertificationMutation.isPending || !editForm.formState.isValid}
                >
                  {updateCertificationMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}