import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import ServiceItem from "@/lib/ServiceItem";
import { useSQLiteContext } from "expo-sqlite";

interface Props {
  serviceItem: ServiceItem;
  onDelete?: () => void;
}

const ServiceItemCard = ({ serviceItem, onDelete }: Props) => {
  const db = useSQLiteContext();
  const { name, description, frequency_days, frequency_miles } = serviceItem;

  const deleteServiceItem = async () => {
    const statement = await db.prepareAsync(
      "DELETE FROM service_items WHERE id = $id"
    );

    try {
      await statement.executeAsync({
        $id: parseInt(serviceItem.id.toString()),
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await statement.finalizeAsync();
      if (onDelete) {
        onDelete();
      }
    }
  };

  return (
    <View className="bg-gray-100 p-4 rounded-md shadow-md">
      <Text className="font-bold">{name}</Text>
      <Text>{description || "No description available"}</Text>
      <Text>
        {frequency_days !== undefined
          ? `Service frequency days: ${frequency_days}`
          : "Service frequency days: Not set"}
      </Text>
      <Text>
        {frequency_miles !== undefined
          ? `Service frequency miles: ${frequency_miles}`
          : "Service frequency miles: Not set"}
      </Text>
      <Text>ID: {serviceItem.id}</Text>
      <TouchableOpacity
        className="bg-red-100 shadow-md p-2 mt-2 rounded-md"
        onPress={deleteServiceItem}
      >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ServiceItemCard;
