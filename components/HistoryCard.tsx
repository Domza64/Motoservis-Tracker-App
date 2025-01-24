import ItemHistory from "@/lib/ItemHistory";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DeleteIcon, SettingsIcon } from "./Icons";
import Input from "@/components/Input";

function HistoryCard({
  history,
  onEdit,
  onDelete,
}: {
  history: ItemHistory;
  onEdit: (mileage: number, date: string) => void;
  onDelete: () => void;
}) {
  const [modify, setModify] = useState(false);

  return (
    <View className="bg-white p-2 rounded-lg shadow-md shadow-black">
      <View className="flex-row justify-between">
        <View>
          <Text className="text-gray-700">
            <Text className="font-bold">Mileage:</Text> {history.mileage} km
          </Text>
          <Text className="text-gray-700">
            <Text className="font-bold">Date:</Text>{" "}
            {new Date(history.recorded_date).toLocaleDateString()}
          </Text>
        </View>
        <View>
          <TouchableOpacity className="pl-3 pb-3" onPress={onDelete}>
            <DeleteIcon />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row gap-2 mt-4">
        {modify ? (
          <View className="w-24">
            <TouchableOpacity onPress={() => setModify(false)}>
              <Text className="text-secondary underline font-bold">Cancel</Text>
            </TouchableOpacity>
            <Input
              handleChangeText={function (e: string): void {
                throw new Error("Function not implemented.");
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setModify(false);
                onEdit(history.mileage, history.recorded_date);
              }}
            >
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setModify(true)}>
            <Text className="text-secondary font-bold underline">Modify</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default HistoryCard;
