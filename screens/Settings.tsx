import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ImageBackground,
  Share,
} from "react-native";
import {
  Appbar,
  Card,
  Divider,
  Menu,
  Button,
  SegmentedButtons,
} from "react-native-paper";
import { Icon } from "@rneui/themed";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useSettings } from "../context/SettingsContext";
import { createThemedStyles, getThemedColors } from "../utils/theme";
import Constants from "expo-constants";

// Type for navigation params
type RootStackParamList = {
  [key: string]: any;
};

type SettingsNavigationProp = NavigationProp<RootStackParamList>;

const Settings: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const { settings, updateSettings, resetSettings, isLoading } = useSettings();

  // Create themed styles based on current settings - recalculate when settings change
  const themedStyles = useMemo(() => createThemedStyles(settings), [settings]);
  const colors = useMemo(
    () => getThemedColors(settings.isDarkMode),
    [settings.isDarkMode]
  );

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
      closeMenu();
    }
  };

  const handleFontSizeChange = async (size: "small" | "medium" | "large") => {
    try {
      await updateSettings({ fontSize: size });
    } catch (error) {
      console.error("Error updating font size:", error);
    }
  };

  const handleThemeToggle = async (value: boolean) => {
    try {
      await updateSettings({ isDarkMode: value });
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  const handleKeepScreenOnToggle = async (value: boolean) => {
    try {
      await updateSettings({ keepScreenOn: value });
    } catch (error) {
      console.error("Error updating keep screen on setting:", error);
    }
  };

  const handleResetSettings = async () => {
    try {
      await resetSettings();
    } catch (error) {
      console.error("Error resetting settings:", error);
    }
  };

  const backgroundImg = require("../assets/images/back.png");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={settings.isDarkMode ? "light" : "dark"} />
      <ImageBackground
        source={backgroundImg}
        style={[styles.container, themedStyles.container]}>
        {/* Dark overlay for dark mode */}
        {settings.isDarkMode && <View style={styles.darkOverlay} />}

        {/* Custom Header */}
        <Appbar.Header
          style={{ backgroundColor: colors.headerBackground }}
          statusBarHeight={0}
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
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button"
            accessibilityHint="Opens the navigation drawer"
          />
          <Appbar.Content
            title="Settings"
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
            accessibilityHint="Opens menu with navigation options"
          />
        </Appbar.Header>

        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Settings options"
          accessibilityRole="scrollbar"
          accessibilityHint="Scroll to view all available settings">
          {/* Font Size Settings */}
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, fontSize: settings.textSize + 4 },
                ]}
                accessibilityRole="header">
                📝 Text & Display
              </Text>
              <Divider
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              <Text
                style={[
                  styles.settingLabel,
                  { color: colors.text, fontSize: settings.textSize },
                ]}>
                Font Size
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                    fontSize: settings.textSize - 2,
                  },
                ]}>
                Choose your preferred text size for better readability
              </Text>

              <SegmentedButtons
                value={settings.fontSize}
                onValueChange={(value) =>
                  handleFontSizeChange(value as "small" | "medium" | "large")
                }
                buttons={[
                  {
                    value: "small",
                    label: "Small",
                    icon: "format-size",
                  },
                  {
                    value: "medium",
                    label: "Medium",
                    icon: "format-size",
                  },
                  {
                    value: "large",
                    label: "Large",
                    icon: "format-size",
                  },
                ]}
                style={{ marginVertical: 16 }}
                theme={{
                  colors: {
                    primary: colors.primary,
                    onSurface: colors.text,
                    surface: colors.surface,
                    outline: colors.border,
                  },
                }}
              />

              <Text
                style={[
                  styles.previewText,
                  {
                    fontSize: settings.textSize,
                    color: colors.text,
                    backgroundColor: colors.background,
                  },
                ]}
                accessibilityLabel="Font size preview text"
                accessibilityRole="text">
                Sample text: "Amazing grace how sweet the sound..."
              </Text>
            </Card.Content>
          </Card>

          {/* Theme Settings */}
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, fontSize: settings.textSize + 4 },
                ]}
                accessibilityRole="header">
                🎨 Appearance
              </Text>
              <Divider
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              <View style={styles.switchContainer}>
                <View style={styles.switchTextContainer}>
                  <Text
                    style={[
                      styles.settingLabel,
                      { color: colors.text, fontSize: settings.textSize },
                    ]}>
                    Dark Mode
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color: colors.textSecondary,
                        fontSize: settings.textSize - 2,
                      },
                    ]}>
                    Switch to dark theme for comfortable reading in low light
                  </Text>
                </View>
                <Switch
                  value={settings.isDarkMode}
                  onValueChange={handleThemeToggle}
                  trackColor={{ false: "#e0e0e0", true: colors.primary }}
                  thumbColor={settings.isDarkMode ? "#fff" : "#f4f3f4"}
                  style={styles.switch}
                  accessibilityLabel={
                    settings.isDarkMode
                      ? "Dark mode enabled"
                      : "Dark mode disabled"
                  }
                  accessibilityRole="switch"
                  accessibilityHint="Toggles between light and dark theme throughout the app"
                />
              </View>

              <View style={styles.switchContainer}>
                <View style={styles.switchTextContainer}>
                  <Text
                    style={[
                      styles.settingLabel,
                      { color: colors.text, fontSize: settings.textSize },
                    ]}>
                    Keep Screen On
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color: colors.textSecondary,
                        fontSize: settings.textSize - 2,
                      },
                    ]}>
                    Prevent device from auto-locking while reading hymns
                  </Text>
                </View>
                <Switch
                  value={settings.keepScreenOn}
                  onValueChange={handleKeepScreenOnToggle}
                  trackColor={{ false: "#e0e0e0", true: colors.primary }}
                  thumbColor={settings.keepScreenOn ? "#fff" : "#f4f3f4"}
                  style={styles.switch}
                  accessibilityLabel={
                    settings.keepScreenOn
                      ? "Keep screen on enabled"
                      : "Keep screen on disabled"
                  }
                  accessibilityRole="switch"
                  accessibilityHint="Toggles whether the screen stays awake while reading hymns"
                />
              </View>
            </Card.Content>
          </Card>

          {/* App Info */}
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, fontSize: settings.textSize + 4 },
                ]}
                accessibilityRole="header">
                ℹ️ App Information
              </Text>
              <Divider
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>
                  Version:
                </Text>
                <Text
                  style={[styles.infoValue, { color: colors.textSecondary }]}>
                  {Constants.expoConfig?.version}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>
                  Developer:
                </Text>
                <Text
                  style={[styles.infoValue, { color: colors.textSecondary }]}>
                  Alpha Zigara
                </Text>
              </View>

              <Button
                mode="outlined"
                onPress={handleResetSettings}
                style={[styles.resetButton, { borderColor: colors.primary }]}
                labelStyle={[styles.resetButtonText, { color: colors.primary }]}
                icon="restore"
                accessibilityLabel="Reset settings to default"
                accessibilityRole="button"
                accessibilityHint="Resets all app settings to their original default values">
                Reset to Default
              </Button>
            </Card.Content>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Customize your AOG Hymns experience 🎵
            </Text>
          </View>
        </ScrollView>

        {/* Menu */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={{ backgroundColor: colors.surface, borderRadius: 8 }}
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
          <Divider />
          <Menu.Item
            key="menu-item-4"
            onPress={() => navigateAndCloseMenu("About")}
            title="About"
            leadingIcon="information"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="About - View app information and credits"
          />
          <Menu.Item
            key="menu-item-5"
            onPress={shareApp}
            title="Share"
            leadingIcon="share"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
            accessibilityLabel="Share App - Share AOG Hymns with others"
          />
        </Menu>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(31, 31, 31, 0.8)",
    zIndex: 0,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#762006",
    marginBottom: 12,
  },
  divider: {
    marginBottom: 16,
    backgroundColor: "#e0e0e0",
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  previewText: {
    fontFamily: "Poppins-Regular",
    color: "#333",
    textAlign: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    fontStyle: "italic",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
  },
  resetButton: {
    marginTop: 16,
    borderColor: "#762006",
  },
  resetButtonText: {
    color: "#762006",
    fontFamily: "Poppins-Bold",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins-Regular",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
});

export default Settings;
