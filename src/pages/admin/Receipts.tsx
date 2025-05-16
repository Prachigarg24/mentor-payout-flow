
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockData } from "@/lib/mock-data";
import ReceiptsList from "@/components/receipts/ReceiptsList";
import { Button } from "@/components/ui/button";
import { CalendarRange, PlusCircle } from "lucide-react";

const AdminReceipts = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter receipts based on selected status
  const filteredReceipts = statusFilter === "all"
    ? mockData.receipts
    : mockData.receipts.filter((receipt) => receipt.status === statusFilter);
  
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
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Generate Receipt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ReceiptsList receipts={filteredReceipts} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminReceipts;
