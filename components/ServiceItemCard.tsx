import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import {
  DataIcon,
  DeleteIcon,
  ServicedIcon,
  SettingsIcon,
  TireRepairIcon,
} from "./Icons"; // Temporary icon component
import ServiceItem from "@/lib/ServiceItem";
import ServiceItemHistory from "@/lib/ServiceItemHistory";

interface Props {
  serviceItem: ServiceItem;
  currentMotorcycleMilage: number;
  onDelete?: () => void;
}

const ServiceItemCard = ({
  serviceItem,
  currentMotorcycleMilage,
  onDelete,
}: Props) => {
  const db = useSQLiteContext();
  const { id, name, description, frequency_days, frequency_miles } =
    serviceItem;

  const [lastService, setLastService] = useState<ServiceItemHistory>(); // Holds the most recent service record
  const [serviceHistory, setServiceHistory] = useState<ServiceItemHistory[]>(
    []
  ); // Holds all service history records

  // Fetch service history from the database
  useEffect(() => {
    const fetchServiceHistory = async () => {
      const statement = await db.prepareAsync(
        "SELECT * FROM service_history WHERE service_item_id = $id ORDER BY service_date DESC"
      );
      try {
        const result = await statement.executeAsync<ServiceItemHistory>({
          $id: id,
        });

        // Extract rows from the result and update state
        const rows = await result.getAllAsync();
        setServiceHistory(rows);

        if (rows.length > 0) {
          setLastService(rows[0]);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch service history");
      } finally {
        await statement.finalizeAsync();
      }
    };

    fetchServiceHistory();
  }, [db, id]);

  // Calculate mileage since the last service
  const sinceLastService = lastService
    ? currentMotorcycleMilage - lastService.mileage
    : 0;

  const isServiceDue = frequency_miles && sinceLastService >= frequency_miles;

  // Calculate the next service interval in kilometers
  const kmUntilNextService = frequency_miles
    ? frequency_miles - sinceLastService
    : undefined;

  let daysUntilNextService: number | undefined;

  // Calculate days since last service if available
  if (lastService) {
    const lastServiceDate = new Date(lastService.service_date);
    const daysSinceLastService = daysAgo(lastServiceDate);
    daysUntilNextService = frequency_days
      ? frequency_days - daysSinceLastService
      : undefined;
  }

  // Delete service item from the database
  const deleteServiceItem = async () => {
    const statement = await db.prepareAsync(
      "DELETE FROM service_items WHERE id = $id"
    );
    try {
      await statement.executeAsync({ $id: id });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await statement.finalizeAsync();
      if (onDelete) {
        onDelete();
      }
    }
  };

  // Show confirmation before deleting the service item
  const confirmDeleteServiceItem = () => {
    Alert.alert(
      "Delete Service Item",
      "Are you sure you want to delete this service item? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteServiceItem,
        },
      ]
    );
  };

  return (
    <View
      className={`bg-white p-4 rounded-md shadow-md ${
        isServiceDue ? "border-2 border-red-500" : ""
      }`}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-col">
          <Text className="font-bold text-xl">{name}</Text>
          <Text className="mb-4 text-gray-600">
            {description || "No description provided..."}
          </Text>
          {lastService ? (
            <>
              <Text>
                <Text className="font-semibold">Since last service:</Text>{" "}
                {sinceLastService} km,{" "}
                {daysAgo(new Date(lastService.service_date))} days
              </Text>
              <Text>
                <Text className="font-semibold">Last service:</Text>{" "}
                {lastService.mileage} km,{" "}
                {formatDate(new Date(lastService.service_date))}
              </Text>
            </>
          ) : (
            <Text>No service records available.</Text>
          )}

          <View className="my-2">
            {frequency_days || frequency_miles ? (
              <>
                <Text className="font-semibold">Service intervals: </Text>
                {frequency_days && <Text>{frequency_days} days</Text>}
                {frequency_miles && <Text>{frequency_miles} km</Text>}
              </>
            ) : null}
          </View>
        </View>

        <View className="flex-col items-end justify-between">
          <View className="flex-row gap-2">
            <TouchableOpacity className="p-2">
              <DataIcon />
            </TouchableOpacity>
            <TouchableOpacity className="p-2">
              <SettingsIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="my-2 border-b border-gray-400" />

      <View className="flex-row justify-between items-end">
        {isServiceDue ? (
          <View className="p-2">
            <ServicedIcon />
            <Text>Service needed</Text>
            <Text className="text-gray-500">
              since:{" "}
              {lastService ? sinceLastService - frequency_miles + " km" : "N/A"}
            </Text>
            <Text className="text-gray-500">
              since: {lastService ? daysUntilNextService + " days" : "N/A"}
            </Text>
          </View>
        ) : (
          <View className="flex-col">
            <View className="flex-row items-center">
              <ServicedIcon color="#22c55e" />
              <Text className="text-green-500 font-semibold p-1 rounded">
                Service done
              </Text>
            </View>
            <Text>
              {kmUntilNextService} km, {daysUntilNextService} days until next
              service is needed.
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={confirmDeleteServiceItem}>
          <DeleteIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Utility function to calculate days since a given date
function daysAgo(date: Date): number {
  const today = new Date();
  const timeDifference = today.getTime() - date.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
}

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  try {
    return date.toLocaleDateString("en-GB", options).replace(/,/g, "");
  } catch {
    return "error";
  }
}

export default ServiceItemCard;
