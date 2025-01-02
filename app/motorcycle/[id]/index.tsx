import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import ServiceItem from "@/lib/ServiceItem";
import ServiceItemCard from "@/components/ServiceItemCard";
import Motorcycle from "@/lib/Motorcycle";

function Home() {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);

  const deleteMotorcycle = async () => {
    const statement = await db.prepareAsync(
      "DELETE FROM motorcycles WHERE id = $id"
    );

    try {
      await statement.executeAsync({ $id: parseInt(id.toString()) });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await statement.finalizeAsync();
      router.replace("/");
    }
  };

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
    <SafeAreaView>
      <View className="flex gap-4 h-full justify-between p-2">
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ServiceItemCard onDelete={loadServiceItems} serviceItem={item} />
          )}
          ListHeaderComponent={() => (
            <View>
              <Text className="text-2xl font-semibold">{motorcycle.model}</Text>
              <Text>Current mileage: {motorcycle.mileage} km</Text>
            </View>
          )}
          ListEmptyComponent={() => <Text>No service items yet</Text>}
          ItemSeparatorComponent={() => <View className="h-4" />}
        />

        <View>
          <TouchableOpacity
            onPress={addServiceItem}
            className="p-4 bg-blue-300 rounded-lg m-2 shadow-lg"
          >
            <Text className="text-white font-bold text-center">
              Add service item
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteMotorcycle}
            className="p-4 bg-red-500 rounded-lg m-2 shadow-md shadow-gray-600"
          >
            <Text className="text-white font-bold text-center">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
