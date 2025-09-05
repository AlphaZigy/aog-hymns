import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  fontSize: 'small' | 'medium' | 'large';
  isDarkMode: boolean;
  textSize: number;
  keepScreenOn: boolean;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  fontSize: 'medium',
  isDarkMode: false,
  textSize: 16,
  keepScreenOn: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // Calculate textSize based on fontSize if fontSize is being updated
      if (newSettings.fontSize) {
        const textSizes = { small: 13, medium: 16, large: 20 };
        updatedSettings.textSize = textSizes[newSettings.fontSize];
      }
      
      await AsyncStorage.setItem('app_settings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
