import {
  DarkTheme,
  DefaultTheme,
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
import { View, Text, TouchableOpacity } from "react-native";
import "../global.css";
import Header from "@/components/Header";
import { SettingsIcon } from "@/components/Icons";
import { DB_NAME } from "@/constants/Settings";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
      <ThemeProvider value={colorScheme !== "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
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
            options={{ title: "Add Motorcycle" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
