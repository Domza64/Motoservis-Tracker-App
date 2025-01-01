import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

function Home() {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <Text>Motor: {id}</Text>
    </SafeAreaView>
  );
}

export default Home;
