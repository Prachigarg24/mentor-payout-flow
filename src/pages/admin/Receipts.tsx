
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockData } from "@/lib/mock-data";
import { Receipt } from "@/lib/types";
import ReceiptsList from "@/components/receipts/ReceiptsList";
import GenerateReceiptModal from "@/components/receipts/GenerateReceiptModal";
import { Button } from "@/components/ui/button";
import { CalendarRange, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminReceipts = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [receipts, setReceipts] = useState(mockData.receipts);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Filter receipts based on selected status
  const filteredReceipts = statusFilter === "all"
    ? receipts
    : receipts.filter((receipt) => receipt.status === statusFilter);
  
  const handleOpenGenerateModal = () => {
    setIsGenerateModalOpen(true);
  };
  
  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };
  
  const handleGenerateReceipt = (newReceipt: Receipt) => {
    setReceipts((prevReceipts) => [newReceipt, ...prevReceipts]);
    toast({
      title: "Receipt Generated",
      description: `Receipt for ${newReceipt.mentorName} has been generated successfully.`,
    });
  };
  
  return (
    <AdminLayout title="Receipts">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Receipts</CardTitle>
            <CardDescription>
              Manage and generate payout receipts for mentors
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleOpenGenerateModal}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Generate Receipt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ReceiptsList receipts={filteredReceipts} />
        </CardContent>
      </Card>
      
      <GenerateReceiptModal 
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        onGenerate={handleGenerateReceipt}
      />
    </AdminLayout>
  );
};

export default AdminReceipts;
