
import { useState } from "react";
import { Session } from "@/lib/types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, DollarSign, FileText } from "lucide-react";

interface SessionDetailsModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}

const SessionDetailsModal = ({ session, isOpen, onClose }: SessionDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!session) return null;

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case "live":
        return "Live Session";
      case "evaluation":
        return "Evaluation";
      case "review":
        return "Recording Review";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const calculateSessionAmount = () => {
    return (session.hourlyRate / 60) * session.duration;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
          <DialogDescription>
            {formatDate(session.date)} | {session.mentorName}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Session Type</p>
                <p>{getSessionTypeLabel(session.type)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div>{getStatusBadge(session.status)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(session.date)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Time</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p>{session.duration} minutes</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Session ID</p>
                <p className="font-mono text-xs">{session.id}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="financials" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{formatCurrency(session.hourlyRate)}/hr</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{formatCurrency(calculateSessionAmount())}</span>
                </div>
              </div>
            </div>
            <div className="rounded-md bg-muted p-4 mt-4">
              <p className="text-sm font-medium">Payment Calculation</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Rate</span>
                  <span>{formatCurrency(session.hourlyRate)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>{session.duration} mins</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1 mt-1">
                  <span>Total</span>
                  <span>{formatCurrency(calculateSessionAmount())}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <p className="text-sm font-medium">Session Notes</p>
                </div>
                <div className="rounded-md border p-4">
                  {session.notes ? (
                    <p className="text-sm">{session.notes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No notes available for this session.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {session.status === "pending" && (
            <Button>Mark as Completed</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsModal;
