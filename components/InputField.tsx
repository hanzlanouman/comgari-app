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
  className,
  ...props
}: InputFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full">
          {label && (
            <Text className={`text-sm font-ManropeMedium mb-1.5 ${labelStyle}`}>
              {label}
            </Text>
          )}
          <View
            className={`h-12 sm:h-[52] flex flex-row justify-start items-center relative bg-white rounded-xl border border-light ${containerStyle}`}
          >
            {icon && <View className={`ml-4 ${iconStyle}`}>{icon}</View>}
            <TextInput
              className={`rounded-xl p-4 font-ManropeMedium text-[15px] flex-1 lowercase ${inputStyle} text-left`}
              secureTextEntry={isPasswordVisible}
              {...props}
              placeholderTextColor="#1C1C1C"
              style={{ paddingBottom: Platform.OS === "ios" ? 16 : 15 }}
            />
            {secureTextEntry && (
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                className="p-2.5 mr-1"
              >
                {isPasswordVisible ? (
                  <EyeOff width={18} height={18} color="#4A4A4A" />
                ) : (
                  <Eye width={18} height={18} color="#4A4A4A" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
