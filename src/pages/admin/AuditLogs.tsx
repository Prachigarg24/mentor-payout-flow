
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockData } from "@/lib/mock-data";
import AuditLogTable from "@/components/audit/AuditLogTable";

const AdminAuditLogs = () => {
  const [entityFilter, setEntityFilter] = useState("all");
  
  // Filter logs based on selected entity type
  const filteredLogs = entityFilter === "all"
    ? mockData.auditLogs
    : mockData.auditLogs.filter((log) => log.entityType === entityFilter);
  
  return (
    <AdminLayout title="Audit Logs">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>System Audit Logs</CardTitle>
            <CardDescription>
              Track all system activities and changes
            </CardDescription>
          </div>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="session">Sessions</SelectItem>
              <SelectItem value="receipt">Receipts</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <AuditLogTable logs={filteredLogs} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAuditLogs;
