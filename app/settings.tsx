import { Alert, Button, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import * as Updates from "expo-updates";
import { DB_NAME } from "@/constants/Settings";
import { useSQLiteContext } from "expo-sqlite";

export default function SettingsScreen() {
  const db = useSQLiteContext();

  return (
    <View className="p-2 flex gap-4">
      <Button title="Export Database" onPress={exportDatabase} />
      <Button title="Import Database" onPress={() => importDatabase(db)} />
    </View>
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
