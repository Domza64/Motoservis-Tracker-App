import Input from "@/components/Input";
import { router, useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface ServiceItemProp {
  name: string;
  description: string;
  frequency_days: number | undefined;
  frequency_miles: number | undefined;
}

export default function AddServiceItem() {
  const { id } = useGlobalSearchParams();
  const db = useSQLiteContext();

  const [serviceItem, setServiceItem] = useState<ServiceItemProp>({
    name: "",
    description: "",
    frequency_days: undefined,
    frequency_miles: undefined,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [serviceItem.name]);

  const addServiceItem = async () => {
    if (!serviceItem.name) {
      setError("Service item name is required.");
      return;
    }

    const statement = await db.prepareAsync(
      "INSERT INTO service_items (motorcycle_id, name, description, frequency_days, frequency_miles) VALUES ($motorcycleId, $serviceName, $serviceDescription, $frequencyDays, $frequencyMiles)"
    );

    try {
      await statement.executeAsync({
        // @ts-ignore
        $motorcycleId: parseInt(id.toString()),
        $serviceName: serviceItem.name,
        $serviceDescription: serviceItem.description,
        $frequencyDays: serviceItem.frequency_days,
        $frequencyMiles: serviceItem.frequency_miles,
      });

      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await statement.finalizeAsync();
    }
  };

  return (
    <View className="p-4 flex-1 bg-background">
      {/* Header Section */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-center text-gray-800">
          Add New Service Item
        </Text>
        <Text className="text-center text-gray-600 mt-2">
          Log a service task for your motorcycle. Keep track of regular
          maintenance and ensure a smooth ride!
        </Text>
      </View>

      {/* Input Fields */}
      <View className="gap-4">
        {/* Service Item Name */}
        <View>
          <Text className="text-gray-700 mb-1">Service Item Name</Text>
          <Input
            placeholder="e.g., Oil Change"
            value={serviceItem.name}
            borderColor={error ? "border-red-500" : undefined}
            handleChangeText={(f: string) =>
              setServiceItem({ ...serviceItem, name: f })
            }
          />
          {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>

        {/* Description */}
        <View>
          <Text className="text-gray-700 mb-1">Description (Optional)</Text>
          <Input
            placeholder="e.g., Replace engine oil every 6 months"
            value={serviceItem.description}
            handleChangeText={(f: string) =>
              setServiceItem({ ...serviceItem, description: f })
            }
          />
        </View>

        {/* Frequency by Miles */}
        <View>
          <Text className="text-gray-700 mb-1">
            Frequency (in kilometers, Optional)
          </Text>
          <Input
            placeholder="e.g., 5000"
            value={serviceItem.frequency_miles?.toString() ?? ""}
            handleChangeText={(f: string) =>
              setServiceItem({
                ...serviceItem,
                frequency_miles: parseInt(f) || undefined,
              })
            }
            keyboardType="numeric"
          />
        </View>

        {/* Frequency by Days */}
        <View>
          <Text className="text-gray-700 mb-1">
            Frequency (in days, Optional)
          </Text>
          <Input
            placeholder="e.g., 180"
            value={serviceItem.frequency_days?.toString() ?? ""}
            handleChangeText={(f: string) =>
              setServiceItem({
                ...serviceItem,
                frequency_days: parseInt(f) || undefined,
              })
            }
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        className="bg-secondary p-3 rounded-lg mt-6"
        activeOpacity={0.7}
        onPress={addServiceItem}
      >
        <Text className="text-white font-semibold text-center">
          Add New Service Item
        </Text>
      </TouchableOpacity>

      {/* Encouragement Text */}
      <Text className="text-center text-gray-500 text-sm mt-4">
        Logging service tasks ensures your motorcycle stays in great condition.
        Keep up the good work!
      </Text>
    </View>
  );
}
