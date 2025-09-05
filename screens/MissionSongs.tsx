import React, { useEffect, useState, useMemo } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Image,
  Share,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Appbar, FAB, Menu, Divider } from "react-native-paper";
import { useSettings } from "../context/SettingsContext";
import { createThemedStyles, getThemedColors } from "../utils/theme";
import fonts from "../utils/constants/fonts";

// Type for navigation params
type RootStackParamList = {
  ViewMissionsong: {
    song: string;
    title: string;
    number: string;
  };
  [key: string]: any;
};

type MissionSongsNavigationProp = NavigationProp<RootStackParamList>;

const missionSongs = [
  {
    key: "1",
    title: "Africa Back To God",
    number: "1",
    song:
      "\nAfrica Back To God\n We are Singing\n" +
      "Africa Back To God\n We are bringing\n We are singing" +
      "We are bringing\n Africa Back To God.",
  },
  {
    key: "2",
    title: "If You Believe And I Believe",
    number: "2",
    song:
      "\n1\tIf you believe and I believe\n" +
      "\tAnd we together pray\n \tThe Holy Spirit must come down" +
      "\n\tAnd Africa must be saved\n\n2\tAnd Africa must be saved ×2" +
      "\n\tThe Holy Spirit must come down\n \tAnd Africa must be saved",
  },
];

const MissionSongs = () => {
  const backgroundImg = require("../assets/images/back.png");
  const navigation = useNavigation<MissionSongsNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const { settings } = useSettings();

  // Create themed styles based on current settings - recalculate when settings change
  const themedStyles = useMemo(() => createThemedStyles(settings), [settings]);
  const colors = useMemo(() => getThemedColors(settings.isDarkMode), [settings.isDarkMode]);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

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
      console.error("Error sharing app:", error);
    }
  };

  // Handle Back Press to navigate to hymns screen
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("hymns");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ViewMissionsong", {
          song: item.song,
          title: item.title,
          number: item.number,
        })
      }
      activeOpacity={0.7}
      accessibilityLabel={`Mission Song ${item.number}: ${item.title}`}
      accessibilityRole="button"
      accessibilityHint="Double tap to view mission song content">
      <View style={[styles.listItemContainer, themedStyles.listItem]}>
        <Image
          source={require("../assets/images/icon.png")}
          style={{ width: 40, height: 40, borderRadius: 20 }}
          accessibilityLabel="Mission song icon"
          accessibilityRole="image"
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[styles.title, themedStyles.listItemTitle]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              themedStyles.listItemSubtitle,
            ]}>{`Mission Song: ${item.number}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const keyExtractor = (item: any): string => item.key;

  return (
    <>
      <StatusBar style={settings.isDarkMode ? "dark" : "light"} hidden={true} />
      <ImageBackground
        key={`theme-${settings.isDarkMode}-${settings.fontSize}`}
        source={backgroundImg}
        style={[styles.image, themedStyles.container]}>
        {/* Dark overlay for dark mode */}
        {settings.isDarkMode && <View style={styles.darkOverlay} />}
        <Appbar.Header
          style={{
            backgroundColor: colors.headerBackground,
            zIndex: 10,
            position: "relative",
          }}
          statusBarHeight={0}>
          <Appbar.Action
            icon="menu"
            color={colors.text === "#333333" ? "#fff" : colors.text}
            onPress={() => (navigation as any).toggleDrawer?.()}
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button"
            accessibilityHint="Opens the main navigation drawer"
          />
          <Appbar.Content
            title="Mission Songs"
            titleStyle={[
              styles.headerTitle,
              themedStyles.headerTitle,
              { color: colors.text === "#333333" ? "#fff" : colors.text },
            ]}
            color={colors.text === "#333333" ? "#fff" : colors.text}
          />
          <Appbar.Action
            icon="dots-vertical"
            onPress={openMenu}
            iconColor={colors.text === "#333333" ? "#fff" : colors.text}
            accessibilityLabel="Open options menu"
            accessibilityRole="button"
            accessibilityHint="Opens menu with navigation and share options"
          />
        </Appbar.Header>

        <View
          style={[
            styles.descriptionContainer,
            {
              backgroundColor: colors.background,
              zIndex: 5,
              position: "relative",
            },
          ]}
          accessibilityRole="text">
          <Text
            style={[styles.descriptionText, { color: colors.text }]}
            accessibilityLabel="Mission songs description: These are the mission songs of the Back To God Crusade, an outreach arm of the Assemblies Of God Church"
            accessibilityRole="text">
            These are the mission songs of{"\n"} the Back To God Crusade, an
            outreach{"\n"} arm of the Assemblies Of God Church
          </Text>
        </View>

        <FlatList
          data={missionSongs}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContainer,
            {
              backgroundColor: colors.background,
              zIndex: 5,
              position: "relative",
            },
          ]}
          showsVerticalScrollIndicator={false}
          extraData={`${settings.isDarkMode}-${settings.fontSize}`}
          accessibilityLabel="Mission songs list"
          accessibilityRole="list"
          accessibilityHint="List of mission songs. Double tap on any song to view its content."
        />

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
          anchor={{ x: 800, y: 20 }}>
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
            onPress={() => navigateAndCloseMenu("favourites")}
            title="Favourites"
            leadingIcon="heart"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Favourites - Navigate to your favourite hymns and songs"
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
          <Menu.Item
            key="menu-item-5"
            onPress={() => navigateAndCloseMenu("About")}
            title="About"
            leadingIcon="information"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="About - Navigate to app about page"
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
      </ImageBackground>
    </>
  );
};

export default MissionSongs;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    paddingTop: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  listContainer: {
    padding: 16,
    width: "100%",
  },
  listItemContainer: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  number: {
    fontSize: 13,
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
});
