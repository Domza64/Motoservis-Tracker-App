import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import ServiceItem from "@/lib/ServiceItem";
import ServiceItemCard from "@/components/ServiceItemCard";
import Motorcycle from "@/lib/Motorcycle";

function ServiceItems() {
  const { id } = useGlobalSearchParams();
  const db = useSQLiteContext();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);

  const addServiceItem = async () => {
    const statement = await db.prepareAsync(
      "INSERT INTO service_items (motorcycle_id, name, description, frequency_days, frequency_miles) VALUES ($motorcycleId, $serviceName, $serviceDescription, $frequnecyDays, $frequencyMiles)"
    );

    try {
      await statement.executeAsync({
        $motorcycleId: parseInt(id.toString()),
        $serviceName: "Ulje",
        $frequnecyDays: 10,
        $frequencyMiles: 20,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await statement.finalizeAsync();
      loadServiceItems();
    }
  };

  async function loadServiceItems() {
    const result = await db.getAllAsync<ServiceItem>(
      `SELECT * FROM service_items WHERE motorcycle_id = ${id};`
    );

    setServices(result);
  }

  async function loadMotorcycleInfo() {
    const result = await db.getFirstAsync<Motorcycle>(
      `SELECT * FROM motorcycles WHERE id = ${id};`
    );

    setMotorcycle(result);
  }

  useEffect(() => {
    loadMotorcycleInfo();
    loadServiceItems();
  }, []);

  if (!motorcycle) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ServiceItemCard onDelete={loadServiceItems} serviceItem={item} />
      )}
      className="p-2 bg-white"
      ListHeaderComponent={() => (
        <View>
          <Text className="font-semibold">{motorcycle.model}</Text>
          <Text>Current mileage: {motorcycle.mileage} km</Text>
        </View>
      )}
      ListEmptyComponent={() => <Text>No service items yet</Text>}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListFooterComponent={() => (
        <View>
          <TouchableOpacity
            onPress={addServiceItem}
            className="p-4 bg-slate-400 rounded-lg mt-3 shadow-md"
          >
            <Text className="text-white font-bold text-center">
              Add service item
            </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

export default ServiceItems;
