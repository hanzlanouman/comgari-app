/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";

import { View, Text, TouchableOpacity, TextInput } from "react-native";

interface OtpProps {
  title?: string;
  value?: any;
  placeholder?: any;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  inputStyles?: string;
  type?: string;
  error?: string | undefined | any;
  inputRef?: undefined | any;
  index: number;
}

export const OtpField: React.FC<OtpProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  inputStyles,
  type,
  error,
  inputRef,
  index,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`${otherStyles}`}>
      {title && <Text className="text-sm text-black">{title}</Text>}
      <View className="w-full h-12 sm:h-[52] px-4 border border-stone-300 bg-white rounded-xl sm:rounded-2xl flex-row items-center justify-center">
        <TextInput
          className={`flex-1 text-black font-mmedium text-base pb-1 sm:pb-1.5 ${inputStyles}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#4A4A4A"
          autoCapitalize="none"
          ref={(ref) => (inputRef.current[index] = ref)}
          onChangeText={handleChangeText}
          secureTextEntry={type === "password" && !showPassword}
          maxLength={1}
          keyboardType="numeric"
        />
      </View>
      {error ? (
        <Text
          className="text-red-500 px-4
                font-mmedium">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default OtpField;
