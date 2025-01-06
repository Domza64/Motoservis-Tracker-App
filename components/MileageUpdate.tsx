import { View, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useGlobalSearchParams } from "expo-router";
import { CloseIcon } from "./Icons";
import Input from "./Input";

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
  const [warning, setWarning] = useState("");

  async function updateMileage() {
    if (isNaN(Number(newMileage)) || newMileage.trim() === "") {
      setWarning("Please enter a valid mileage.");
      return;
    }

    setWarning(""); // Clear warning on valid input

    const dateNow = new Date().toISOString();
    const mileageQuery = await db.prepareAsync(
      "UPDATE motorcycles SET mileage = ? WHERE id = ?"
    );
    const historyQuery = await db.prepareAsync(
      "INSERT INTO mileage_history (motorcycle_id, mileage, recorded_date) VALUES ($motorcycleId, $mileage, $recorded_date)"
    );

    try {
      await historyQuery.executeAsync({
        // @ts-ignore
        $motorcycleId: parseInt(id.toString()),
        $mileage: newMileage,
        $recorded_date: dateNow,
      });
      await mileageQuery.executeAsync([newMileage, parseInt(id.toString())]);
      onSuccess();
    } catch (error: any) {
      setWarning(error.message);
    } finally {
      await historyQuery.finalizeAsync();
      await mileageQuery.finalizeAsync();
    }
  }

  const handleMileageChange = (text: string) => {
    setNewMileage(text);

    const numericValue = parseInt(text);
    if (!isNaN(numericValue) && numericValue < currentMilage) {
      setWarning("The entered mileage is less than the current mileage.");
    } else {
      setWarning(""); // Clear warning if the mileage is valid
    }
  };

  return (
    <View className="flex mt-2 gap-2">
      {/* Header with Close Icon */}
      <View className="flex flex-row justify-between items-center">
        <Text className="text-lg font-bold text-gray-700">Update Mileage</Text>
        <TouchableOpacity onPress={cancel}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      <Input
        placeholder="New Mileage (km)"
        value={newMileage}
        handleChangeText={handleMileageChange}
        borderColor={warning ? "border-red-500" : undefined}
        keyboardType="decimal-pad"
      />

      {/* Warning Message */}
      {warning && <Text className="text-red-500 text-sm">{warning}</Text>}

      {/* Buttons */}
      <View className="flex flex-row gap-4">
        <TouchableOpacity
          className="flex-1 bg-secondary p-3 rounded-md"
          onPress={updateMileage}
        >
          <Text className="text-white text-center font-medium">
            Update Mileage
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
