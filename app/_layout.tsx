import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { SQLiteProvider } from "expo-sqlite";
import { useColorScheme } from "@/hooks/useColorScheme";
import { migrateDbIfNeeded } from "@/lib/db";
import { TouchableOpacity } from "react-native";
import Header from "@/components/Header";
import { SettingsIcon } from "@/components/Icons";
import { DB_NAME } from "@/constants/Settings";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName={DB_NAME} onInit={migrateDbIfNeeded}>
      {/*<ThemeProvider value={colorScheme !== "dark" ? DarkTheme : DefaultTheme}>*/}
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerRight() {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push("/settings");
                  }}
                >
                  <SettingsIcon />
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen
          name="motorcycle/[id]/(tabs)"
          options={({ route }) => ({
            headerShadowVisible: false,
            headerTitle() {
              return <Header route={route} />;
            },
          })}
        />
        <Stack.Screen
          name="motorcycle/[id]/add-service-item"
          options={({ route }) => ({
            headerTitle() {
              return <Header route={route} />;
            },
          })}
        />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen
          name="add-motorcycle"
          options={{ title: "", headerShadowVisible: false }}
        />
      </Stack>
      <StatusBar style="auto" />
      {/*</ThemeProvider>*/}
    </SQLiteProvider>
  );
}
