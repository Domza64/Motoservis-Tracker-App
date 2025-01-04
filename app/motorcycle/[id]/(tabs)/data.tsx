import MileageHistory from "@/lib/MileageHistory";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

function Data() {
  const { id } = useGlobalSearchParams();
  const isFocused = useIsFocused();
  const db = useSQLiteContext();

  const [history, setHistory] = useState<MileageHistory[]>([]);

  async function loadServiceItems() {
    const result = await db.getAllAsync<MileageHistory>(
      `SELECT * FROM mileage_history WHERE motorcycle_id = ${id};`
    );

    setHistory(result);
  }

  useEffect(() => {
    if (isFocused) {
      loadServiceItems();
    }
  }, [isFocused]);

  if (!history) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={history}
      className="bg-white"
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="m-2">
          <Text>{JSON.stringify(item)}</Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <View className="p-3">
          <Text>History</Text>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text className="text-center text-lg text-gray-600 mt-4">Empty...</Text>
      )}
    />
  );
}

export default Data;
