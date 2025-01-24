import HistoryCard from "@/components/HistoryCard";
import InsertHistoryForm from "@/components/InsertHistoryForm";
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
  const [insertData, setInsertData] = useState<boolean>(false);
  const db = useSQLiteContext();
  const isFocused = useIsFocused();

  // number - service item id, -1 - mileage, undefined - nothing selected
  const [serviceItemId, setServiceItemId] = useState<number | undefined>(
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
        serviceItemId == -1
          ? `SELECT * FROM history WHERE motorcycle_id = ${id} AND service_item_id IS NULL ORDER BY recorded_date DESC;`
          : `SELECT * FROM history WHERE motorcycle_id = ${id} AND service_item_id = ${serviceItemId} ORDER BY recorded_date DESC;`;

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
    setInsertData(false);
  }, [serviceItemId]);

  useEffect(() => {
    const itemId = show;
    try {
      setServiceItemId(parseInt(itemId[0]));
    } catch (error) {
      setServiceItemId(undefined);
    }
  }, [show]);

  const insertDataForm = (
    <>
      {!insertData && (
        <TouchableOpacity
          onPress={() => setInsertData(true)}
          className="p-3 bg-secondary mb-4 rounded-lg shadow-md mt-2"
        >
          <Text className="text-white font-bold text-center">
            Insert new data
          </Text>
        </TouchableOpacity>
      )}

      {insertData && serviceItemId != undefined && (
        <InsertHistoryForm
          motorcycleId={parseInt(id as string)}
          serviceItemId={serviceItemId}
          cancel={() => setInsertData(false)}
          submit={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </>
  );

  return (
    <ScrollView className="bg-white">
      <View>
        {/** Tracked service items select buttons */}
        <View className="flex px-2 gap-2 pb-6">
          <Text className="mt-4 text-xl text-center font-bold text-gray-800">
            History data for services:
          </Text>
          <TouchableOpacity
            onPress={() => setServiceItemId(-1)}
            className={`p-2 rounded-md shadow-md shadow-black ${
              serviceItemId === -1
                ? "bg-gray-100 border-secondary border-2"
                : "bg-white"
            }`}
            key={"mileage_history"}
          >
            <Text className="text-center font-semibold">Mileage history</Text>
          </TouchableOpacity>
          {serviceItems.map((item) => (
            <TouchableOpacity
              onPress={() => setServiceItemId(item.id)}
              className={`p-2 rounded-md shadow-md shadow-black ${
                item.id === serviceItemId
                  ? "bg-gray-100 border-secondary border-2"
                  : "bg-white"
              }`}
              key={item.id}
            >
              <Text className="text-center font-semibold">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/** Tracked service item data */}
        {serviceItemId != undefined && (
          <View className="px-2">
            <Text className="mt-12 text-3xl text-center font-bold text-gray-800 mb-4">
              {serviceItem.serviceItem?.name || "Mileage"} Data
            </Text>
            {serviceItem.history.length === 0 ? (
              <>
                <Text className="text-gray-700 mb-8 text-center">
                  No history data for this service item yet.
                </Text>
                {insertDataForm}
              </>
            ) : (
              <>
                {insertDataForm}
                {serviceItemId == -1 && (
                  <View>
                    <LineChart
                      data={{
                        labels: serviceItem.history
                          .map((item: ItemHistory) =>
                            new Date(item.recorded_date).toLocaleDateString()
                          )
                          .reverse(),
                        datasets: [
                          {
                            data: serviceItem.history
                              .map((item: ItemHistory) => item.mileage)
                              .reverse(),
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
                <View className="gap-2 mb-6">
                  {serviceItem.history.length > 0 &&
                    serviceItem.history.map((item) => (
                      <HistoryCard
                        key={item.id}
                        history={item}
                        onEdit={() =>
                          router.push(
                            `/motorcycle/${id}/edit-history/${item.id}`
                          )
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
                                    await db.execAsync(
                                      `DELETE FROM history WHERE id = ${item.id}`
                                    );
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
                    ))}
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
