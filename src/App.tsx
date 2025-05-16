
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSessions from "./pages/admin/Sessions";
import AdminMentors from "./pages/admin/Mentors";
import AdminReceipts from "./pages/admin/Receipts";
import AdminMessages from "./pages/admin/Messages";
import AdminAuditLogs from "./pages/admin/AuditLogs";
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorSessions from "./pages/mentor/Sessions";
import MentorReceipts from "./pages/mentor/Receipts";
import MentorMessages from "./pages/mentor/Messages";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/sessions" element={<ProtectedRoute role="admin"><AdminSessions /></ProtectedRoute>} />
          <Route path="/admin/mentors" element={<ProtectedRoute role="admin"><AdminMentors /></ProtectedRoute>} />
          <Route path="/admin/receipts" element={<ProtectedRoute role="admin"><AdminReceipts /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute role="admin"><AdminAuditLogs /></ProtectedRoute>} />
          
          {/* Mentor Routes */}
          <Route path="/mentor" element={<ProtectedRoute role="mentor"><MentorDashboard /></ProtectedRoute>} />
          <Route path="/mentor/sessions" element={<ProtectedRoute role="mentor"><MentorSessions /></ProtectedRoute>} />
          <Route path="/mentor/receipts" element={<ProtectedRoute role="mentor"><MentorReceipts /></ProtectedRoute>} />
          <Route path="/mentor/messages" element={<ProtectedRoute role="mentor"><MentorMessages /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
