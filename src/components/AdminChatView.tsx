
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Shield, Eye, ArrowLeft, Clock, User } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

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

interface AdminChatViewProps {
  messages: Message[];
  connectedUsers: string[];
  currentUser: string;
  onSendMessage: (text: string, targetUser?: string) => void;
}

const AdminChatView: React.FC<AdminChatViewProps> = ({
  messages,
  connectedUsers,
  currentUser,
  onSendMessage
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'all' | 'private'>('dashboard');

  // Get all users who have sent messages (excluding system and current admin)
  const usersWhoWrote = Array.from(new Set(
    messages
      .filter(msg => msg.username !== 'System' && msg.username !== 'ChatBot' && msg.username !== currentUser)
      .map(msg => msg.username)
  ));

  // Get filtered messages based on view mode
  const filteredMessages = selectedUser && viewMode === 'private'
    ? messages.filter(msg => 
        (msg.username === selectedUser && (msg.recipient === currentUser || !msg.recipient)) ||
        (msg.username === currentUser && msg.recipient === selectedUser) ||
        msg.username === 'System'
      )
    : viewMode === 'all' 
    ? messages
    : [];

  const handleUserClick = (user: string) => {
    setSelectedUser(user);
    setViewMode('private');
  };

  const handleBackToDashboard = () => {
    setSelectedUser(null);
    setViewMode('dashboard');
  };

  const handleViewAllChats = () => {
    setSelectedUser(null);
    setViewMode('all');
  };

  const getUnreadCount = (user: string) => {
    return messages.filter(msg => 
      msg.username === user && 
      (msg.recipient === currentUser || !msg.recipient) && 
      !msg.read
    ).length;
  };

  const getLastMessage = (user: string) => {
    const userMessages = messages.filter(msg => 
      (msg.username === user && (msg.recipient === currentUser || !msg.recipient)) ||
      (msg.username === currentUser && msg.recipient === user)
    );
    return userMessages[userMessages.length - 1];
  };

  const getUserMessageCount = (user: string) => {
    return messages.filter(msg => msg.username === user).length;
  };

  const generateUserID = (username: string) => {
    // Generate a consistent ID based on username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      const char = username.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `USR${Math.abs(hash).toString().padStart(6, '0')}`;
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const formatDate = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="flex h-full">
      {/* Admin Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-400" />
            <h2 className="text-white font-semibold">Admin Dashboard</h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col gap-2">
            {viewMode !== 'dashboard' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleBackToDashboard}
                className="justify-start"
              >
                <ArrowLeft className="w-3 h-3 mr-2" />
                Back to Dashboard
              </Button>
            )}
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === 'dashboard' ? 'default' : 'outline'}
                onClick={handleBackToDashboard}
                className="flex-1"
              >
                <Users className="w-3 h-3 mr-1" />
                Dashboard
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'all' ? 'default' : 'outline'}
                onClick={handleViewAllChats}
                className="flex-1"
              >
                <Eye className="w-3 h-3 mr-1" />
                All Chat
              </Button>
            </div>
          </div>

          {/* Dashboard View - Users Who Wrote Messages */}
          {viewMode === 'dashboard' && (
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Active Users ({usersWhoWrote.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {usersWhoWrote.map((user) => {
                  const unreadCount = getUnreadCount(user);
                  const lastMessage = getLastMessage(user);
                  const messageCount = getUserMessageCount(user);
                  const userID = generateUserID(user);
                  
                  return (
                    <Card
                      key={user}
                      className="p-3 cursor-pointer transition-all bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="space-y-2">
                        {/* User Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <span className="text-white text-sm font-medium">{user}</span>
                              <p className="text-xs text-blue-300">ID: {userID}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* User Stats */}
                        <div className="flex justify-between text-xs text-gray-300">
                          <span>{messageCount} messages</span>
                          {lastMessage && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                        </div>

                        {/* Last Message Preview */}
                        {lastMessage && (
                          <div className="bg-white/5 rounded p-2">
                            <p className="text-xs text-gray-300 truncate">
                              {lastMessage.username === currentUser ? 'You: ' : `${lastMessage.username}: `}
                              {lastMessage.text}
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
                
                {usersWhoWrote.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No users have sent messages yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connected Users (for all other views) */}
          {viewMode !== 'dashboard' && (
            <div>
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Connected Users ({connectedUsers.filter(u => u !== currentUser).length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {connectedUsers.filter(u => u !== currentUser).map((user) => {
                  const unreadCount = getUnreadCount(user);
                  const lastMessage = getLastMessage(user);
                  const isSelected = selectedUser === user;
                  
                  return (
                    <Card
                      key={user}
                      className={`p-3 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-500/20 border-blue-500/50' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white text-sm font-medium truncate">{user}</span>
                              {lastMessage && (
                                <span className="text-xs text-blue-200">
                                  {formatTime(lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <p className="text-xs text-gray-300 truncate">
                                {lastMessage.username === currentUser ? 'You: ' : ''}
                                {lastMessage.text}
                              </p>
                            )}
                          </div>
                        </div>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs ml-2">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-white font-medium mb-2">Admin Actions</h4>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Users className="w-3 h-3 mr-2" />
                Manage Users
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <MessageCircle className="w-3 h-3 mr-2" />
                Export Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold">
                {viewMode === 'private' && selectedUser 
                  ? `Private Chat with ${selectedUser}` 
                  : viewMode === 'all'
                  ? 'All Conversations'
                  : 'Admin Dashboard'
                }
              </h2>
              <p className="text-blue-200 text-sm">
                {viewMode === 'private' && selectedUser 
                  ? `Private conversation with ${selectedUser} (ID: ${generateUserID(selectedUser)})` 
                  : viewMode === 'all'
                  ? `${filteredMessages.length} total messages`
                  : `Monitoring ${usersWhoWrote.length} active users`
                }
              </p>
            </div>
            {selectedUser && viewMode === 'private' && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <Badge variant="outline" className="text-blue-300 border-blue-300">
                  {selectedUser} - Online
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {(viewMode === 'all' || viewMode === 'private') && (
          <>
            <div className="flex-1 overflow-hidden">
              <MessageList messages={filteredMessages} currentUser={currentUser} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
              <MessageInput 
                onSendMessage={(text) => onSendMessage(text, selectedUser || undefined)}
                placeholder={
                  selectedUser 
                    ? `Message ${selectedUser}...` 
                    : "Send message to all users..."
                }
              />
            </div>
          </>
        )}

        {/* Dashboard Welcome */}
        {viewMode === 'dashboard' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-blue-200 mb-4">
                Monitor user activity and manage conversations
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{usersWhoWrote.length}</div>
                  <div className="text-blue-200">Active Users</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{messages.length}</div>
                  <div className="text-blue-200">Total Messages</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatView;
