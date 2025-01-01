import { Link, router, useNavigation } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Motorcycle {
  id: number;
  model: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const db = useSQLiteContext();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
    <SafeAreaView>
      <Link href={"/add-motorcycle"}>Add motorcycle</Link>
      <View>
        {motorcycles.map((motorcycle, index) => (
          <View key={index}>
            <Link
              href={`/motorcycle/${motorcycle.id}`}
            >{`${motorcycle.model}`}</Link>
          </View>
        ))}
      </View>

      <Link href={"/settings"}>Settings</Link>
    </SafeAreaView>
  );
}
