import { View, TextInput, KeyboardTypeOptions } from "react-native";
import React, { useState } from "react";

interface Props {
  placeholder?: string;
  value?: string;
  handleChangeText: (e: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

export default function Input({
  placeholder,
  value,
  handleChangeText,
  keyboardType,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`w-full px-2 flex-row bg-gray-200 border rounded-lg ${
        isFocused ? "border-yellow-600" : "border-black-200"
      }`}
    >
      <TextInput
        className="font-semibold w-full"
        keyboardType={keyboardType}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}
