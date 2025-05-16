
import { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ChatInterfaceProps {
  messages: Message[];
  selectedUser: { id: string; name: string } | null;
  onSendMessage: (content: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  selectedUser,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (message.trim() && selectedUser) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter messages for current conversation
  const conversationMessages = messages.filter(
    (msg) =>
      (msg.senderId === user?.id && msg.receiverId === selectedUser?.id) ||
      (msg.receiverId === user?.id && msg.senderId === selectedUser?.id)
  );

  if (!selectedUser) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a user to start messaging
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <h3 className="font-medium">{selectedUser.name}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {conversationMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          conversationMessages.map((msg) => {
            const isCurrentUser = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {formatMessageTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
