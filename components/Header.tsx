import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Motorcycle from "@/lib/Motorcycle";
import { useSQLiteContext } from "expo-sqlite";

const Header = (route: any) => {
  const db = useSQLiteContext();
  const id = route?.route?.params?.id ?? null;

  const [title, setTitle] = useState("My bikes");

  async function getMotorcycleModel() {
    const result = await db.getFirstAsync<Motorcycle>(
      `SELECT model FROM motorcycles WHERE id = ${id};`
    );

    if (result?.model) {
      setTitle(result.model);
    }
  }

  useEffect(() => {
    getMotorcycleModel();
  }, []);

  return (
    <View>
      <Text numberOfLines={1} className="text-2xl font-bold">
        {title}
      </Text>
    </View>
  );
};

export default Header;
