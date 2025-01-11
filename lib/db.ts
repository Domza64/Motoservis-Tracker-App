import { DB_NAME } from "@/constants/Settings";
import * as FileSystem from "expo-file-system";
import { type SQLiteDatabase } from "expo-sqlite";
import * as Updates from "expo-updates";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 0;

  try {
    await db.execAsync("PRAGMA user_version;");
    console.log("Database is correct");
  } catch (error) {
    await deleteDatabase();
    await Updates.reloadAsync();
    console.log("Database file error, deleted and reloaded");
  }

  // Set WAL mode
  await db.execAsync("PRAGMA journal_mode = WAL;");

  // Create motorcycles table
  await db.execAsync(`
          CREATE TABLE IF NOT EXISTS motorcycles (
          id INTEGER PRIMARY KEY NOT NULL,
          model TEXT NOT NULL,
          description TEXT,
          mileage INTEGER NOT NULL
          );`);

  // Create history table
  await db.execAsync(`
          CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY NOT NULL,
          motorcycle_id INTEGER NOT NULL,
          mileage INTEGER NOT NULL,
          recorded_date TEXT NOT NULL,
          service_item_id INTEGER,
          FOREIGN KEY (motorcycle_id) REFERENCES motorcycles (id) ON DELETE CASCADE,
          FOREIGN KEY (service_item_id) REFERENCES service_items (id) ON DELETE CASCADE
          );`);

  // create service_items table
  await db.execAsync(`
          CREATE TABLE IF NOT EXISTS service_items (
          id INTEGER PRIMARY KEY NOT NULL,
          motorcycle_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          frequency_days INTEGER,
          frequency_miles INTEGER,
          FOREIGN KEY (motorcycle_id) REFERENCES motorcycles (id) ON DELETE CASCADE
          );`);

  // @ts-ignore
  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  console.log("Current db version:", currentDbVersion);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const deleteDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
  try {
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(dbPath);
    }
  } catch (error) {
    console.error("Error deleting database:", error);
  }
};
