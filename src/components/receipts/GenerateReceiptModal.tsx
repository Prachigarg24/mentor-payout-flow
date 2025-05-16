
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { User, Session, Receipt, PayoutBreakdown } from "@/lib/types";
import { mockData } from "@/lib/mock-data";
import { v4 as uuidv4 } from "uuid";
import { formatCurrency } from "@/lib/utils";

interface GenerateReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (receipt: Receipt) => void;
}

const GenerateReceiptModal = ({ isOpen, onClose, onGenerate }: GenerateReceiptModalProps) => {
  const { toast } = useToast();
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [platformFeePercent, setPlatformFeePercent] = useState("10");
  const [taxPercent, setTaxPercent] = useState("18");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState<{
    sessions: Session[];
    baseAmount: number;
    platformFee: number;
    taxAmount: number;
    finalAmount: number;
  } | null>(null);

  const mentors = mockData.mentors;
  
  // Get mentor by ID
  const getSelectedMentor = (): User | undefined => {
    return mentors.find(mentor => mentor.id === selectedMentorId);
  };

  // Get sessions for selected mentor and date range
  const getSessionsForMentor = (): Session[] => {
    if (!selectedMentorId || !startDate || !endDate) return [];
    
    return mockData.sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return (
        session.mentorId === selectedMentorId &&
        session.status === "completed" &&
        sessionDate >= startDate &&
        sessionDate <= endDate
      );
    });
  };

  // Calculate payout breakdown
  const calculatePayoutBreakdown = (sessions: Session[]): PayoutBreakdown | null => {
    if (sessions.length === 0) return null;
    
    const baseAmount = sessions.reduce((total, session) => {
      return total + ((session.hourlyRate / 60) * session.duration);
    }, 0);
    
    const platformFeePercentage = Number(platformFeePercent);
    const taxPercentage = Number(taxPercent);
    
    const platformFee = (baseAmount * platformFeePercentage) / 100;
    const taxAmount = (baseAmount * taxPercentage) / 100;
    const finalAmount = baseAmount - platformFee - taxAmount;
    
    return {
      baseAmount,
      platformFee,
      platformFeePercentage,
      taxAmount,
      taxPercentage,
      finalAmount,
    };
  };

  // Generate preview data
  const handleGeneratePreview = () => {
    if (!selectedMentorId || !startDate || !endDate) {
      toast({
        title: "Missing Information",
        description: "Please select a mentor and date range",
        variant: "destructive",
      });
      return;
    }
    
    const sessions = getSessionsForMentor();
    
    if (sessions.length === 0) {
      toast({
        title: "No Sessions Found",
        description: "No completed sessions found for this mentor in the selected date range",
        variant: "destructive",
      });
      setPreviewData(null);
      return;
    }
    
    const breakdown = calculatePayoutBreakdown(sessions);
    
    if (!breakdown) {
      toast({
        title: "Calculation Error",
        description: "Could not calculate payout breakdown",
        variant: "destructive",
      });
      return;
    }
    
    setPreviewData({
      sessions,
      baseAmount: breakdown.baseAmount,
      platformFee: breakdown.platformFee,
      taxAmount: breakdown.taxAmount,
      finalAmount: breakdown.finalAmount,
    });
    
    toast({
      title: "Preview Generated",
      description: `Found ${sessions.length} sessions with a total payout of ${formatCurrency(breakdown.finalAmount)}`,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!previewData) {
      toast({
        title: "Missing Preview",
        description: "Please generate a preview first",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedMentor = getSelectedMentor();
      
      if (!selectedMentor) {
        throw new Error("Mentor not found");
      }
      
      const breakdown = calculatePayoutBreakdown(previewData.sessions);
      
      if (!breakdown || !startDate || !endDate) {
        throw new Error("Calculation error");
      }
      
      // Create new receipt
      const newReceipt: Receipt = {
        id: uuidv4(),
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        dateGenerated: new Date().toISOString(),
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        sessions: previewData.sessions,
        breakdown,
        status: "pending",
        notes: notes.trim() || undefined,
      };
      
      // Pass to parent component
      onGenerate(newReceipt);
      
      toast({
        title: "Success",
        description: "Receipt generated successfully!",
      });
      
      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedMentorId("");
    setPlatformFeePercent("10");
    setTaxPercent("18");
    setNotes("");
    setStartDate(new Date());
    setEndDate(new Date());
    setPreviewData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Receipt</DialogTitle>
          <DialogDescription>
            Create a new payout receipt for a mentor
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mentor">Select Mentor</Label>
            <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentors.map(mentor => (
                  <SelectItem key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platformFee">Platform Fee (%)</Label>
              <Input
                id="platformFee"
                type="number"
                min="0"
                max="100"
                value={platformFeePercent}
                onChange={(e) => setPlatformFeePercent(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax">Tax (%)</Label>
              <Input
                id="tax"
                type="number"
                min="0"
                max="100"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes for this receipt"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <Button type="button" onClick={handleGeneratePreview}>
            Generate Preview
          </Button>
          
          {previewData && (
            <div className="border rounded-md p-4 mt-2">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Sessions:</span> {previewData.sessions.length}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base Amount</span>
                    <span>{formatCurrency(previewData.baseAmount)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Fee ({platformFeePercent}%)</span>
                    <span>- {formatCurrency(previewData.platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax ({taxPercent}%)</span>
                    <span>- {formatCurrency(previewData.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Final Payout</span>
                    <span>{formatCurrency(previewData.finalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!previewData || isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Generate Receipt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReceiptModal;
