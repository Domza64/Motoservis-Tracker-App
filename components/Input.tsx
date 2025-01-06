import { View, TextInput, KeyboardTypeOptions } from "react-native";
import React, { useState } from "react";

interface Props {
  placeholder?: string;
  value?: string;
  handleChangeText: (e: string) => void;
  keyboardType?: KeyboardTypeOptions;
  borderColor?: string;
}

export default function Input({
  placeholder,
  value,
  handleChangeText,
  keyboardType,
  borderColor,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  // Determine the border color to use
  const currentBorderColor = borderColor
    ? borderColor
    : isFocused
    ? "border-secondary"
    : "border-transparent";

  return (
    <View
      className={`w-full px-2 flex-row bg-gray-100 rounded-md border-2 ${currentBorderColor}`}
    >
      <TextInput
        className="w-full font-pmedium text-gray-400"
        keyboardType={keyboardType}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}
