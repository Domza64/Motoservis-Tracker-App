import { Tabs, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "index",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          title: "Data",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
