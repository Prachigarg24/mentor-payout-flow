
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { mockData } from "@/lib/mock-data";
import { User } from "@/lib/types";
import UsersList from "@/components/messages/UsersList";
import ChatInterface from "@/components/messages/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(mockData.messages);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Count unread messages for each user
  const unreadCounts: Record<string, number> = {};
  mockData.mentors.forEach((mentor) => {
    unreadCounts[mentor.id] = messages.filter(
      (msg) => msg.senderId === mentor.id && msg.receiverId === user?.id && !msg.read
    ).length;
  });

  const handleSelectUser = (selectedUser: User) => {
    setSelectedUser(selectedUser);
    
    // Mark messages from this user as read
    if (user) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.senderId === selectedUser.id && msg.receiverId === user.id && !msg.read
            ? { ...msg, read: true }
            : msg
        )
      );
    }
  };

  const handleSendMessage = (content: string) => {
    if (user && selectedUser) {
      const newMessage = {
        id: uuidv4(),
        senderId: user.id,
        senderName: user.name,
        receiverId: selectedUser.id,
        receiverName: selectedUser.name,
        content,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    }
  };

  return (
    <AdminLayout title="Messages">
      <div className="grid h-[calc(100vh-10rem)] grid-cols-4 gap-4">
        <div className="col-span-1 overflow-hidden rounded-lg border">
          <UsersList
            users={mockData.mentors}
            selectedUserId={selectedUser?.id || null}
            onSelectUser={handleSelectUser}
            unreadCounts={unreadCounts}
          />
        </div>
        <div className="col-span-3 overflow-hidden rounded-lg border">
          <ChatInterface
            messages={messages}
            selectedUser={selectedUser}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
