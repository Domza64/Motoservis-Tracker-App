import Settings from "@/assets/icons/settings.svg";
import Data from "@/assets/icons/data.svg";
import TireRepair from "@/assets/icons/tire_repair.svg";
import { useColorScheme } from "react-native";

export function SettingsIcon({ color }: { color?: string }) {
  const colorScheme = useColorScheme();
  if (color) {
    return <Settings fill={color} width={24} height={24} />;
  }
  return (
    <Settings
      fill={colorScheme !== "dark" ? "#fff" : "#000"}
      width={24}
      height={24}
    />
  );
}

export function TireRepairIcon({ color }: { color?: string }) {
  const colorScheme = useColorScheme();
  if (color) {
    return <TireRepair fill={color} width={24} height={24} />;
  }
  return (
    <TireRepair
      fill={colorScheme !== "dark" ? "#fff" : "#000"}
      width={24}
      height={24}
    />
  );
}

export function DataIcon({ color }: { color?: string }) {
  const colorScheme = useColorScheme();
  if (color) {
    return <Data fill={color} width={24} height={24} />;
  }
  return (
    <Data
      fill={colorScheme !== "dark" ? "#fff" : "#000"}
      width={24}
      height={24}
    />
  );
}
