import Motorcycle from "@/lib/Motorcycle";
import { Link, router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Motorcycle>(
        "SELECT * FROM motorcycles"
      );

      setMotorcycles(result);
    }
    setup();
  }, []);

  return (
    <ScrollView className="p-2 bg-white">
      {motorcycles.map((motorcycle, index) => (
        <TouchableOpacity
          onPress={() => {
            router.push(`/motorcycle/${motorcycle.id}`);
          }}
          key={index}
          className="p-2 my-1.5 rounded-lg bg-gray-100 shadow flex flex-row gap-4 items-center"
        >
          <View className="bg-gray-200 w-32 h-32"></View>
          <View>
            <Text className="font-bold text-xl">{motorcycle.model}</Text>
            <Text>Currently has: {motorcycle.mileage} km</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => {
          router.push("/add-motorcycle");
        }}
        className="bg-blue-400 mt-2 rounded-md shadow-lg shadow-black p-4"
      >
        <Text className="text-white font-semibold text-center">
          Add new motorcycle
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
