import React, { useRef, useEffect, useCallback } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  ActivityIndicator,
  Keyboard,
  KeyboardEvent
} from 'react-native';
import { Icon, lightColors } from '@rneui/themed';

interface SearchBarProps {
  filterData: (query: string) => void;
  setVisible: (visible: boolean) => void;
  isSearching: boolean;
  searchQuery: string;
  onSubmit?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  filterData,
  setVisible,
  isSearching,
  searchQuery,
  onSubmit
}) => {
  const textInputRef = useRef<TextInput>(null);

  // Auto-focus when search bar appears
  useEffect(() => {
    if (textInputRef.current) {
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle keyboard dismiss
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Optional: Handle keyboard hide if needed
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleCloseIcon = useCallback(() => {
    textInputRef.current?.clear();
    filterData('');
    
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
       setVisible(false);
    } else {
      setVisible(false);
    }
  }, [filterData, setVisible]);

  const handleTextChange = useCallback((text: string) => {
    filterData(text);
  }, [filterData]);

  const handleSubmitEditing = useCallback(() => {
    if (onSubmit) {
      onSubmit(searchQuery);
    }
    Keyboard.dismiss();
  }, [onSubmit, searchQuery]);

  return (
    <View style={styles.searchContainer}>
      <TextInput
        ref={textInputRef}
        value={searchQuery}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSubmitEditing}
        placeholder="Search hymns..."
        style={styles.searchBox}
        placeholderTextColor="#666"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search hymns"
        accessibilityHint="Enter hymn title, number, or content to search"
      />
      
      {/* Show loading indicator or close icon */}
      {isSearching ? (
        <ActivityIndicator 
          size="small" 
          color="#000" 
          style={styles.indicator}
          accessibilityLabel="Searching"
        />
      ) : (
        <Icon
          name="close"
          type="material"
          color="#000"
          size={24}
          onPress={handleCloseIcon}
          style={styles.closeIcon}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        />
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBox: {
    fontSize: 16,
    padding: 4,
    width: '70%',
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  searchContainer: {
    backgroundColor: lightColors.white,
    flexDirection: 'row',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  indicator: {
    marginLeft: 8,
  },
  closeIcon: {
    marginLeft: 8,
    padding: 4,
  }
});