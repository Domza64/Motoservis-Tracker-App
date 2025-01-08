import ItemHistory from "@/lib/ItemHistory";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DeleteIcon } from "./Icons";

function HistoryCard({
  history,
  onEdit,
  onDelete,
}: {
  history: ItemHistory;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View className="bg-gray-200 p-2 rounded-lg shadow-md my-2 flex-row justify-between">
      <View>
        <Text className="text-gray-700">
          <Text className="font-bold">Mileage:</Text> {history.mileage} mi
        </Text>
        <Text className="text-gray-700">
          <Text className="font-bold">Date:</Text>{" "}
          {new Date(history.recorded_date).toLocaleDateString()}
        </Text>
        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity
            onPress={onEdit}
            className="py-1.5 px-3 flex items-center justify-center bg-gray-300 rounded-lg"
          >
            <Text className="text-black font-bold text-center">Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <DeleteIcon />
      </View>
    </View>
  );
}

export default HistoryCard;
