import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Upload, 
  Trash2, 
  Link, 
  FileIcon,
  Copy,
  CheckCircle,
  ImageIcon,
  Search,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import type { Upload as UploadType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
// Define helper functions to avoid import errors
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short',
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
}

export default function MediaUploadsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  // Query uploads
  const { data: uploads = [], isLoading, error: uploadsError } = useQuery<UploadType[]>({
    queryKey: ["/api/admin/uploads"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/admin/uploads", {
          credentials: "include" // Include credentials for authentication
        });
        
        if (response.status === 403) {
          console.log("User not authenticated as admin");
          toast({
            title: "Authentication Required",
            description: "You need to be logged in as an admin to view uploads",
            variant: "destructive",
          });
          return [];
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch uploads");
        }
        
        return response.json();
      } catch (err) {
        console.error("Error fetching uploads:", err);
        return [];
      }
    },
    retry: false,
  });

  // Delete upload mutation
  const deleteUploadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/uploads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/uploads"] });
      toast({
        title: "Success",
        description: "File deleted successfully",
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

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      
      await response.json();
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/uploads"] });
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      
      // Reset the file input
      setFileToUpload(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUpload = (id: number) => {
    deleteUploadMutation.mutate(id);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      toast({
        title: "URL Copied",
        description: "File URL copied to clipboard",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedUrl(null);
      }, 2000);
    });
  };

  // Filter uploads based on search term
  const filteredUploads = uploads.filter(upload => 
    upload.originalName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    upload.mimeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group uploads by type for the tabs
  const imageUploads = filteredUploads.filter(upload => upload.mimeType.startsWith("image/"));
  const documentUploads = filteredUploads.filter(upload => 
    upload.mimeType.includes("pdf") || 
    upload.mimeType.includes("word") || 
    upload.mimeType.includes("excel") || 
    upload.mimeType.includes("text") ||
    upload.mimeType.includes("presentation")
  );
  const otherUploads = filteredUploads.filter(upload => 
    !upload.mimeType.startsWith("image/") && 
    !upload.mimeType.includes("pdf") && 
    !upload.mimeType.includes("word") && 
    !upload.mimeType.includes("excel") && 
    !upload.mimeType.includes("text") &&
    !upload.mimeType.includes("presentation")
  );

  // Get appropriate icon for file type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FileImage className="h-5 w-5" />;
    if (mimeType.includes("pdf") || mimeType.includes("text")) return <FileText className="h-5 w-5" />;
    if (mimeType.includes("video")) return <FileVideo className="h-5 w-5" />;
    if (mimeType.includes("audio")) return <FileAudio className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Media Uploads</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Upload and manage images and other media files for your portfolio.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Upload New File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleUpload}
              disabled={!fileToUpload || isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          {fileToUpload && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Selected file: <span className="font-medium">{fileToUpload.name}</span> ({formatBytes(fileToUpload.size)})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search uploads..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500">Loading media files...</p>
        </div>
      ) : filteredUploads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">
              {searchTerm 
                ? "No files match your search criteria" 
                : "You haven't uploaded any files yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Files ({filteredUploads.length})</TabsTrigger>
            <TabsTrigger value="images">Images ({imageUploads.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documentUploads.length})</TabsTrigger>
            <TabsTrigger value="other">Other ({otherUploads.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <MediaFilesTable 
              uploads={filteredUploads} 
              copyToClipboard={copyToClipboard} 
              copiedUrl={copiedUrl}
              handleDeleteUpload={handleDeleteUpload}
              getFileIcon={getFileIcon}
            />
          </TabsContent>
          
          <TabsContent value="images">
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imageUploads.map(upload => (
                  <div key={upload.id} className="group relative">
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border">
                      <img 
                        src={upload.url} 
                        alt={upload.originalName}
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(upload.url)}
                        >
                          {copiedUrl === upload.url ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete File</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{upload.originalName}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUpload(upload.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{upload.originalName}</p>
                  </div>
                ))}
              </div>
            </div>
            <MediaFilesTable 
              uploads={imageUploads} 
              copyToClipboard={copyToClipboard} 
              copiedUrl={copiedUrl}
              handleDeleteUpload={handleDeleteUpload}
              getFileIcon={getFileIcon}
            />
          </TabsContent>
          
          <TabsContent value="documents">
            <MediaFilesTable 
              uploads={documentUploads} 
              copyToClipboard={copyToClipboard} 
              copiedUrl={copiedUrl}
              handleDeleteUpload={handleDeleteUpload}
              getFileIcon={getFileIcon}
            />
          </TabsContent>
          
          <TabsContent value="other">
            <MediaFilesTable 
              uploads={otherUploads} 
              copyToClipboard={copyToClipboard} 
              copiedUrl={copiedUrl}
              handleDeleteUpload={handleDeleteUpload}
              getFileIcon={getFileIcon}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface MediaFilesTableProps {
  uploads: UploadType[];
  copyToClipboard: (url: string) => void;
  copiedUrl: string | null;
  handleDeleteUpload: (id: number) => void;
  getFileIcon: (mimeType: string) => JSX.Element;
}

function MediaFilesTable({ 
  uploads, 
  copyToClipboard, 
  copiedUrl, 
  handleDeleteUpload,
  getFileIcon
}: MediaFilesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.map((upload) => (
              <TableRow key={upload.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                      {upload.mimeType.startsWith("image/") ? (
                        <div className="h-8 w-8 rounded overflow-hidden">
                          <img 
                            src={upload.url} 
                            alt={upload.originalName}
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      ) : (
                        getFileIcon(upload.mimeType)
                      )}
                    </div>
                    <span className="font-medium truncate max-w-[200px]">{upload.originalName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {upload.mimeType}
                  </Badge>
                </TableCell>
                <TableCell>{formatBytes(upload.size)}</TableCell>
                <TableCell>{formatDate(new Date(upload.createdAt))}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copyToClipboard(upload.url)}
                    >
                      {copiedUrl === upload.url ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Link className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copy URL</span>
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
                          <AlertDialogTitle>Delete File</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{upload.originalName}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUpload(upload.id)}
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
  );
}