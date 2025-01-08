import Input from "@/components/Input";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MotorcycleProp {
  model: string | undefined;
  description: string | undefined;
  mileage: number | undefined;
}

export default function AddMotorcycle() {
  const db = useSQLiteContext();

  const [motorcycleData, setMotorcycleData] = useState<MotorcycleProp>({
    model: undefined,
    description: undefined,
    mileage: undefined,
  });

  const [errors, setErrors] = useState<{ model?: string; mileage?: string }>(
    {}
  );

  const add = async () => {
    const newErrors: { model?: string; mileage?: string } = {};
    if (!motorcycleData.model) newErrors.model = "Model is required.";
    if (!motorcycleData.mileage) newErrors.mileage = "Mileage is required.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await db.execAsync(`
        INSERT INTO motorcycles (model, mileage) 
        VALUES ('${motorcycleData.model}', '${motorcycleData.mileage}');`);

      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, model: undefined }));
  }, [motorcycleData.model]);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, mileage: undefined }));
  }, [motorcycleData.mileage]);

  return (
    <View className="bg-background p-4 flex-1">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-center text-gray-800">
          Add Your Motorcycle
        </Text>
        <Text className="text-center text-gray-600 mt-2">
          Enter your motorcycle's details to start tracking its services and
          maintenance schedule.
        </Text>
      </View>

      <View className="gap-4">
        {/* Model */}
        <View>
          <Text className="text-gray-700 mb-1">Motorcycle Model</Text>
          <Input
            placeholder="e.g., Honda CB500X"
            value={motorcycleData.model}
            borderColor={errors.model ? "border-red-500" : undefined}
            handleChangeText={(m: string) =>
              setMotorcycleData({ ...motorcycleData, model: m })
            }
          />
          {errors.model && (
            <Text className="text-red-500 text-sm mt-1">{errors.model}</Text>
          )}
        </View>

        {/* Description */}
        <View>
          <Text className="text-gray-700 mb-1">Description (Optional)</Text>
          <Input
            placeholder="e.g., A reliable touring motorcycle"
            value={motorcycleData.description}
            handleChangeText={(d: string) =>
              setMotorcycleData({ ...motorcycleData, description: d })
            }
          />
        </View>

        {/* Mileage */}
        <View>
          <Text className="text-gray-700 mb-1">Current Mileage (km)</Text>
          <Input
            placeholder="e.g., 12000"
            value={motorcycleData.mileage?.toString() ?? ""}
            borderColor={errors.mileage ? "border-red-500" : undefined}
            handleChangeText={(f: string) =>
              setMotorcycleData({
                ...motorcycleData,
                mileage: parseInt(f) || undefined,
              })
            }
            keyboardType="numeric"
          />
          {errors.mileage && (
            <Text className="text-red-500 text-sm mt-1">{errors.mileage}</Text>
          )}
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        className="bg-secondary p-3 rounded-lg mt-6"
        activeOpacity={0.7}
        onPress={add}
      >
        <Text className="text-white font-semibold text-center">
          Add New Motorcycle
        </Text>
      </TouchableOpacity>

      {/* Encouragement Text */}
      <Text className="text-center text-gray-500 text-sm mt-4">
        Keep your motorcycle in top shape by tracking its services. Ride with
        confidence!
      </Text>
    </View>
  );
}
