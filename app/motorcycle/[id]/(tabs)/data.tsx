import HistoryCard from "@/components/HistoryCard";
import ItemHistory from "@/lib/ItemHistory";
import ServiceItem from "@/lib/ServiceItem";
import { useIsFocused } from "@react-navigation/native";
import { router, useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

export default function Data() {
  const { id, show } = useGlobalSearchParams();
  const db = useSQLiteContext();
  const isFocused = useIsFocused();

  const [serviceItemId, setServiceItemId] = useState<number | null | undefined>(
    undefined
  );
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceItem, setServiceItem] = useState<{
    serviceItem: ServiceItem | undefined;
    history: ItemHistory[];
  }>({ serviceItem: undefined, history: [] });

  async function loadServiceItems() {
    const result = await db.getAllAsync<ServiceItem>(
      `SELECT * FROM service_items WHERE motorcycle_id = ${id};`
    );

    setServiceItems(result);
  }

  async function loadServiceItemHistory() {
    if (serviceItemId !== undefined) {
      const query =
        serviceItemId === null
          ? `SELECT * FROM history WHERE motorcycle_id = ${id} AND service_item_id IS NULL;`
          : `SELECT * FROM history WHERE motorcycle_id = ${id} AND service_item_id = ${serviceItemId};`;

      const result = await db.getAllAsync<ItemHistory>(query);

      setServiceItem({
        serviceItem: serviceItems.find((item) => item.id === serviceItemId)!,
        history: result,
      });
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadServiceItems();
      loadServiceItemHistory();
    }
  }, [isFocused]);

  useEffect(() => {
    loadServiceItemHistory();
  }, [serviceItemId]);

  useEffect(() => {
    const itemId = show;
    try {
      setServiceItemId(parseInt(itemId[0]));
    } catch (error) {
      setServiceItemId(undefined);
    }
  }, [show]);

  return (
    <ScrollView className="bg-white">
      <View className="px-2">
        <View className="flex gap-2">
          <Text className="mt-4 text-xl font-bold text-gray-800">
            History data for services:
          </Text>
          <TouchableOpacity
            onPress={() => setServiceItemId(null)}
            className={`p-2 rounded-md ${
              serviceItemId === null ? "bg-gray-400" : "bg-gray-300"
            }`}
            key={"mileage_history"}
          >
            <Text className="text-center font-semibold">Mileage history</Text>
          </TouchableOpacity>
          {serviceItems.map((item) => (
            <TouchableOpacity
              onPress={() => setServiceItemId(item.id)}
              className={`p-2 rounded-md ${
                item.id === serviceItemId ? "bg-gray-400" : "bg-gray-300"
              }`}
              key={item.id}
            >
              <Text className="text-center font-semibold">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="mt-12 text-2xl font-bold text-gray-800 mb-4">
          {serviceItem.serviceItem?.name || "Mileage"} Data
        </Text>
        {serviceItemId == undefined && serviceItem.history.length > 0 && (
          <View>
            <LineChart
              data={{
                labels: serviceItem.history.map((item: ItemHistory) =>
                  new Date(item.recorded_date).toLocaleDateString()
                ),
                datasets: [
                  {
                    data: serviceItem.history.map(
                      (item: ItemHistory) => item.mileage
                    ),
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20} // from react-native
              height={220}
              yAxisLabel=""
              yAxisSuffix=" km"
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#f3f3f3",
                decimalPlaces: 0,
                color: () => `#C22A13`,
                labelColor: () => `#000000`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#C22A13",
                },
              }}
              bezier
              style={{
                borderRadius: 4,
              }}
            />
          </View>
        )}
      </View>
      <View className="mx-2">
        <TouchableOpacity
          onPress={() => router.push(`/motorcycle/${id}/add-history`)}
          className="p-3 bg-gray-300 rounded-lg shadow-md mt-2"
        >
          <Text className="text-black font-bold text-center">
            Insert History
          </Text>
        </TouchableOpacity>
        {serviceItem.history.length > 0 ? (
          serviceItem.history.map((item) => (
            <HistoryCard
              key={item.id}
              history={item}
              onEdit={() =>
                router.push(`/motorcycle/${id}/edit-history/${item.id}`)
              }
              onDelete={async () => {
                Alert.alert(
                  "Delete History",
                  "Are you sure you want to delete this history? This action cannot be undone.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          //await db.executeAsync(
                          //  `DELETE FROM history WHERE id = ${item.id}`
                          //);
                          loadServiceItemHistory();
                        } catch (error: any) {
                          Alert.alert("Error", error.message);
                        }
                      },
                    },
                  ]
                );
              }}
            />
          ))
        ) : (
          <Text className="text-center text-lg text-gray-600 mt-4">
            Empty...
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
