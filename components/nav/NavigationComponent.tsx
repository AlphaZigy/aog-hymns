import React from "react";
import About from "../../screens/About";
import ViewHymn from "../ViewHymn";
import MissionSongs from "../../screens/MissionSongs";
import Favourites from "../../screens/Favourites";
import ViewMissionsong from "../ViewMissionsong";
import Settings from "../../screens/Settings";
import {
  SafeAreaView,
  ImageBackground,
  Image,
  Text,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Icon } from "@rneui/themed";
import HymnsScreen from "../../screens/HymnsScreen";
import { useSettings } from "../../context/SettingsContext";

const Drawer = createDrawerNavigator();

const NavigationComponent = () => {
  const backgroundImg = require("../../assets/images/back.png");
  const backgroundImgDark = require("../../assets/images/dark_back.png");
  const { settings } = useSettings();

  // Define theme colors based on settings
  const drawerColors = {
    backgroundColor: settings.isDarkMode ? "#1f1f1f" : "#eef",
    headerBackground: settings.isDarkMode ? "#2d2d2d" : "#762006",
    headerText: settings.isDarkMode ? "#ffffff" : "#ffffff",
    drawerText: settings.isDarkMode ? "#ffffff" : "#111111",
    iconColor: settings.isDarkMode ? "#4fc3f7" : "#0000ff",
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <SafeAreaView style={{ backgroundColor: drawerColors.backgroundColor, flex: 1 }}>
            <ImageBackground
              key="drawer-header"
              source={settings.isDarkMode ? backgroundImgDark : backgroundImg}
              style={{
                height: 150,
                width: "100%",
                justifyContent: "center",
                marginTop: 20,
                alignItems: "center",
                borderBottomColor: "#8c8544",
                backgroundColor: "#8c8544",
              }}>
              <Image
                key="main-logo"
                source={require("../../assets/images/icon.png")}
                style={{
                  height: 100,
                  width: 105,
                }}
              />
              <Text
                key="app-title"
                style={{
                  fontSize: 22,
                  marginVertical: 0,
                  fontWeight: "bold",
                  color: "#ff0000",
                  marginBottom: 0,
                  textShadowColor: "#5b0116",
                  textShadowOffset: {
                    width: 2,
                    height: 2,
                  },
                  textShadowRadius: 3,
                }}>
                A
                <Image
                  key="inline-logo"
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={require("../../assets/images/icon.png")}
                />
                G Hymns
              </Text>
              <Text
                key="church-name"
                style={{
                  fontSize: 10,
                  color: "#0000ff",
                  marginVertical: 0,
                  marginBottom: 3,
                  marginTop: 0,
                  fontWeight: "bold",
                }}>
                Assemblies Of God Church
              </Text>
            </ImageBackground>
            <DrawerItemList key="drawer-items" {...props} />
          </SafeAreaView>
        );
      }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: drawerColors.backgroundColor,
          width: 200,
        },
        headerStyle: {
          backgroundColor: drawerColors.headerBackground,
        },
        headerTintColor: drawerColors.headerText,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerLabelStyle: {
          color: drawerColors.drawerText,
        },
      }}>
      <Drawer.Screen
        name="hymns"
        component={HymnsScreen}
        options={({ navigation }) => ({
          title: "Hymns",
          headerShown: false,
          drawerIcon: () => (
            <FontAwesome5 name="newspaper" size={18} color={drawerColors.iconColor} />
          ),
        })}
      />
      <Drawer.Screen
        name="ViewHymn"
        component={ViewHymn}
        options={({ navigation }) => ({
          headerShown: false,
          drawerItemStyle: {
            display: "none",
          },
          headerLeft: () => (
            <Icon
              name="arrow-back"
              type="material"
              color="#fff"
              onPress={() => navigation.navigate("hymns")}
            />
          ),
        })}
      />

      <Drawer.Screen
        name="ViewMissionsong"
        component={ViewMissionsong}
        options={({ navigation }) => ({
          headerShown: false,
          drawerItemStyle: {
            display: "none",
          },
          headerLeft: () => (
            <Icon
              name="arrow-back"
              type="material"
              color="#fff"
              onPress={() => navigation.navigate("MissionSongs")}
            />
          ),
        })}
      />

      <Drawer.Screen
        name="MissionSongs"
        component={MissionSongs}
        options={({ navigation }) => ({
          title: "Mission Songs",
          drawerIcon: () => (
            <Fontisto name="music-note" size={18} color={drawerColors.iconColor} />
          ),
          headerShown: false,
          headerLeft: () => (
            <Icon
              name="arrow-back"
              type="material"
              color="#fff"
              onPress={() => navigation.navigate("hymns")}
            />
          ),
        })}
      />
      
      <Drawer.Screen
        name="favourites"
        component={Favourites}
        options={({ navigation }) => ({
          title: "Favourites",
          headerShown: false,
          drawerIcon: () => <Fontisto name="heart" size={16} color={drawerColors.iconColor} />,
          headerLeft: () => (
            <Icon
              name="arrow-back"
              type="material"
              color="#fff"
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />

      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          title: "Settings",
          drawerIcon: () => (
            <Ionicons name="settings" size={18} color={drawerColors.iconColor} />
          ),
          headerShown: false,
          headerLeft: () => (
            <Icon
              name="arrow-back"
              type="material"
              color="#fff"
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={({ navigation }) => ({
          title: "About",
          drawerIcon: () => <Fontisto name="info" size={18} color={drawerColors.iconColor} />,
          headerShown: false,
          headerLeft: () => (
            <Icon
              name="arrow-back"
              type="material"
              color="#fff"
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
};

export default NavigationComponent;
