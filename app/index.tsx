import Motorcycle from "@/lib/Motorcycle";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
// @ts-ignore
import logo from "@/assets/images/motoservis.png";
// @ts-ignore
import motorcycleImage from "@/assets/images/motorcycle.png";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Motorcycle>(
        "SELECT * FROM motorcycles"
      );

      setMotorcycles(result);
    }
    setup();
  }, []);

  return (
    <ScrollView
      className="bg-background p-4"
      showsVerticalScrollIndicator={false}
    >
      <Image source={logo} className="w-96 h-40 mx-auto" resizeMode="contain" />
      {/* Welcome Text */}
      <View className="my-4">
        <Text className="text-center text-lg text-gray-600 mt-2">
          Keep track of your motorcycle's maintenance and its service schedule
          to enjoy every ride!
        </Text>
        <Text className="text-center text-sm text-gray-500 mt-4">
          Ready to maintain your bike? Select one below or add a new motorcycle
          to track its services.
        </Text>
      </View>

      {/* List of Motorcycles */}
      {motorcycles.length > 0 ? (
        motorcycles.map((motorcycle, index) => (
          <TouchableOpacity
            onPress={() => {
              router.push(`/motorcycle/${motorcycle.id}`);
            }}
            key={index}
            className="py-2 pr-2 my-2 rounded-lg bg-gray-100 shadow-lg flex flex-row gap-4 items-center"
          >
            {/* Motorcycle Image Placeholder */}
            <View className="w-32 h-32">
              <Image
                source={motorcycleImage}
                className="w-full h-full opacity-20"
                resizeMode="contain"
              />
            </View>
            <View>
              <Text className="font-bold text-xl text-gray-800">
                {motorcycle.model}
              </Text>
              <Text className="text-gray-600">
                <Text className="font-semibold">Mileage:</Text>{" "}
                {motorcycle.mileage} km
              </Text>
              <Text className="text-gray-500 text-sm mt-1 w-56">
                Tap to view service items and track your bike's health.
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text className="text-center text-lg text-gray-500 mt-6">
          You haven't added any motorcycles yet. Start by adding one to track
          its services!
        </Text>
      )}

      {/* Add New Motorcycle Button */}
      <TouchableOpacity
        onPress={() => {
          router.push("/add-motorcycle");
        }}
        className="bg-primary mt-6 rounded-md shadow-black shadow-md p-4"
      >
        <Text className="text-white font-semibold text-center">
          Add New Motorcycle
        </Text>
      </TouchableOpacity>

      {/* Reminder Section */}
      <View className="mt-8 p-4 pb-10">
        <Text className="text-center text-lg font-semibold text-gray-700">
          Maintenance Tip of the Day
        </Text>
        <Text className="text-center text-sm text-gray-600 mt-2">
          Regular maintenance is key to keeping your bike running smoothly.
          Remember to check the oil and tire pressure often!
        </Text>
      </View>
    </ScrollView>
  );
}
