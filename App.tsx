import React, { useEffect, useRef, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import NavigationComponent from "./components/nav/NavigationComponent";
import { PaperProvider } from "react-native-paper";
import { FavouritesProvider } from './context/FavouritesContext';
import { SettingsProvider } from './context/SettingsContext';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Against History": require("./assets/fonts/Against History.ttf"),
    "bromello-Regular": require("./assets/fonts/bromello-Regular.ttf"),
    "Julietta-Messie-Demo": require("./assets/fonts/Julietta-Messie-Demo.ttf"),
    "Oswald-VariableFont_wght": require("./assets/fonts/Oswald-VariableFont_wght.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Black": require("./assets/fonts/Poppins-Black.ttf"),
    "Photograph Signature": require("./assets/fonts/Photograph Signature.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-ExtraBoldItalic": require("./assets/fonts/Poppins-ExtraBoldItalic.ttf"),
    "Gilroy-ExtraBold": require("./assets/fonts/Gilroy-ExtraBold.otf"),
    "Outfit-VariableFont_wght": require("./assets/fonts/Outfit-VariableFont_wght.ttf"),
    "Montserrat Black 900": require("./assets/fonts/Montserrat Black 900.ttf"),
    "Montserrat Regular 400": require("./assets/fonts/Montserrat Regular 400.ttf")
  });

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      } 
    };
    checkAuthentication();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SettingsProvider>
      <FavouritesProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider>
              <NavigationContainer>
                <NavigationComponent />
              </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </FavouritesProvider>
    </SettingsProvider>
  );
}


