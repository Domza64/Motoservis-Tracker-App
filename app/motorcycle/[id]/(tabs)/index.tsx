import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import ServiceItem from "@/lib/ServiceItem";
import ServiceItemCard from "@/components/ServiceItemCard";
import Motorcycle from "@/lib/Motorcycle";
import { useIsFocused } from "@react-navigation/native";
import { SettingsIcon } from "@/components/Icons";
import MileageUpdate from "@/components/MileageUpdate";

function ServiceItems() {
  const { id } = useGlobalSearchParams();
  const isFocused = useIsFocused();
  const db = useSQLiteContext();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [showMileageModal, setShowMileageModal] = useState(false);

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
    if (isFocused) {
      loadMotorcycleInfo();
      loadServiceItems();
    }
  }, [isFocused]);

  if (!motorcycle) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={services}
      className="bg-white"
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="m-2">
          <ServiceItemCard
            onDelete={loadServiceItems}
            serviceItem={item}
            currentMotorcycleMilage={motorcycle.mileage}
            motorcycleId={motorcycle.id}
          />
        </View>
      )}
      ListHeaderComponent={() => (
        <View className="p-3">
          {/* Motorcycle Name and Model */}
          <Text className="font-bold text-3xl text-gray-800">
            {motorcycle.model}
          </Text>

          {/* Motorcycle Description */}
          <Text className="text-lg text-gray-600 mt-2">
            {motorcycle.description ||
              "This motorcycle is your trusty companion for the road. Keep it in top shape to enjoy every ride!"}
          </Text>

          {/* Motorcycle Mileage */}
          <Text className="text-lg text-gray-600 mt-4">
            <Text className="font-semibold">Mileage:</Text> {motorcycle.mileage}{" "}
            km
          </Text>

          {/* Action Buttons */}
          <View className="flex-row items-center justify-between mt-6 gap-2">
            {!showMileageModal && (
              <TouchableOpacity
                onPress={() => setShowMileageModal(true)}
                className="p-3 bg-secondary rounded-lg shadow-md flex-1"
              >
                <Text className="text-white font-bold text-center">
                  Update Mileage
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setShowMileageModal(false);
                router.push(`/motorcycle/${id}/add-service-item`);
              }}
              className="p-3 bg-gray-300 rounded-lg shadow-md flex-1"
            >
              <Text className="text-gray-600 font-bold text-center">
                Add Service Item
              </Text>
            </TouchableOpacity>
          </View>

          {showMileageModal && (
            <View className="mt-2">
              <MileageUpdate
                currentMilage={motorcycle.mileage}
                onSuccess={() => {
                  setShowMileageModal(false);
                  loadMotorcycleInfo();
                }}
                cancel={() => setShowMileageModal(false)}
              />
            </View>
          )}

          {/* Encourage users to maintain their bike */}
          <Text className="text-sm text-gray-500 mt-6 text-center">
            Stay on top of your bike's maintenance schedule and keep it running
            smoothly!
          </Text>
          <View className="border-t border-gray-300 my-4 mx-2"></View>
          <View className="flex-row items-center justify-center gap-2">
            <SettingsIcon />
            <Text className="font-semibold text-center text-lg">
              Currently Tracked Service Items
            </Text>
          </View>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text className="text-center text-lg text-gray-600 mt-4">
          No service items added yet. Tap "Add Service Item" to start tracking.
        </Text>
      )}
    />
  );
}

export default ServiceItems;
