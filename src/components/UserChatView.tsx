
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Shield } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface UserChatViewProps {
  messages: any[];
  currentUser: string;
  onSendMessage: (text: string) => void;
  adminUsers: string[];
}

const UserChatView: React.FC<UserChatViewProps> = ({
  messages,
  currentUser,
  onSendMessage,
  adminUsers
}) => {
  // Filter messages to only show admin/system messages and user's own messages
  const filteredMessages = messages.filter(msg => 
    adminUsers.includes(msg.username) || 
    msg.username === currentUser || 
    msg.username === 'System' ||
    msg.username === 'ChatBot'
  );

  const activeAdmin = adminUsers.find(admin => 
    messages.some(msg => msg.username === admin)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Support Chat</h1>
              <div className="flex items-center gap-2">
                {activeAdmin && (
                  <Badge variant="outline" className="text-green-300 border-green-300 text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    {activeAdmin} (Admin)
                  </Badge>
                )}
                <span className="text-blue-200 text-sm">
                  {adminUsers.length > 0 ? 'Admin available' : 'Waiting for admin...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={filteredMessages} currentUser={currentUser} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <MessageInput 
          onSendMessage={onSendMessage}
          placeholder="Type your message to support..."
        />
        <div className="text-xs text-blue-300 mt-2 text-center">
          Your messages are private and only visible to support staff
        </div>
      </div>
    </div>
  );
};

export default UserChatView;
