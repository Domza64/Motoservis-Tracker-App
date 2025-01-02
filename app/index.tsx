import Motorcycle from "@/lib/Motorcycle";
import { Link, useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView className="flex h-full gap-4">
      <Link href={"/add-motorcycle"} className="bg-gray-400 p-4">
        Add motorcycle
      </Link>
      <View className="flex bg-red-200 rounded-lg gap-2">
        {motorcycles.map((motorcycle, index) => (
          <View key={index} className="border-2">
            <Link
              className="text-2xl font-2xl"
              href={`/motorcycle/${motorcycle.id}`}
            >{`${motorcycle.model}`}</Link>
          </View>
        ))}
      </View>

      <Link href={"/settings"} className="bg-gray-400 p-4">
        Settings
      </Link>
    </SafeAreaView>
  );
}
