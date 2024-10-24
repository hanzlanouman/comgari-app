import { View, Text, SafeAreaView } from "react-native";
import { useState } from "react";
import InputField from "@/components/InputField";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-dark font-ManropeBold text-xl sm:text-2xl">
          Forgot Password
        </Text>
        <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-3">
          Enter the email address with your account and we'll send an email with
          confirmation to reset your password.
        </Text>
        <View className="mt-6">
          <InputField
            label=""
            value={form.email}
            onChangeText={(value: string) => setForm({ ...form, email: value })}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
      </View>
      <View className="px-4">
        <CustomButton
          title="Send Code"
          onPress={() => router.push("/(auth)/otp")}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
