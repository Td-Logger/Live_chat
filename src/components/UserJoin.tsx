
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Zap } from 'lucide-react';

interface UserJoinProps {
  onJoinChat: (username: string, roomId: string) => void;
}

const UserJoin: React.FC<UserJoinProps> = ({ onJoinChat }) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomId.trim()) {
      onJoinChat(username.trim(), roomId.trim());
    }
  };

  const handleQuickJoin = (room: string) => {
    if (username.trim()) {
      onJoinChat(username.trim(), room);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">ChatApp</h1>
            <p className="text-blue-200">Connect and chat in real-time</p>
          </div>
        </div>

        {/* Join Form */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl">Join a Chat Room</CardTitle>
            <CardDescription className="text-blue-200">
              Enter your details to start chatting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Your Name</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Room ID</label>
                <Input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 transition-all duration-200 transform hover:scale-105"
              >
                <Zap className="w-4 h-4 mr-2" />
                Join Chat
              </Button>
            </form>

            {/* Quick Join Options */}
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-blue-200 text-sm">Quick join popular rooms</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleQuickJoin('general')}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all"
                  disabled={!username.trim()}
                >
                  <Users className="w-3 h-3 mr-1" />
                  General
                </Button>
                <Button
                  onClick={() => handleQuickJoin('random')}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all"
                  disabled={!username.trim()}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Random
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-blue-200 text-xs">Real-time</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-blue-200 text-xs">Multi-user</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mx-auto">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-blue-200 text-xs">Instant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserJoin;
