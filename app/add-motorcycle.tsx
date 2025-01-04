import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMotorcycle() {
  const db = useSQLiteContext();

  const [motorcycleData, setMotorcycleData] = useState({
    model: "",
    mileage: 0,
  });

  const add = async () => {
    if (!motorcycleData.model || !motorcycleData.mileage) {
      Alert.alert("Error", "All fields are required");
    } else {
      try {
        await db.execAsync(`
          INSERT INTO motorcycles (model, mileage) 
          VALUES ('${motorcycleData.model}', '${motorcycleData.mileage}');`);

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
        placeholder="Mileage"
        value={motorcycleData.mileage.toString()}
        keyboardType="numeric"
        onChangeText={(m: string) =>
          setMotorcycleData({ ...motorcycleData, mileage: parseInt(m) | 0 })
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
