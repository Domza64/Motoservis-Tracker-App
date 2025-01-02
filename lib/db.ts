import { type SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 0;

  // Set WAL mode
  await db.execAsync("PRAGMA journal_mode = WAL;");

  // Create motorcycles table
  await db.execAsync(`
          CREATE TABLE IF NOT EXISTS motorcycles (
          id INTEGER PRIMARY KEY NOT NULL,
          model TEXT NOT NULL,
          mileage INTEGER NOT NULL
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

  // Create service_history table
  await db.execAsync(`
          CREATE TABLE IF NOT EXISTS service_history (
          id INTEGER PRIMARY KEY NOT NULL,
          motorcycle_id INTEGER NOT NULL,
          service_item_id INTEGER NOT NULL,
          mileage INTEGER NOT NULL,
          service_date TEXT NOT NULL,
          FOREIGN KEY (motorcycle_id) REFERENCES motorcycles (id) ON DELETE CASCADE,
          FOREIGN KEY (service_item_id) REFERENCES service_items (id) ON DELETE CASCADE
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
