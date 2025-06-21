
import React, { useState } from 'react';
import UserJoin from '../components/UserJoin';
import ChatRoom from '../components/ChatRoom';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [isInChat, setIsInChat] = useState<boolean>(false);

  const handleJoinChat = (username: string, room: string) => {
    setCurrentUser(username);
    setRoomId(room);
    setIsInChat(true);
  };

  const handleLeaveChat = () => {
    setCurrentUser('');
    setRoomId('');
    setIsInChat(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {!isInChat ? (
        <UserJoin onJoinChat={handleJoinChat} />
      ) : (
        <ChatRoom 
          username={currentUser} 
          roomId={roomId} 
          onLeaveChat={handleLeaveChat}
        />
      )}
    </div>
  );
};

export default Index;
