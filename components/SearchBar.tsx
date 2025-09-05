import React, { useRef, useEffect, useCallback, useState } from 'react';
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
  const [inputValue, setInputValue] = useState<string>(searchQuery || "");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-focus when search bar appears
  useEffect(() => {
    if (textInputRef.current) {
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync inputValue with searchQuery when it changes from parent
  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

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
    setInputValue("");
    filterData('');
    
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
       setVisible(false);
    } else {
      setVisible(false);
    }
  }, [filterData, setVisible]);

  const handleTextChange = useCallback((text: string) => {
    // Update input immediately for smooth typing
    setInputValue(text);
    
    // Debounce the filtering
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      filterData(text);
    }, 300);
  }, [filterData]);

  const handleSubmitEditing = useCallback(() => {
    if (onSubmit) {
      onSubmit(inputValue);
    }
    Keyboard.dismiss();
  }, [onSubmit, inputValue]);

  return (
    <View style={styles.searchContainer}>
      <TextInput
        ref={textInputRef}
        value={inputValue}
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    marginRight: 8,
    width: '100%',
  },
  searchContainer: {
    backgroundColor: lightColors.white,
    flexDirection: 'row',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    width: '85%',
  },
  indicator: {
    marginRight: 4,
  },
  closeIcon: {
    padding: 4,
  }
});