import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

function Settings() {
  const { id } = useGlobalSearchParams();
  const db = useSQLiteContext();

  const deleteMotorcycle = async () => {
    const statement = await db.prepareAsync(
      "DELETE FROM motorcycles WHERE id = $id"
    );

    try {
      await statement.executeAsync({ $id: parseInt(id.toString()) });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await statement.finalizeAsync();
      router.replace("/");
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={deleteMotorcycle}
        className="p-4 bg-red-400 rounded-lg m-2 shadow-md shadow-black"
      >
        <Text className="text-white font-bold text-center">
          Delete This motorcycle
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Settings;
