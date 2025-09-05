import { StyleSheet } from 'react-native';
import { AppSettings } from '../context/SettingsContext';

export interface ThemedColors {
  background: string;
  surface: string;
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  cardBackground: string;
  headerBackground: string;
  error: string;
  success: string;
}

export const lightTheme: ThemedColors = {
  background: 'transparent',
  surface: '#ffffff',
  primary: '#762006',
  text: '#333333',
  textSecondary: '#666666',
  border: '#e0e0e0',
  cardBackground: '#ffffff',
  headerBackground: '#762006',
  error: '#d32f2f',
  success: '#2e7d32',
};

export const darkTheme: ThemedColors = {
  background: '#1f1f1f',
  surface: '#1e1e1e',
  primary: '#bb86fc',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  border: '#333333',
  cardBackground: '#2d2d2d',
  headerBackground: '#1f1f1f',
  error: '#cf6679',
  success: '#4caf50',
};

export const getThemedColors = (isDarkMode: boolean): ThemedColors => {
  return isDarkMode ? darkTheme : lightTheme;
};

export const getFontSizes = (fontSize: 'small' | 'medium' | 'large') => {
  const multiplier = fontSize === 'small' ? 0.9 : fontSize === 'large' ? 1.2 : 1;
  
  return {
    tiny: Math.round(10 * multiplier),
    small: Math.round(12 * multiplier),
    medium: Math.round(14 * multiplier),
    normal: Math.round(16 * multiplier),
    large: Math.round(18 * multiplier),
    xlarge: Math.round(20 * multiplier),
    xxlarge: Math.round(24 * multiplier),
    huge: Math.round(28 * multiplier),
    title: Math.round(22 * multiplier),
    subtitle: Math.round(16 * multiplier),
    caption: Math.round(12 * multiplier),
  };
};

export const createThemedStyles = (settings: AppSettings) => {
  const colors = getThemedColors(settings.isDarkMode);
  const fontSizes = getFontSizes(settings.fontSize);
  
  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    surface: {
      backgroundColor: colors.surface,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      elevation: 4,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginBottom: 16,
    },
    
    // Header styles
    header: {
      backgroundColor: colors.headerBackground,
    },
    headerTitle: {
      fontFamily: 'Poppins-Bold',
      fontSize: fontSizes.large,
      color: '#fff',
    },
    
    // Text styles
    title: {
      fontSize: fontSizes.normal,
      color: colors.text,
      fontFamily: 'Poppins-Bold',
    },
    subtitle: {
      fontSize: fontSizes.medium,
      color: colors.textSecondary,
      fontFamily: 'Poppins-Regular',
    },
    body: {
      fontSize: fontSizes.normal,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      lineHeight: fontSizes.normal * 1.4,
    },
    caption: {
      fontSize: fontSizes.small,
      color: colors.textSecondary,
      fontFamily: 'Poppins-Regular',
    },
    
    // Hymn content styles
    hymnTitle: {
      fontSize: fontSizes.xlarge,
      color: colors.text,
      fontFamily: 'Poppins-Bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    hymnText: {
      fontSize: fontSizes.normal,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      lineHeight: fontSizes.normal * 1.6,
      textAlign: 'justify',
      marginBottom: 12,
    },
    hymnVerse: {
      fontSize: fontSizes.normal,
      color: colors.text,
      fontFamily: 'Poppins-Regular',
      lineHeight: fontSizes.normal * 1.6,
      marginBottom: 16,
    },
    
    // List item styles
    listItem: {
      backgroundColor: 'transparent', 
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    listItemTitle: {
      fontSize: fontSizes.normal,
      color: colors.text,
      fontFamily: 'Poppins-Bold',
    },
    listItemSubtitle: {
      fontSize: fontSizes.medium,
      color: colors.textSecondary,
      fontFamily: 'Poppins-Regular',
    },
    
    // Button styles
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    buttonText: {
      fontSize: fontSizes.normal,
      color: '#fff',
      fontFamily: 'Poppins-Bold',
      textAlign: 'center',
    },
    
    // Input styles
    searchInput: {
      fontSize: fontSizes.normal,
      color: colors.text,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    
    // Empty state styles
    emptyText: {
      fontSize: fontSizes.large,
      color: colors.textSecondary,
      textAlign: 'center',
      fontFamily: 'Poppins-Regular',
      marginTop: 16,
    },
    emptySubText: {
      fontSize: fontSizes.medium,
      color: colors.textSecondary,
      textAlign: 'center',
      fontFamily: 'Poppins-Regular',
      marginTop: 8,
      fontStyle: 'italic',
    },
  });
};
