
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

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

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAvatarColor = (username: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return `Yesterday ${format(timestamp, 'HH:mm')}`;
    } else {
      return format(timestamp, 'MMM dd, HH:mm');
    }
  };

  const getMessageStatus = (message: Message) => {
    if (message.username !== currentUser) return null;
    
    if (message.read) {
      return <CheckCheck className="w-3 h-3 text-blue-400" />;
    } else if (message.delivered) {
      return <CheckCheck className="w-3 h-3 text-gray-400" />;
    } else {
      return <Check className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isSystem = message.username === 'System' || message.username === 'ChatBot';
        const isOwn = message.username === currentUser;
        const showDate = index === 0 || 
          !isToday(message.timestamp) && 
          (!messages[index - 1] || !isToday(messages[index - 1].timestamp));
        
        return (
          <div key={message.id}>
            {/* Date separator */}
            {showDate && (
              <div className="flex justify-center mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-blue-200 text-xs">
                  {isToday(message.timestamp) 
                    ? 'Today' 
                    : isYesterday(message.timestamp) 
                    ? 'Yesterday' 
                    : format(message.timestamp, 'MMMM dd, yyyy')
                  }
                </div>
              </div>
            )}

            {isSystem ? (
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-blue-200 text-sm">
                  {message.text}
                </div>
              </div>
            ) : (
              <div className={`flex gap-3 animate-fade-in ${isOwn ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={`${getAvatarColor(message.username)} text-white text-xs font-semibold`}>
                    {message.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex flex-col max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${isOwn ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-2 shadow-lg ${
                    isOwn 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                  }`}>
                    {!isOwn && (
                      <p className="text-xs font-medium mb-1 text-blue-300">
                        {message.username}
                      </p>
                    )}
                    <p className="break-words">{message.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <p className="text-xs text-blue-200">
                      {formatMessageTime(message.timestamp)}
                    </p>
                    {getMessageStatus(message)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
