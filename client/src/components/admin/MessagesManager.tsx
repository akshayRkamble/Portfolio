import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Archive, 
  Trash2, 
  Search,
  EyeOff,
  Eye,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { type ContactMessage } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

export default function MessagesManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<ContactMessage | null>(null);
  
  const { toast } = useToast();

  // Query messages
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
    queryFn: async () => {
      const response = await fetch("/api/admin/messages");
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      return response.json();
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PUT", `/api/admin/messages/${id}/read`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({
        title: "Success",
        description: "Message marked as read",
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

  // Archive message mutation
  const archiveMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PUT", `/api/admin/messages/${id}/archive`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({
        title: "Success",
        description: "Message archived",
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

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({
        title: "Success",
        description: "Message deleted successfully",
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

  const handleViewMessage = (message: ContactMessage) => {
    setCurrentMessage(message);
    setIsViewDialogOpen(true);
    
    // If message is unread, mark it as read
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleArchive = (id: number) => {
    archiveMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Filter messages based on filter and search term
  const filteredMessages = messages.filter(message => {
    // Apply status filter
    if (filter === "unread" && message.read) return false;
    if (filter === "read" && !message.read) return false;
    if (filter === "archived" && !message.archived) return false;
    if (filter === "active" && message.archived) return false;
    
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        message.name.toLowerCase().includes(searchLower) ||
        message.email.toLowerCase().includes(searchLower) ||
        message.subject.toLowerCase().includes(searchLower) ||
        message.message.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          View and manage messages sent through your contact form.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={filter} 
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Mail className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">
              {searchTerm 
                ? "No messages match your search criteria" 
                : filter !== "all"
                  ? `No ${filter} messages found`
                  : "No messages yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id} className={!message.read ? "font-medium bg-gray-50 dark:bg-gray-800/50" : ""}>
                    <TableCell>
                      {message.archived ? (
                        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                          <Archive className="h-3 w-3" />
                          <span>Archived</span>
                        </Badge>
                      ) : !message.read ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>New</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Read</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{message.name}</div>
                      <div className="text-xs text-gray-500">{message.email}</div>
                    </TableCell>
                    <TableCell>{message.subject || "(No subject)"}</TableCell>
                    <TableCell className="text-sm">
                      {message.createdAt && formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        
                        {!message.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleMarkAsRead(message.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        
                        {!message.archived ? (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleArchive(message.id)}
                          >
                            <Archive className="h-4 w-4" />
                            <span className="sr-only">Archive</span>
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled
                          >
                            <EyeOff className="h-4 w-4 text-gray-400" />
                            <span className="sr-only">Archived</span>
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this message? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(message.id)}
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

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentMessage?.subject || "(No subject)"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">From:</p>
              <p>
                {currentMessage?.name} 
                <span className="text-gray-500 ml-2">&lt;{currentMessage?.email}&gt;</span>
              </p>
            </div>
            
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Date:</p>
              <p className="text-gray-700 dark:text-gray-300">
                {currentMessage?.createdAt && new Date(currentMessage.createdAt).toLocaleString()}
              </p>
            </div>
            
            <Separator />
            
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Message:</p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-wrap">
                {currentMessage?.message}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {!currentMessage?.archived ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (currentMessage) handleArchive(currentMessage.id);
                    setIsViewDialogOpen(false);
                  }}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 px-3 py-2">
                  <Archive className="h-3 w-3" />
                  <span>Archived</span>
                </Badge>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this message? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (currentMessage) handleDelete(currentMessage.id);
                        setIsViewDialogOpen(false);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <Button 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}