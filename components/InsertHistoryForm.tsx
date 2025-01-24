import Input from "@/components/Input";
import { TouchableOpacity, Text, View } from "react-native";
import { CloseIcon } from "./Icons";

export default function InsertHistoryForm({
  motorcycleId,
  serviceItemId,
  cancel,
  submit,
}: {
  motorcycleId: number;
  serviceItemId: number;
  cancel: () => void;
  submit: () => void;
}) {
  return (
    <>
      <View className="flex-row justify-between">
        <Text>Enter new Data</Text>
        <TouchableOpacity onPress={cancel} className="pl-3 pb-3">
          <CloseIcon />
        </TouchableOpacity>
      </View>
      <View className="gap-2">
        <Input
          placeholder="Mileage"
          keyboardType="numeric"
          handleChangeText={function (e: string): void {
            throw new Error("Function not implemented.");
          }}
        />
        <Input
          placeholder="date"
          keyboardType="numeric"
          handleChangeText={function (e: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </View>
      <TouchableOpacity
        onPress={submit}
        className="p-3 bg-secondary mb-4 rounded-lg shadow-md mt-2"
      >
        <Text className="text-white font-bold text-center">Insert</Text>
      </TouchableOpacity>
    </>
  );
}
