
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatSettings {
  allowEmojis: boolean;
  allowFileSharing: boolean;
  muteNotifications: boolean;
  theme: 'light' | 'dark';
}

interface ChatSettingsContextType {
  settings: ChatSettings;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
  userRole: 'user' | 'admin';
  setUserRole: (role: 'user' | 'admin') => void;
}

const ChatSettingsContext = createContext<ChatSettingsContextType | undefined>(undefined);

export const ChatSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ChatSettings>({
    allowEmojis: true,
    allowFileSharing: true,
    muteNotifications: false,
    theme: 'dark',
  });
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ChatSettingsContext.Provider value={{ settings, updateSettings, userRole, setUserRole }}>
      {children}
    </ChatSettingsContext.Provider>
  );
};

export const useChatSettings = () => {
  const context = useContext(ChatSettingsContext);
  if (!context) {
    throw new Error('useChatSettings must be used within ChatSettingsProvider');
  }
  return context;
};
