import { Alert, Text, ScrollView, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import * as Updates from "expo-updates";
import { DB_NAME } from "@/constants/Settings";
import { useSQLiteContext } from "expo-sqlite";

export default function SettingsScreen() {
  const db = useSQLiteContext();

  const handleAppUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      Alert.alert(
        "App Update",
        "The app has checked for updates. Restarting to apply if available."
      );
      Updates.reloadAsync();
    } catch (error) {
      Alert.alert("Error", "Failed to check for updates.");
    }
  };

  return (
    <ScrollView className="p-2 bg-background flex-1">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-center text-gray-800">
          Settings
        </Text>
        <Text className="text-center text-gray-600 mt-2">
          Manage your app preferences, data, and updates.
        </Text>
      </View>

      {/* Import/Export Section */}
      <View className="bg-white p-4 rounded-lg shadow-md shadow-gray-400 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Data Management
        </Text>
        <TouchableOpacity
          className="bg-secondary p-3 rounded-lg mb-2"
          onPress={exportDatabase}
        >
          <Text className="text-white text-center">Export Database</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-secondary p-3 rounded-lg"
          onPress={() => importDatabase(db)}
        >
          <Text className="text-white text-center">Import Database</Text>
        </TouchableOpacity>
      </View>

      {/* App Preferences Section */}
      <View className="bg-white p-4 rounded-lg shadow-md shadow-gray-400 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          App Preferences
        </Text>
        <TouchableOpacity
          className="p-3 bg-gray-200 rounded-lg mb-2"
          onPress={() => {
            Alert.alert("Feature Coming Soon", "Customize app preferences!");
          }}
        >
          <Text className="text-center text-gray-700">Theme Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 bg-gray-200 rounded-lg"
          onPress={() => {
            Alert.alert("Feature Coming Soon", "Notifications Settings!");
          }}
        >
          <Text className="text-center text-gray-700">Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Maintenance Tips Section */}
      <View className="bg-white p-4 rounded-lg shadow-md shadow-gray-400 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Maintenance Tips
        </Text>
        <TouchableOpacity
          className="p-3 bg-gray-200 rounded-lg"
          onPress={() =>
            Alert.alert(
              "Tip of the Day",
              "Regularly check your oil, tire pressure, and chain tension!\nMore tips coming soon!"
            )
          }
        >
          <Text className="text-center text-gray-700">Show Tip of the Day</Text>
        </TouchableOpacity>
      </View>

      {/* App Updates Section */}
      <View className="bg-white p-4 rounded-lg shadow-md shadow-gray-400 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          App Updates
        </Text>
        <TouchableOpacity
          className="p-3 bg-gray-200 rounded-lg"
          onPress={handleAppUpdate}
        >
          <Text className="text-center text-gray-700">Check for Updates</Text>
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View className="bg-white p-4 pb-12 rounded-lg shadow-md shadow-gray-400">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Support
        </Text>
        <TouchableOpacity
          className="p-3 bg-gray-200 rounded-lg mb-2"
          onPress={() =>
            Alert.alert(
              "Contact Support",
              "Email us at support@motorcycleapp.com."
            )
          }
        >
          <Text className="text-center text-gray-700">Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 bg-gray-200 rounded-lg"
          onPress={() =>
            Alert.alert("About", "Motorcycle Tracker v1.0.0. Built for riders!")
          }
        >
          <Text className="text-center text-gray-700">About</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

const importDatabase = async (db: any) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    // Check if the user canceled the picker
    if (result.canceled) {
      return;
    }

    // If a file was selected, copy it to the app's SQLite directory
    const { uri } = result.assets[0];

    if (uri) {
      await db.closeAsync();
      // Copy the selected file to the database path
      await FileSystem.copyAsync({
        from: uri,
        to: dbPath,
      });

      console.log("Database imported successfully.", uri);

      await Updates.reloadAsync();
    }
  } catch (error) {
    Alert.alert("Error importing database: " + error);
  }
};

const exportDatabase = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    if (fileInfo.exists) {
      await Sharing.shareAsync(dbPath);
    }
  } catch (error) {
    Alert.alert("Error exporting database:" + error);
  }
};
