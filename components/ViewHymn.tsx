import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  Share,
  View,
  BackHandler,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Appbar, FAB, Menu, Divider } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import fonts from "../utils/constants/fonts";
import { useFavourites } from "../context/FavouritesContext";
import { useSettings } from "../context/SettingsContext";
import { createThemedStyles, getThemedColors } from "../utils/theme";
import { Hymn } from "../types";

const backgroundImg = require("../assets/images/back.png");

// Type definitions for route parameters
type RootStackParamList = {
  ViewHymn: {
    title: string;
    number: string;
    hymn: string;
  };
  hymns: undefined;
  [key: string]: any;
};

type ViewHymnRouteProp = RouteProp<RootStackParamList, "ViewHymn">;
type ViewHymnNavigationProp = NavigationProp<RootStackParamList>;

interface ViewHymnProps {
  route?: ViewHymnRouteProp;
  navigation?: ViewHymnNavigationProp;
}

const ViewHymn: React.FC<ViewHymnProps> = ({ route }) => {
  const navigation = useNavigation<ViewHymnNavigationProp>();
  const { favourites, addFavourite, removeFavourite, isFavourite } =
    useFavourites();
  const { settings } = useSettings();
  const [menuVisible, setMenuVisible] = useState(false);
  const [iconScale] = useState(new Animated.Value(1));

  // Create themed styles based on current settings - recalculate when settings change
  const themedStyles = useMemo(() => createThemedStyles(settings), [settings]);
  const colors = useMemo(() => getThemedColors(settings.isDarkMode), [settings.isDarkMode]);
  const [isTextSelectable, setIsTextSelectable] = useState(false);

  if (!route) {
    return null; // or some error component
  }

  const { title, number, hymn } = route.params;

  // Create hymn object for favourites operations
  const currentHymn: Hymn = {
    title,
    number,
    hymn,
    key: number, // assuming key is same as number
  };

  const isCurrentlyFavourite = isFavourite(number);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const navigateAndCloseMenu = (screenName: string) => {
    closeMenu();
    navigation.navigate(screenName);
  };

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

  const toggleFavourite = useCallback((): void => {
    animateIcon();
    if (isCurrentlyFavourite) {
      removeFavourite(currentHymn);
    } else {
      addFavourite(currentHymn);
    }
  }, [
    isCurrentlyFavourite,
    addFavourite,
    removeFavourite,
    currentHymn,
    animateIcon,
  ]);

  // Simple long press handler - just enable text selection
  const onLongPress = useCallback((): void => {
    setIsTextSelectable(true);
  }, []);

  // Disable text selection when tapping normally
  const onPress = useCallback((): void => {
    if (isTextSelectable) {
      setIsTextSelectable(false);
    }
  }, [isTextSelectable]);

  useFocusEffect(
    useCallback(() => {
      const backAction = (): boolean => {
        navigation.navigate("hymns");
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  const shareHymn = useCallback(async (): Promise<void> => {
    try {
      const result = await Share.share({
        message: `${title}\nHymn: ${number}\n\n${hymn} \n\nCheck out AOG Hymns app! 🎵\nDownload it from Google Play Store use the link below\n📱 Get it now!\n\nhttps://play.google.com/store/apps/details?id=com.aogzim.hymns`,
        title: title,
      });

      if (result.action === Share.sharedAction) {
        closeMenu(); // Close menu after sharing
      }
    } catch (error) {
      console.error("Error sharing hymn:", error);
      Alert.alert("Error", "Failed to share hymn");
    }
  }, [title, number, hymn]);

  const handleBackPress = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <StatusBar style={settings.isDarkMode ? "light" : "dark"} hidden={true} />
      <ImageBackground
        source={backgroundImg}
        style={[styles.image, themedStyles.container]}>
        <Appbar.Header
          style={{ backgroundColor: colors.headerBackground }}
          statusBarHeight={0}
          theme={{
            colors: {
              primary: colors.headerBackground,
              onSurface: colors.text === '#333333' ? '#fff' : colors.text,
              text: colors.text === '#333333' ? '#fff' : colors.text,
            },
          }}>
          <Appbar.BackAction 
            onPress={handleBackPress} 
            color={colors.text === '#333333' ? '#fff' : colors.text}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Go back to hymns list"
          />
          <Appbar.Content
            title={`${number}  ${title}`}
            color={colors.text === '#333333' ? '#fff' : colors.text}
            titleStyle={[
              themedStyles.headerTitle,
              { 
                fontSize: themedStyles.headerTitle.fontSize,
                color: colors.text === '#333333' ? '#fff' : colors.text
              },
            ]}
          />
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <Appbar.Action
              icon={isCurrentlyFavourite ? "heart" : "heart-outline"}
              onPress={toggleFavourite}
              color={isCurrentlyFavourite ? "#ff4444" : (colors.text === '#333333' ? '#fff' : colors.text)}
              accessibilityLabel={isCurrentlyFavourite ? "Remove from favourites" : "Add to favourites"}
              accessibilityRole="button"
              accessibilityHint={isCurrentlyFavourite ? "Double tap to remove this hymn from favourites" : "Double tap to add this hymn to favourites"}
            />
          </Animated.View>
        </Appbar.Header>

        <ScrollView
          style={[
            styles.scrollView,
            {
              backgroundColor: settings.isDarkMode
                ? "#1f1f1f"
                : "transparent",
            },
          ]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Hymn content"
          accessibilityRole="scrollbar"
          accessibilityHint="Scroll to read the complete hymn text">
          <TouchableOpacity
            onLongPress={onLongPress}
            onPress={onPress}
            style={[
              styles.hymnContainer,
              {
                backgroundColor: settings.isDarkMode
                  ? "#1f1f1f"
                  : "transparent",
              },
            ]}
            activeOpacity={0.8}
            accessibilityLabel={`Hymn text: ${title}`}
            accessibilityRole="text"
            accessibilityHint="Long press to enable text selection for copying">
            <Text
              style={[themedStyles.hymnText, styles.hymn, { color: colors.text }]}
              selectable={isTextSelectable}
              accessibilityLabel={`Hymn ${number}: ${title}`}
              accessibilityRole="text">
              {hymn}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <FAB
          icon="menu"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={openMenu}
          color={colors.text === '#333333' ? '#fff' : colors.text}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
          accessibilityHint="Opens navigation menu with options for Hymns, Mission Songs, Favourites, Settings, and Share"
        />

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={{ backgroundColor: colors.surface, borderRadius: 8 }}
          anchor={{ x: 700, y: 1200 }}>
          <Menu.Item
            key="menu-item-1"
            onPress={() => navigateAndCloseMenu("hymns")}
            title="Hymns"
            leadingIcon="music"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Hymns - Navigate to hymns list"
          />
          <Menu.Item
            key="menu-item-2"
            onPress={() => navigateAndCloseMenu("MissionSongs")}
            title="Mission Songs"
            leadingIcon="music-note"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Mission Songs - Navigate to mission songs"
          />
          <Menu.Item
            key="menu-item-3"
            onPress={() => navigateAndCloseMenu("favourites")}
            title="Favourites"
            leadingIcon="heart"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Favourites - Navigate to your favourite hymns"
          />
          <Menu.Item
            key="menu-item-4"
            onPress={() => navigateAndCloseMenu("Settings")}
            title="Settings"
            leadingIcon="cog"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Settings - Navigate to app settings"
          />
          <Divider />
          <Menu.Item
            key="menu-item-5"
            onPress={shareHymn}
            title="Share This Hymn"
            leadingIcon="share"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Share This Hymn - Share this hymn with others"
          />
        </Menu>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  statusBarBackground: {
    height: 44, // Typical status bar height
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  headerContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
  number: {
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: 0,
    padding: 0,
  },
  scrollContent: {
    paddingLeft: 20,
  },
  hymnContainer: {
    padding: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    width: "100%",
    height: "100%",
  },
  hymn: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: fonts.Outfit,
    fontWeight: "700",
    textAlign: "left",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ViewHymn;
