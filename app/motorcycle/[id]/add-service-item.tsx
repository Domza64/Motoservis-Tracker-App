import Input from "@/components/Input";
import { router, useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

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

  const addServiceItem = async () => {
    if (!serviceItem.name) {
      Alert.alert("Error", "Please enter a service item name");
    } else {
      const statement = await db.prepareAsync(
        "INSERT INTO service_items (motorcycle_id, name, description, frequency_days, frequency_miles) VALUES ($motorcycleId, $serviceName, $serviceDescription, $frequnecyDays, $frequencyMiles)"
      );

      try {
        await statement.executeAsync({
          // @ts-ignore
          $motorcycleId: parseInt(id.toString()),
          $serviceName: serviceItem.name,
          $serviceDescription: serviceItem.description,
          $frequnecyDays: serviceItem.frequency_days,
          $frequencyMiles: serviceItem.frequency_miles,
        });
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        await statement.finalizeAsync();
        router.back();
      }
    }
  };

  return (
    <View className="p-4 flex gap-2">
      <Text className="font-bold text-xl">Add service item</Text>
      <Input
        placeholder="Service Item"
        value={serviceItem.name}
        handleChangeText={(f: string) =>
          setServiceItem({ ...serviceItem, name: f })
        }
      />
      <Input
        placeholder="Description"
        value={serviceItem.description}
        handleChangeText={(f: string) =>
          setServiceItem({ ...serviceItem, description: f })
        }
      />
      <Input
        placeholder="Service frequency km"
        value={serviceItem.frequency_miles?.toString() ?? ""}
        handleChangeText={(f: string) =>
          setServiceItem({
            ...serviceItem,
            frequency_miles: parseInt(f) || undefined,
          })
        }
        keyboardType="numeric"
      />
      <Input
        placeholder="Service frequency days"
        value={serviceItem.frequency_days?.toString() ?? ""}
        handleChangeText={(f: string) =>
          setServiceItem({
            ...serviceItem,
            frequency_days: parseInt(f) || undefined,
          })
        }
        keyboardType="numeric"
      />
      <TouchableOpacity
        className="p-4 bg-violet-300 shadow-lg rounded-md"
        activeOpacity={0.7}
        onPress={addServiceItem}
      >
        <Text>ADD</Text>
      </TouchableOpacity>
    </View>
  );
}
