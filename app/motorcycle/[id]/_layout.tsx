import { DataIcon, SettingsIcon, TireRepairIcon } from "@/components/Icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Service Items",
          tabBarIcon: (props) => {
            return <TireRepairIcon color={props.color} />;
          },
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          title: "Service Data",
          tabBarIcon: (props) => {
            return <DataIcon color={props.color} />;
          },
        }}
      />
      <Tabs.Screen
        name="bike_settings"
        options={{
          title: "Motorcycle Settings",
          tabBarIcon: (props) => {
            return <SettingsIcon color={props.color} />;
          },
        }}
      />
    </Tabs>
  );
}
