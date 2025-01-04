import { View, Alert, TouchableOpacity, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useGlobalSearchParams } from "expo-router";

export default function MileageUpdate({
  currentMilage,
  onSuccess,
  cancel,
}: {
  currentMilage: number;
  onSuccess: () => void;
  cancel: () => void;
}) {
  const { id } = useGlobalSearchParams();
  const db = useSQLiteContext();
  const [newMileage, setNewMileage] = useState(currentMilage.toString());

  async function updateMileage() {
    if (isNaN(Number(newMileage)) || newMileage.trim() === "") {
      Alert.alert("Error", "Please enter a new mileage");
      return;
    }
    const dateNow = new Date().toISOString();
    const milage_query = await db.prepareAsync(
      "UPDATE motorcycles SET mileage = ? WHERE id = ?"
    );
    const history_query = await db.prepareAsync(
      "INSERT INTO mileage_history (motorcycle_id, mileage, recorded_date) VALUES ($motorcycleId, $mileage, $recorded_date)"
    );

    try {
      await history_query.executeAsync({
        // @ts-ignore
        $motorcycleId: parseInt(id.toString()),
        $mileage: newMileage,
        $recorded_date: dateNow,
      });
      await milage_query.executeAsync([newMileage, parseInt(id.toString())]);
      onSuccess();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await history_query.finalizeAsync();
      await milage_query.finalizeAsync();
    }
  }

  return (
    <View className="flex gap-2 flex-col">
      <TextInput
        placeholder="New Mileage (km)"
        className={`bg-gray-200 p-2 rounded-lg px-4 border-red-500 ${
          parseInt(newMileage) < currentMilage ? "border" : ""
        }`}
        value={newMileage.toString()}
        onChange={(e) => setNewMileage(e.nativeEvent.text)}
        keyboardType="decimal-pad"
      ></TextInput>
      {parseInt(newMileage) < currentMilage && (
        <Text className="text-red-500">
          Entered mileage is less than current
        </Text>
      )}
      <View className="flex flex-row">
        <TouchableOpacity
          className="bg-yellow-400 p-4 rounded-lg w-10/12"
          onPress={updateMileage}
        >
          <Text className="text-black font-bold text-center">
            Update Mileage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={cancel}
          className="bg-red-400 p-4 rounded-lg w-2/12"
        >
          <Text>C</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
