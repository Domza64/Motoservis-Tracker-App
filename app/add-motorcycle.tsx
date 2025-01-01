import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const db = useSQLiteContext();

  const [motorcycleData, setMotorcycleData] = useState({
    model: "",
    milage: 0,
  });

  const add = async () => {
    if (!motorcycleData.model || !motorcycleData.milage) {
      Alert.alert("Error", "All fields are required");
    } else {
      try {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          
          CREATE TABLE IF NOT EXISTS motorcycles (
            id INTEGER PRIMARY KEY NOT NULL,
            model TEXT NOT NULL
          );
          
          INSERT INTO motorcycles (model) VALUES ('${motorcycleData.model}');
          `);
        console.log("Motorcycle added");
        router.replace("/");
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <SafeAreaView>
      <TextInput
        placeholder="Motorcycle model"
        value={motorcycleData.model}
        onChangeText={(m: string) =>
          setMotorcycleData({ ...motorcycleData, model: m })
        }
      />
      <TextInput
        placeholder="Milage"
        value={motorcycleData.milage.toString()}
        keyboardType="numeric"
        onChangeText={(m: string) =>
          setMotorcycleData({ ...motorcycleData, milage: parseInt(m) })
        }
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          add();
        }}
      >
        <Text>ADD</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
