
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, User } from 'lucide-react';
import { useChatSettings } from '../contexts/ChatSettingsContext';

interface ChatSettingsProps {
  isAdmin?: boolean;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({ isAdmin = false }) => {
  const { settings, updateSettings, userRole } = useChatSettings();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Chat Settings
            <Badge variant={userRole === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
              {userRole === 'admin' ? (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </>
              ) : (
                <>
                  <User className="w-3 h-3 mr-1" />
                  User
                </>
              )}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emojis">Allow Emojis</Label>
            <Switch
              id="emojis"
              checked={settings.allowEmojis}
              onCheckedChange={(checked) => updateSettings({ allowEmojis: checked })}
              disabled={!isAdmin && userRole !== 'admin'}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="files">Allow File Sharing</Label>
            <Switch
              id="files"
              checked={settings.allowFileSharing}
              onCheckedChange={(checked) => updateSettings({ allowFileSharing: checked })}
              disabled={!isAdmin && userRole !== 'admin'}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Mute Notifications</Label>
            <Switch
              id="notifications"
              checked={settings.muteNotifications}
              onCheckedChange={(checked) => updateSettings({ muteNotifications: checked })}
            />
          </div>

          {(isAdmin || userRole === 'admin') && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2 text-red-600">Admin Controls</h4>
              <div className="text-xs text-gray-500">
                As an admin, you have full control over chat settings and can see all user conversations.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSettings;
