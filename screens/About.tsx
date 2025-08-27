import React, { useState, useMemo } from "react";
import {
  StatusBar,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
  Share,
  Dimensions,
} from "react-native";
import { Icon } from "@rneui/themed";
import { Appbar, Card, Avatar, Divider, Menu } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSettings } from "../context/SettingsContext";
import { createThemedStyles, getThemedColors } from "../utils/theme";
import fonts from "../utils/constants/fonts";

// Get screen dimensions for responsive design
const { width } = Dimensions.get("window");

// Type for navigation params
type RootStackParamList = {
  [key: string]: any;
};

type AboutNavigationProp = NavigationProp<RootStackParamList>;

const About = () => {
  const navigation = useNavigation<AboutNavigationProp>();
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

  const handleWhatsApp = () => {
    const phoneNumber = "+263785447337";
    const message =
      "Hello, I downloaded your AOG Hymns app and wanted to get in touch.";
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          return Linking.openURL(
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
          );
        }
      })
      .catch((error) => console.error("Failed to open WhatsApp:", error));
  };

  const handleEmail = () => {
    Linking.openURL("mailto:info@dubzig.co.zw?subject=AOG Hymns App Feedback");
  };

  const handleWebsite = () => {
    Linking.openURL("https://dubzig.co.zw");
  };

  return (
    <>
      <StatusBar barStyle={settings.isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.headerBackground} />
      <ImageBackground
        source={require("../assets/images/back.png")}
        style={[styles.container, themedStyles.container]}>
        {/* Dark overlay for dark mode */}
        {settings.isDarkMode && (
          <View style={styles.darkOverlay} />
        )}
        {/* Custom Header */}
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
          <Appbar.Action
            icon="menu"
            color={colors.text === '#333333' ? '#fff' : colors.text}
            onPress={() => (navigation as any).toggleDrawer?.()}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
          />
          <Appbar.Content
            title="About"
            titleStyle={[styles.headerTitle, { color: colors.text === '#333333' ? '#fff' : colors.text }]}
            color={colors.text === '#333333' ? '#fff' : colors.text}
          />
          <Appbar.Action
            icon="dots-vertical"
            onPress={openMenu}
            iconColor={colors.text === '#333333' ? '#fff' : colors.text}
          />
        </Appbar.Header>

        <ScrollView
          style={[styles.scrollView, { backgroundColor: 'transparent' }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* App Info Card */}
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.appInfoContainer}>
                <Avatar.Image
                  size={80}
                  source={require("../assets/images/icon.png")}
                  style={styles.appIcon}
                />
                <View style={styles.appDetails}>
                  <Text style={[styles.appName, { color: colors.primary }]}>AOG Hymns</Text>
                  <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Version 1.1.2</Text>
                  <Text style={[styles.appDescription, { color: colors.text }]}>
                    Digital hymnal songs for the Assemblies of God Church
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Acknowledgements Card */}
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>📚 Acknowledgements</Text>
              <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.bodyText, { color: colors.text }]}>
                The Assemblies of God Church hymns was compiled by{" "}
                <Text style={[styles.highlightText, { color: colors.primary }]}>Pastor A. B. Moyo</Text> and
                published by{" "}
                <Text style={[styles.highlightText, { color: colors.primary }]}>
                  The Assemblies Of God National Executive
                </Text>{" "}
                in May 2003, Bulawayo.
              </Text>
              <Text style={[styles.bodyText, { color: colors.text }]}>
                Special thanks to{" "}
                <Text style={[styles.highlightText, { color: colors.primary }]}>Pastor N. Dube</Text> and the
                A.O.G Media team for their contributions to this digital
                project.
              </Text>
            </Card.Content>
          </Card>

          {/* Copyright Card */}
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>🔒 Copyright Notice</Text>
              <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.bodyText, { color: colors.text }]}>
                This application contains content owned by{" "}
                <Text style={[styles.highlightText, { color: colors.primary }]}>
                  The Assemblies Of God Church
                </Text>
                .
              </Text>
              <Text style={[styles.bodyText, { color: colors.text }]}>
                This application is free to use and share for worship and
                educational purposes.
              </Text>
            </Card.Content>
          </Card>

          {/* Developer Card */}
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>👨‍💻 Developer</Text>
              <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.bodyText, { color: colors.text }]}>
                Developed with ❤️ by{" "}
                <Text style={[styles.highlightText, { color: colors.primary }]}>Alpha Zigara</Text>, a
                software engineer and member of the Assemblies Of God Church.
              </Text>
              <Text style={[styles.feedbackText, { color: colors.textSecondary }]}>
                We'd love to hear your feedback and suggestions!
              </Text>
            </Card.Content>
          </Card>

          {/* Contact Card */}
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>📞 Get in Touch</Text>
              <Divider style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={styles.contactContainer}>
                <TouchableOpacity
                  style={[styles.contactButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={handleWebsite}>
                  <View style={styles.contactButtonContent}>
                    <Icon
                      name="language"
                      type="material"
                      color={colors.primary}
                      size={24}
                    />
                    <View style={styles.contactTextContainer}>
                      <Text style={[styles.contactTitle, { color: colors.text }]}>Website</Text>
                      <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
                        Visit our website
                      </Text>
                    </View>
                    <Icon
                      name="chevron-right"
                      type="material"
                      color={colors.textSecondary}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.contactButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={handleEmail}>
                  <View style={styles.contactButtonContent}>
                    <Icon
                      name="email"
                      type="material"
                      color={colors.primary}
                      size={24}
                    />
                    <View style={styles.contactTextContainer}>
                      <Text style={[styles.contactTitle, { color: colors.text }]}>Email</Text>
                      <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
                        Send us an email
                      </Text>
                    </View>
                    <Icon
                      name="chevron-right"
                      type="material"
                      color={colors.textSecondary}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.contactButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={handleWhatsApp}>
                  <View style={styles.contactButtonContent}>
                    <Icon
                      name="chat"
                      type="material"
                      color={colors.primary}
                      size={24}
                    />
                    <View style={styles.contactTextContainer}>
                      <Text style={[styles.contactTitle, { color: colors.text }]}>WhatsApp</Text>
                      <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>Chat with us</Text>
                    </View>
                    <Icon
                      name="chevron-right"
                      type="material"
                      color={colors.textSecondary}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Made with love for the Kingdom of God 🙏
            </Text>
          </View>
        </ScrollView>

        {/* Menu */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          contentStyle={{ backgroundColor: colors.surface, borderRadius: 8 }}
          anchor={{ x: 300, y: 60 }}>
          <Menu.Item
            key="menu-item-1"
            onPress={() => navigateAndCloseMenu("hymns")}
            title="Hymns"
            leadingIcon="music"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
          />
          <Menu.Item
            key="menu-item-2"
            onPress={() => navigateAndCloseMenu("MissionSongs")}
            title="Mission Songs"
            leadingIcon="music-note"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
          />
          <Menu.Item
            key="menu-item-3"
            onPress={() => navigateAndCloseMenu("favourites")}
            title="Favourites"
            leadingIcon="heart"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
          />
          <Menu.Item
            key="menu-item-5"
            onPress={() => navigateAndCloseMenu("Settings")}
            title="Settings"
            leadingIcon="cog"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
          />
          <Divider />
          <Menu.Item
            key="menu-item-4"
            onPress={shareApp}
            title="Share"
            leadingIcon="share"
            style={{ backgroundColor: colors.surface }}
            titleStyle={{ color: colors.text }}
          />
        </Menu>
      </ImageBackground>
    </>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '1f1f1f',
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
  cardContent: {
    padding: 20,
  },
  appInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appIcon: {
    marginRight: 16,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#762006",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
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
  bodyText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins-Regular",
    lineHeight: 24,
    marginBottom: 12,
    textAlign: "justify",
  },
  highlightText: {
    fontFamily: "Poppins-Bold",
    color: "#762006",
  },
  feedbackText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Poppins-Regular",
    fontStyle: "italic",
    lineHeight: 22,
    marginTop: 8,
  },
  contactContainer: {
    gap: 12,
  },
  contactButton: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  contactButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins-Regular",
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
});
