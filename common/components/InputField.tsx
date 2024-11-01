/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff, RefreshCcw } from "lucide-react-native"; // Import an icon for password generation
import { InputFieldProps } from "@/types/type";

export const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  error,
  errorStyle,
  generatePasswordIcon = false, // New prop for displaying generate password icon
  onGeneratePassword, // New function prop for generating password
  className,
  ref,
  ...props
}: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);
  const [inputValue, setInputValue] = useState("");

  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-10);
    setInputValue(randomPassword);
    if (onGeneratePassword) {
      onGeneratePassword(randomPassword);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full">
          {label && (
            <Text className={`text-sm font-ManropMedium ${labelStyle}`}>
              {label}
            </Text>
          )}
          <View
            className={`flex flex-row justify-start items-center relative bg-white rounded-xl border border-light ${containerStyle}`}>
            {icon && <View className={`ml-4 ${iconStyle}`}>{icon}</View>}
            <TextInput
              className={`rounded-xl p-4 font-ManropMedium text-[15px] flex-1 lowercase ${inputStyle} text-left`}
              secureTextEntry={isPasswordVisible}
              value={inputValue}
              onChangeText={setInputValue}
              {...props}
              placeholderTextColor="#4A4A4A"
              ref={ref}
            />
            {secureTextEntry && (
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                className="p-2.5 mr-1">
                {isPasswordVisible ? (
                  <EyeOff width={18} height={18} color="#4A4A4A" />
                ) : (
                  <Eye width={18} height={18} color="#4A4A4A" />
                )}
              </TouchableOpacity>
            )}
            {generatePasswordIcon && (
              <TouchableOpacity
                onPress={generatePassword}
                className="p-2.5 mr-1">
                <RefreshCcw width={18} height={18} color="#4A4A4A" />
              </TouchableOpacity>
            )}
          </View>
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
