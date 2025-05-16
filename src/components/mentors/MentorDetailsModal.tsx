
import { User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, DollarSign, FileText } from "lucide-react";

interface MentorDetailsModalProps {
  mentor: User;
  isOpen: boolean;
  onClose: () => void;
}

const MentorDetailsModal = ({ mentor, isOpen, onClose }: MentorDetailsModalProps) => {
  if (!mentor) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{mentor.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>{mentor.email}</span>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="financial">Financial Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p>{mentor.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{mentor.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="capitalize">{mentor.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="font-mono text-xs">{mentor.id}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{formatCurrency(mentor.hourlyRate || 0)}/hr</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">PAN</p>
                <p>{mentor.taxInfo?.pan || "Not provided"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">GST</p>
                <p>{mentor.taxInfo?.gst || "Not provided"}</p>
              </div>
            </div>
            
            <div className="rounded-md border p-3 mt-2">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 mr-2" />
                <p className="text-sm font-medium">Rate Breakdown</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hourly Rate</span>
                  <span>{formatCurrency(mentor.hourlyRate || 0)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>30 Minutes</span>
                  <span>{formatCurrency((mentor.hourlyRate || 0) / 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>15 Minutes</span>
                  <span>{formatCurrency((mentor.hourlyRate || 0) / 4)}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MentorDetailsModal;
