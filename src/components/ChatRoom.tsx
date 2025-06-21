
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from 'lucide-react';
import { useChatSettings } from '../contexts/ChatSettingsContext';
import AdminChatView from './AdminChatView';
import UserChatView from './UserChatView';
import ChatSettings from './ChatSettings';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
  isOwn?: boolean;
  recipient?: string;
  read?: boolean;
  delivered?: boolean;
}

interface ChatRoomProps {
  username: string;
  roomId: string;
  onLeaveChat: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ username, roomId, onLeaveChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([username]);
  const { userRole } = useChatSettings();
  
  // Check if current user is admin based on username or role
  const isAdmin = userRole === 'admin' || username.toLowerCase().includes('admin') || username.toLowerCase().includes('manager');
  const adminUsers = connectedUsers.filter(user => 
    user.toLowerCase().includes('admin') || user.toLowerCase().includes('manager')
  );

  // Simulate some initial messages
  useEffect(() => {
    const welcomeMessages: Message[] = [
      {
        id: '1',
        username: 'System',
        text: `Welcome to ${roomId}! 🎉`,
        timestamp: new Date(Date.now() - 120000),
        delivered: true,
        read: true,
      },
      {
        id: '2',
        username: 'System',
        text: isAdmin 
          ? 'You have admin privileges. Click on any user to start a private conversation.' 
          : 'You can chat with support staff here. Your messages are private.',
        timestamp: new Date(Date.now() - 60000),
        delivered: true,
        read: true,
      }
    ];
    setMessages(welcomeMessages);

    // Simulate other users joining
    setTimeout(() => {
      const newUsers = isAdmin 
        ? [username, 'Alice', 'Bob', 'Charlie'] 
        : [username, 'Support Team'];
      setConnectedUsers(newUsers);
      
      // Add a welcome message from support if user is not admin
      if (!isAdmin) {
        const supportMessage: Message = {
          id: '3',
          username: 'Support Team',
          text: 'Hello! How can we help you today?',
          timestamp: new Date(Date.now() - 30000),
          recipient: username,
          delivered: true,
          read: false,
        };
        setMessages(prev => [...prev, supportMessage]);
      }
    }, 2000);
  }, [roomId, isAdmin, username]);

  const handleSendMessage = (text: string, targetUser?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      text,
      timestamp: new Date(),
      isOwn: true,
      recipient: targetUser,
      delivered: true,
      read: false,
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Simulate a response for private messages (admin feature)
    if (targetUser && isAdmin) {
      setTimeout(() => {
        const responses = [
          "Thanks for reaching out!",
          "I'll help you with that.",
          "Let me check on that for you.",
          "Sure, I can assist with that.",
          "Got it, working on it now.",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          username: targetUser,
          text: randomResponse,
          timestamp: new Date(),
          recipient: username,
          delivered: true,
          read: false,
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 2000);
    }
    // Simulate admin response for regular users
    else if (!isAdmin && !targetUser) {
      setTimeout(() => {
        if (Math.random() > 0.6) {
          const adminResponses = [
            "Thank you for your message. We'll get back to you shortly.",
            "We've received your request and are reviewing it.",
            "Our team will assist you with this issue.",
            "Thanks for contacting support!",
          ];
          const randomResponse = adminResponses[Math.floor(Math.random() * adminResponses.length)];
          
          const adminResponse: Message = {
            id: (Date.now() + 2).toString(),
            username: 'Support Team',
            text: randomResponse,
            timestamp: new Date(),
            recipient: username,
            delivered: true,
            read: false,
          };
          setMessages(prev => [...prev, adminResponse]);
        }
      }, 1500 + Math.random() * 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {isAdmin ? 'A' : 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">
                {isAdmin ? `Admin Dashboard - ${roomId}` : `Support Chat - ${roomId}`}
              </h1>
              <p className="text-blue-200 text-sm">
                {isAdmin 
                  ? `Managing ${connectedUsers.length - 1} users` 
                  : 'Connected to support'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <ChatSettings />
              </DialogContent>
            </Dialog>
            <Button
              onClick={onLeaveChat}
              variant="outline"
              size="sm"
              className="bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20 hover:text-red-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full">
        {isAdmin ? (
          <AdminChatView
            messages={messages}
            connectedUsers={connectedUsers}
            currentUser={username}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <UserChatView
            messages={messages}
            currentUser={username}
            onSendMessage={handleSendMessage}
            adminUsers={adminUsers}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
