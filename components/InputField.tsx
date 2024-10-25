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
import { Eye, EyeOff } from "lucide-react-native";
import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  error, // New error prop
  errorStyle, // New error style prop
  className,
  ...props
}: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

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
              {...props}
              placeholderTextColor="#4A4A4A"
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
          </View>
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
