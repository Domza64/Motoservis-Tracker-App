import { useGlobalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";

function Data() {
  const { id } = useGlobalSearchParams();
  return <Text>Id: {id}</Text>;
}

export default Data;
