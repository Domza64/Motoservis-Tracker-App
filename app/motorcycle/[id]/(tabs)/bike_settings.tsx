import { router, useGlobalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Input from "@/components/Input";

export default function MotorcycleSettings() {
  const { id } = useGlobalSearchParams();
  const db = useSQLiteContext();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  // Rename Motorcycle
  const renameMotorcycle = async () => {
    if (!name.trim()) {
      setNameError("Motorcycle name cannot be empty.");
      return;
    }
    setNameError("");

    const statement = await db.prepareAsync(
      "UPDATE motorcycles SET model = $name WHERE id = $id"
    );

    try {
      await statement.executeAsync({
        $name: name,
        $id: parseInt(id.toString()),
      });
      setName("");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await statement.finalizeAsync();
    }
  };

  useEffect(() => {
    setNameError("");
  }, [name]);

  // Update Description
  const updateDescription = async () => {
    const statement = await db.prepareAsync(
      "UPDATE motorcycles SET description = $description WHERE id = $id"
    );

    try {
      await statement.executeAsync({
        $description: description,
        $id: parseInt(id.toString()),
      });
      setDescription("");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      await statement.finalizeAsync();
    }
  };

  // Delete Motorcycle
  const deleteMotorcycle = async () => {
    Alert.alert(
      "Delete Motorcycle",
      "Are you sure you want to delete this motorcycle? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const statement = await db.prepareAsync(
              "DELETE FROM motorcycles WHERE id = $id"
            );

            try {
              await statement.executeAsync({ $id: parseInt(id.toString()) });
              Alert.alert("Deleted", "Motorcycle deleted successfully.");
              router.replace("/");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            } finally {
              await statement.finalizeAsync();
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="p-2 bg-background flex-1">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-center text-gray-800">
          Motorcycle Settings
        </Text>
        <Text className="text-center text-gray-600 mt-2">
          Manage settings for this motorcycle.
        </Text>
      </View>

      {/* Rename Section */}
      <View className="bg-white p-4 rounded-md shadow-md shadow-gray-400 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Rename Motorcycle
        </Text>
        <Input
          placeholder="Enter new name"
          value={name}
          borderColor={nameError ? "border-red-500" : undefined}
          handleChangeText={setName}
        />
        {nameError ? (
          <Text className="text-red-500 mt-2">{nameError}</Text>
        ) : null}
        <TouchableOpacity
          className="bg-secondary p-3 rounded-md mt-4"
          onPress={renameMotorcycle}
        >
          <Text className="text-white text-center">Save Name</Text>
        </TouchableOpacity>
      </View>

      {/* Update Description Section */}
      <View className="bg-white p-4 rounded-md shadow-md shadow-gray-400 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Update Description
        </Text>
        <Input
          placeholder="Enter new description"
          value={description}
          handleChangeText={setDescription}
        />
        <TouchableOpacity
          className="bg-secondary p-3 rounded-md mt-4"
          onPress={updateDescription}
        >
          <Text className="text-white text-center">Save Description</Text>
        </TouchableOpacity>
      </View>

      {/* Maintenance Logs Section */}
      <View className="bg-white p-4 rounded-md shadow-md shadow-gray-400 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Maintenance Logs
        </Text>
        <TouchableOpacity
          className="p-3 bg-gray-200 rounded-md"
          onPress={() => router.replace(`/motorcycle/${id}/(tabs)/data`)}
        >
          <Text className="text-center text-gray-700">View Logs</Text>
        </TouchableOpacity>
      </View>

      {/* Delete Motorcycle Section */}
      <View className="bg-white p-4 rounded-md shadow-md shadow-gray-400">
        <Text className="text-lg font-semibold mb-2 text-primary">
          Danger Zone
        </Text>
        <TouchableOpacity
          onPress={deleteMotorcycle}
          className="p-3 bg-primary rounded-md"
        >
          <Text className="text-white font-bold text-center">
            Delete This Motorcycle
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
