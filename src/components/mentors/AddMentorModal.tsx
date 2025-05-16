
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

interface AddMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMentor: (mentor: User) => void;
}

const AddMentorModal = ({ isOpen, onClose, onAddMentor }: AddMentorModalProps) => {
  const { toast } = useToast();
  const [mentorData, setMentorData] = useState({
    name: "",
    email: "",
    hourlyRate: "",
    pan: "",
    gst: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMentorData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!mentorData.name.trim()) return "Name is required";
    if (!mentorData.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(mentorData.email.trim())) return "Email is invalid";
    if (!mentorData.hourlyRate.trim()) return "Hourly rate is required";
    if (isNaN(Number(mentorData.hourlyRate)) || Number(mentorData.hourlyRate) <= 0) {
      return "Hourly rate must be a positive number";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create new mentor object
      const newMentor: User = {
        id: uuidv4(),
        name: mentorData.name.trim(),
        email: mentorData.email.trim(),
        role: "mentor",
        hourlyRate: Number(mentorData.hourlyRate),
        taxInfo: {
          pan: mentorData.pan.trim() || undefined,
          gst: mentorData.gst.trim() || undefined,
        },
      };
      
      // Pass to parent component
      onAddMentor(newMentor);
      
      toast({
        title: "Success",
        description: "Mentor added successfully!",
      });
      
      // Reset form and close modal
      setMentorData({
        name: "",
        email: "",
        hourlyRate: "",
        pan: "",
        gst: "",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add mentor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Mentor</DialogTitle>
            <DialogDescription>
              Enter the mentor's details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={mentorData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={mentorData.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hourlyRate" className="text-right">
                Hourly Rate *
              </Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                value={mentorData.hourlyRate}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pan" className="text-right">
                PAN
              </Label>
              <Input
                id="pan"
                name="pan"
                value={mentorData.pan}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gst" className="text-right">
                GST
              </Label>
              <Input
                id="gst"
                name="gst"
                value={mentorData.gst}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Mentor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMentorModal;
