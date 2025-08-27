import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  BackHandler,
  Animated,
  View,
  Image,
  Text,
  Share,
} from "react-native";
import { Avatar, Icon, ListItem } from "@rneui/themed";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import HymsData from "../components/HymnsData";
import SearchBar from "../components/SearchBar";
import HighlightText from "../components/HighlightText";
import { Appbar, Button, Portal } from "react-native-paper";
import { useFavourites } from "../context/FavouritesContext";
import { useSettings } from "../context/SettingsContext";
import { createThemedStyles, getThemedColors } from "../utils/theme";
import { searchUtils } from "../utils/searchUtils";
import { Hymn } from "../types";
import fonts from "../utils/constants/fonts";
import { FAB, Menu, Divider } from "react-native-paper";
import LottieView from "lottie-react-native";
import ExitModal from "../components/ExitModal";

// Type for navigation params
type RootStackParamList = {
  ViewHymn: {
    hymn: string;
    title: string;
    number: string;
  };
  [key: string]: any; // Add this to handle drawer navigation
};

type HymnsScreenNavigationProp = NavigationProp<RootStackParamList>;

const backgroundImg = require("../assets/images/back.png");
const logo = require("../assets/icon.png");

const HymnsScreen: React.FC = () => {
  const { favourites, addFavourite, removeFavourite, isFavourite, isLoading } =
    useFavourites();
  const { settings } = useSettings();
  const navigation = useNavigation<HymnsScreenNavigationProp>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [iconScale] = useState(new Animated.Value(1));
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [menuVisible, setmenuVisible] = React.useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  
  // Create themed styles based on current settings - recalculate when settings change
  const themedStyles = useMemo(() => createThemedStyles(settings), [settings]);
  const colors = useMemo(() => getThemedColors(settings.isDarkMode), [settings.isDarkMode]);

  const openMenu = () => setmenuVisible(true);

  const closeMenu = () => setmenuVisible(false);

  const navigateAndCloseMenu = (screenName: string) => {
    closeMenu();
    navigation.navigate(screenName);
  };

  const shareApp = async () => {
    try {
      const result = await Share.share({
        message:
          "Check out AOG Hymns app! 🎵\n\nDownload it from Google Play Store use the link below\n\n📱 Get it now! \n\nhttps://play.google.com/store/apps/details?id=com.aogzim.hymns",
        title: "AOG Hymns - Assemblies of God Hymnal Songs",
      });

      if (result.action === Share.sharedAction) {
        closeMenu();
      }
    } catch (error) {
      handleError("Failed to share app. Please try again.");
      closeMenu();
    }
  };

  // Enhanced search with useMemo for better performance
  const filteredData = useMemo<Hymn[]>(() => {
    if (!searchQuery.trim()) {
      return HymsData as Hymn[];
    }

    // Use enhanced search with scoring for better relevance
    return searchUtils.searchWithScoring(HymsData as Hymn[], searchQuery, {
      searchTitle: true,
      searchNumber: true,
      searchContent: true,
    });
  }, [searchQuery]);

  // Debounce search input for better performance
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Handle hardware back button with professional exit confirmation using useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const backAction = (): boolean => {
        if (isVisible) {
          handleBack();
          return true;
        }
        
        // Show professional exit modal
        setShowExitModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      
      return () => backHandler.remove();
    }, [isVisible])
  );

  const animateIcon = useCallback((): void => {
    Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [iconScale]);

  // Debounced search for better performance
  const filterData = useCallback((text: string): void => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (!text.trim()) {
      setSearchQuery("");
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      setSearchQuery(text);
      setIsSearching(false);
    }, 300);
    
    setSearchTimeout(newTimeout);
  }, [searchTimeout]);

  const handleBack = useCallback((): void => {
    setIsVisible(false);
    setSearchQuery("");
  }, []);

  // Optimized render item with React.memo equivalent
  const renderItem = useCallback(
    ({ item }: { item: Hymn }) => {
      const isHymnFavourite = isFavourite(item.number);

      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ViewHymn", {
              hymn: item.hymn,
              title: item.title,
              number: item.number,
            })
          }
          activeOpacity={0.7}
          accessibilityLabel={`Hymn ${item.number}: ${item.title}`}
          accessibilityRole="button"
          accessibilityHint="Double tap to view hymn content">
          <View style={[styles.listItemContainer, themedStyles.listItem]}>
            <Image
              source={require("../assets/icon.png")}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              accessibilityLabel="Hymn icon"
              accessibilityRole="image"
            />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <HighlightText
                text={item.title}
                highlight={searchQuery}
                style={StyleSheet.flatten([styles.title, themedStyles.listItemTitle])}
                highlightStyle={styles.highlightText}
              />
              <HighlightText
                text={`Hymn: ${item.number}`}
                highlight={searchQuery}
                style={StyleSheet.flatten([styles.subtitle, themedStyles.listItemSubtitle])}
                highlightStyle={styles.highlightText}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [searchQuery, isLoading, navigation, iconScale, themedStyles, isFavourite]
  );

  const keyExtractor = useCallback((item: Hymn): string => {
    return item.number;
  }, []);

  // Add getItemLayout for better performance
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 76,
    offset: 76 * index,
    index,
  }), []);

  // Error handling wrapper
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    console.error('HymnsScreen Error:', errorMessage);
  }, []);

  // Exit modal handlers
  const handleCancelExit = useCallback(() => {
    setShowExitModal(false);
  }, []);

  const handleConfirmExit = useCallback(() => {
    setShowExitModal(false);
    // The ExitModal component will handle the actual exit
  }, []);

  return (
    <>
      <StatusBar style={settings.isDarkMode ? "light" : "dark"} hidden={true} />
      <ImageBackground
        key={`theme-${settings.isDarkMode}-${settings.fontSize}`}
        source={backgroundImg}
        style={[styles.image]}>
        {/* Dark overlay for dark mode only */}
        {settings.isDarkMode && (
          <View style={styles.darkOverlay} />
        )}
        <Appbar.Header
          style={{ backgroundColor: colors.headerBackground }}
          statusBarHeight={0}>
          {isVisible ? (
            <>
              <Appbar.BackAction
                onPress={handleBack}
                color={colors.text === '#333333' ? '#fff' : colors.text}
                accessibilityLabel="Close search"
                accessibilityRole="button"
              />
              <SearchBar
                setVisible={setIsVisible}
                filterData={filterData}
                isSearching={isSearching}
                searchQuery={searchQuery}
              />
            </>
          ) : (
            <>
              <Appbar.Action
                icon="menu"
                color={colors.text === '#333333' ? '#fff' : colors.text}
                onPress={() => (navigation as any).toggleDrawer?.()}
                accessibilityLabel="Open menu"
                accessibilityRole="button"
              />
              <Appbar.Content
                title="AOG Hymns"
                titleStyle={[styles.headerTitle, { color: colors.text === '#333333' ? '#fff' : colors.text }]}
                color={colors.text === '#333333' ? '#fff' : colors.text}
              />
              <Appbar.Action
                icon="magnify"
                color={colors.text === '#333333' ? '#fff' : colors.text}
                onPress={() => setIsVisible(true)}
                accessibilityLabel="Open search"
                accessibilityRole="button"
              />
            </>
          )}
        </Appbar.Header>
        {/* Hymns List */}
        {filteredData.length === 0 ? (
          <View
            style={[styles.emptyState, { backgroundColor: colors.background }]}
            accessibilityLabel="No hymns found"
            accessibilityRole="text">
            {isSearching ? (
              <>
                <LottieView
                  source={require("../assets/notfound.json")}
                  style={styles.searchingAnimation}
                  autoPlay
                  loop
                />
                <Text 
                  style={[styles.emptyText, themedStyles.emptyText]}
                  accessibilityLabel="Searching for hymns"
                  accessibilityRole="text">
                  Searching...
                </Text>
              </>
            ) : searchQuery ? (
              <>
                <LottieView
                  source={require("../assets/notfound.json")}
                  style={styles.notFoundAnimation}
                  autoPlay
                  loop={false}
                />
                <Text 
                  style={[styles.emptyText, themedStyles.emptyText]}
                  accessibilityLabel={`No hymns found for ${searchQuery}`}
                  accessibilityRole="text">
                  No hymns found for "{searchQuery}"
                </Text>
                <Text 
                  style={[styles.emptySubText, themedStyles.emptySubText]}
                  accessibilityLabel="Try searching with different keywords"
                  accessibilityRole="text">
                  Try searching with different keywords
                </Text>
              </>
            ) : (
              <Text 
                style={[styles.emptyText, themedStyles.emptyText]}
                accessibilityLabel="No hymns available"
                accessibilityRole="text">
                No hymns available.
              </Text>
            )}
          </View>
        ) : (
          <FlashList
            data={filteredData}
            keyExtractor={keyExtractor}
            estimatedItemSize={76}
            renderItem={renderItem}
            removeClippedSubviews={true}
            extraData={`${settings.isDarkMode}-${settings.fontSize}`}
            accessibilityLabel="Hymns list"
            accessibilityRole="list"
            accessibilityHint="List of hymns. Double tap on any hymn to view its content."
          />
        )}
        <FAB
          icon="menu"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={openMenu}
          color={colors.text === '#333333' ? '#fff' : colors.text}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
          accessibilityHint="Opens navigation menu with options for Mission Songs, Favourites, Settings, and Share"
        />

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={{ backgroundColor: colors.surface, borderRadius: 8 }}
          anchor={{ x: 700, y: 1200 }}>
          <Menu.Item
            key="menu-item-1"
            onPress={() => navigateAndCloseMenu("MissionSongs")}
            title="Mission Songs"
            leadingIcon="music-note"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Mission Songs - Navigate to Mission Songs screen"
          />
          <Menu.Item
            key="menu-item-2"
            onPress={() => navigateAndCloseMenu("favourites")}
            title="Favourites"
            leadingIcon="heart"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Favourites - Navigate to your favourite hymns"
          />
          <Menu.Item
            key="menu-item-4"
            onPress={() => navigateAndCloseMenu('Settings')}
            title="Settings"
            leadingIcon="cog"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Settings - Navigate to app settings"
          />
          <Divider />
          <Menu.Item
            key="menu-item-3"
            onPress={shareApp}
            title="Share"
            leadingIcon="share"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Share app - Share this app with others"
          />
        </Menu>
        
        {/* Professional Exit Modal */}
        <ExitModal
          visible={showExitModal}
          onCancel={handleCancelExit}
          onExit={handleConfirmExit}
        />
      </ImageBackground>
    </>
  );
};

export default HymnsScreen;

const styles = StyleSheet.create({
  statusBarBackground: {
    height: 44,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  image: {
    flex: 1,
    paddingTop: 0, 
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1f1f1f',
    zIndex: 0,
  },
  searchContainer: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    width: "100%",
    justifyContent: "space-around",
  },
  headerContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    width: "100%",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginHorizontal: 10,
    fontFamily: "Poppins-Bold",
  },
  searchIcon: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 5,
  },
  leftContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.MontserratBlack,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.MontserratRegular,
  },
  backIcon: {
    marginRight: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginTop: 8,
    fontStyle: "italic",
  },
  searchingAnimation: {
    width: 150,
    height: 150,
  },
  notFoundAnimation: {
    width: 200,
    height: 200,
  },
  highlightText: {
    backgroundColor: "#ffeb3b",
    fontWeight: "bold",
  },
  listItemContainer: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
  },
  favoriteIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  menuAnchorButton: {
    opacity: 0,
    right: 70,
  },
});
