import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Share,
} from "react-native";
import { ListItem, Avatar, Icon } from "@rneui/themed";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useFavourites } from "../context/FavouritesContext";
import { useSettings } from "../context/SettingsContext";
import { createThemedStyles, getThemedColors } from "../utils/theme";
import { Hymn } from "../types";
import { Menu, Appbar, Button, Divider, Portal } from "react-native-paper";
import LottieView from "lottie-react-native";

const logo = require("../assets/images/icon.png");

// Type for navigation params
type RootStackParamList = {
  ViewHymn: {
    hymn: string;
    title: string;
    number: string;
  };
  [key: string]: any;
};

type FavouritesScreenNavigationProp = NavigationProp<RootStackParamList>;

const Favourites: React.FC = () => {
  const { favourites, isLoading } = useFavourites();
  const { settings } = useSettings();
  const [menuVisible, setmenuVisible] = React.useState(false);
  const [anchorPosition, setAnchorPosition] = React.useState({ x: 0, y: 0 });
  const [error, setError] = React.useState<string | null>(null);
  const navigation = useNavigation<FavouritesScreenNavigationProp>();

  // Create themed styles based on current settings - recalculate when settings change
  const themedStyles = useMemo(() => createThemedStyles(settings), [settings]);
  const colors = useMemo(
    () => getThemedColors(settings.isDarkMode),
    [settings.isDarkMode]
  );

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
      setError("Failed to share app. Please try again.");
      closeMenu();
      console.error("Error sharing app:", error);
    }
  };

  const renderItem = React.useCallback(
    ({ item }: { item: Hymn }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ViewHymn", {
            hymn: item.hymn,
            title: item.title,
            number: item.number,
          })
        }
        activeOpacity={0.7}>
        <View
          style={[
            styles.listItemContainer,
            themedStyles.listItem,
            { backgroundColor: colors.surface },
          ]}>
          <Image
            source={require("../assets/icon.png")}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text
              style={[
                styles.title,
                themedStyles.listItemTitle,
                { color: colors.text },
              ]}>
              {item.title}
            </Text>
            <Text
              style={[
                styles.subtitle,
                themedStyles.listItemSubtitle,
                { color: colors.textSecondary },
              ]}>{`Hymn: ${item.number}`}</Text>
          </View>
          <Icon name="favorite" type="material" color="red" size={24} />
        </View>
      </TouchableOpacity>
    ),
    [navigation, themedStyles, colors]
  );

  const keyExtractor = React.useCallback(
    (item: Hymn): string => item.number,
    []
  );

  return (
    <View style={[styles.container, themedStyles.container]}>
      <Appbar.Header
        style={[styles.header, { backgroundColor: colors.headerBackground }]}
        theme={{
          colors: {
            primary: colors.headerBackground,
            onSurface: colors.text === "#333333" ? "#fff" : colors.text,
            text: colors.text === "#333333" ? "#fff" : colors.text,
          },
        }}>
        <Appbar.Action
          icon="menu"
          color={colors.text === "#333333" ? "#fff" : colors.text}
          onPress={() => (navigation as any).toggleDrawer?.()}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        />
        <Appbar.Content
          title="Favourites"
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
        />
      </Appbar.Header>

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        contentStyle={{ backgroundColor: colors.surface, borderRadius: 8 }}
        anchor={{ x: 300, y: 60 }}>
        <Menu.Item
          key="menu-item-1"
          onPress={() => navigateAndCloseMenu("MissionSongs")}
          title="Mission Songs"
          leadingIcon="music-note"
          style={{ backgroundColor: colors.surface }}
          titleStyle={{ color: colors.text }}
        />
        <Menu.Item
          key="menu-item-2"
          onPress={() => navigateAndCloseMenu("hymns")}
          title="Hymns"
          leadingIcon="music"
          style={{ backgroundColor: colors.surface }}
          titleStyle={{ color: colors.text }}
        />
        <Menu.Item
          key="menu-item-4"
          onPress={() => navigateAndCloseMenu("Settings")}
          title="Settings"
          leadingIcon="cog"
          style={{ backgroundColor: colors.surface }}
          titleStyle={{ color: colors.text }}
        />
        <Menu.Item
          key="menu-item-5"
          onPress={() => navigateAndCloseMenu("About")}
          title="About"
          leadingIcon="info"
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
        />
      </Menu>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading...
          </Text>
        </View>
      )}
      {favourites.length > 0 ? (
        <FlatList
          data={favourites}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContainer,
            { backgroundColor: colors.background },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : !isLoading ? (
        <View
          style={[
            styles.emptyContainer,
            { backgroundColor: colors.background },
          ]}>
          <LottieView
            source={require("../assets/emptybox.json")}
            style={styles.emptyAnimation}
            autoPlay
            loop
          />
          <Text style={[styles.emptyText, themedStyles.emptyText]}>
            No favourite hymns yet!
          </Text>
          <Text style={[styles.emptySubtext, themedStyles.emptySubText]}>
            Tap the heart icon on any hymn to add it to your favourites.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
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
  listItem: {
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyAnimation: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    lineHeight: 24,
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: "Poppins-Regular",
  },
});
