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
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
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
  ViewMissionsong: {
    title: string;
    number: string;
    song: string;
  };
  MissionSongs: undefined;
  [key: string]: any;
};

type ViewMissionsongRouteProp = RouteProp<
  RootStackParamList,
  "ViewMissionsong"
>;
type ViewMissionsongNavigationProp = NavigationProp<RootStackParamList>;

interface ViewMissionsongProps {
  route?: ViewMissionsongRouteProp;
  navigation?: ViewMissionsongNavigationProp;
}

const ViewMissionsong: React.FC<ViewMissionsongProps> = ({ route }) => {
  const navigation = useNavigation<ViewMissionsongNavigationProp>();
  const { favourites, addFavourite, removeFavourite, isFavourite } =
    useFavourites();
  const { settings } = useSettings();
  const [menuVisible, setmenuVisible] = React.useState(false);

  // Create themed styles based on current settings - recalculate when settings change
  const themedStyles = useMemo(() => createThemedStyles(settings), [settings]);
  const colors = useMemo(
    () => getThemedColors(settings.isDarkMode),
    [settings.isDarkMode]
  );
  const [iconScale] = useState(new Animated.Value(1));

  if (!route) {
    return null; // or some error component
  }

  const { title, number, song } = route.params;

  // Create mission song object for favourites operations
  const currentSong: Hymn = {
    title,
    number,
    hymn: song,
    key: number,
  };

  const isCurrentlyFavourite = isFavourite(number);

  const openMenu = () => setmenuVisible(true);
  const closeMenu = () => setmenuVisible(false);

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
      removeFavourite(currentSong);
    } else {
      addFavourite(currentSong);
    }
  }, [
    isCurrentlyFavourite,
    addFavourite,
    removeFavourite,
    currentSong,
    animateIcon,
  ]);

  const navigateAndCloseMenu = (screenName: string) => {
    closeMenu();
    navigation.navigate(screenName);
  };

  // Improved text selection handler
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  const handleLongPress = useCallback(() => {
    setSelectionEnabled(true);
    // Provide haptic feedback to indicate selection mode is enabled
    if (require('expo-haptics')) {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const handleTextLayout = useCallback(() => {
    // Reset selection state when text layout changes
    setSelectionEnabled(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = (): boolean => {
        navigation.navigate("MissionSongs");
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  // Handle screen wake based on settings
  useFocusEffect(
    useCallback(() => {
      if (settings.keepScreenOn) {
        activateKeepAwakeAsync();
      }

      return () => {
        // Always deactivate on cleanup to ensure screen doesn't stay awake
        deactivateKeepAwake();
      };
    }, [settings.keepScreenOn])
  );

  // Handle setting changes while screen is focused
  useEffect(() => {
    if (settings.keepScreenOn) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [settings.keepScreenOn]);

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
      console.error("Error sharing app:", error);
    }
  };

  const shareSong = useCallback(async (): Promise<void> => {
    try {
      const result = await Share.share({
        message: `${title}\nMission Song: ${number}\n\n${song} \n\nCheck out AOG Hymns app! 🎵\nDownload it from Google Play Store use the link below\n📱 Get it now!\n\nhttps://play.google.com/store/apps/details?id=com.aogzim.hymns`,
        title: title,
      });

      if (result.action === Share.sharedAction) {
        closeMenu(); // Close menu after sharing
      }
    } catch (error) {
      console.error("Error sharing song:", error);
      Alert.alert("Error", "Failed to share song");
    }
  }, [title, number, song]);

  const handleBackPress = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <StatusBar style={settings.isDarkMode ? "dark" : "light"} hidden={true} />
      <ImageBackground
        source={backgroundImg}
        style={[styles.image, themedStyles.container]}>
        {/* Dark overlay for dark mode */}
        {settings.isDarkMode && <View style={styles.darkOverlay} />}
        <Appbar.Header
          style={{
            backgroundColor: colors.headerBackground,
          }}
          statusBarHeight={0}
          theme={{
            colors: {
              primary: colors.headerBackground,
              onSurface: colors.text === "#333333" ? "#fff" : colors.text,
              text: colors.text === "#333333" ? "#fff" : colors.text,
            },
          }}>
          <Appbar.BackAction
            onPress={handleBackPress}
            color={colors.text === "#333333" ? "#fff" : colors.text}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Go back to mission songs list"
          />
          <Appbar.Content
            title={`${number}  ${title}`}
            color={colors.text === "#333333" ? "#fff" : colors.text}
            titleStyle={[
              themedStyles.headerTitle,
              {
                fontFamily: fonts.Oswald,
                fontSize: 22,
                color: colors.text === "#333333" ? "#fff" : colors.text,
              },
            ]}
          />
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <Appbar.Action
              icon={isCurrentlyFavourite ? "heart" : "heart-outline"}
              onPress={toggleFavourite}
              color={
                isCurrentlyFavourite
                  ? "#ff4444"
                  : colors.text === "#333333"
                  ? "#fff"
                  : colors.text
              }
              accessibilityLabel={
                isCurrentlyFavourite
                  ? "Remove from favourites"
                  : "Add to favourites"
              }
              accessibilityRole="button"
              accessibilityHint={
                isCurrentlyFavourite
                  ? "Double tap to remove this mission song from favourites"
                  : "Double tap to add this mission song to favourites"
              }
            />
          </Animated.View>
        </Appbar.Header>

        <ScrollView
          style={[
            styles.scrollView,
            {
              backgroundColor: settings.isDarkMode
                ? "transparent"
                : "transparent",
            },
          ]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Mission song content"
          accessibilityRole="scrollbar"
          accessibilityHint="Scroll to read the complete mission song text">
          <View
            style={[
              styles.songContainer,
              {
                backgroundColor: settings.isDarkMode
                  ? "transparent"
                  : "transparent",
              },
            ]}>
            <Text
              style={[
                themedStyles.hymnText,
                styles.song,
                { 
                  color: colors.text,
                  fontSize: settings.textSize,
                },
              ]}
              selectable={true}
              onLongPress={handleLongPress}
              onTextLayout={handleTextLayout}
              accessibilityLabel={`Mission Song ${number}: ${title}`}
              accessibilityRole="text"
              accessibilityHint="Long press on text to select and copy">
              {song}
            </Text>
          </View>
        </ScrollView>

        <FAB
          icon="menu"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={openMenu}
          color={colors.text === "#333333" ? "#fff" : colors.text}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
          accessibilityHint="Opens navigation menu with options for Mission Songs, Hymns, Favourites, Settings, and Share"
        />

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={{ backgroundColor: colors.surface, borderRadius: 8 }}
          anchor={{ x: 200, y: 1500 }}>
          <Menu.Item
            key="menu-item-1"
            onPress={() => navigateAndCloseMenu("HymnsScreen")}
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
            accessibilityLabel="Mission Songs - Navigate to mission songs list"
          />
          <Menu.Item
            key="menu-item-3"
            onPress={() => navigateAndCloseMenu("favourites")}
            title="Favourites"
            leadingIcon="heart"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Favourites - Navigate to your favourite hymns and songs"
          />
          <Menu.Item
            key="menu-item-5"
            onPress={() => navigateAndCloseMenu("Settings")}
            title="Settings"
            leadingIcon="cog"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Settings - Navigate to app settings"
          />
          <Menu.Item
            key="menu-item-6"
            onPress={() => navigateAndCloseMenu("About")}
            title="About"
            leadingIcon="information"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="About - Navigate to about screen"
          />
          <Divider />
          <Menu.Item
            key="menu-item-4"
            onPress={shareSong}
            title="Share This Song"
            leadingIcon="share"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Share This Song - Share this mission song with others"
          />
        </Menu>
      </ImageBackground>
    </>
  );
};

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
  songContainer: {
    padding: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    width: "100%",
    height: "100%",
  },
  song: {
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
    bottom: 50,
  },
  hymn: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "condensedBold",
  },
  searchContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    width: "100%",
    justifyContent: "space-around",
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1f1f1f",
  },
});

export default ViewMissionsong;
