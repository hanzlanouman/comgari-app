import { SafeAreaView, View, Text } from "react-native";
import { useState } from "react";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const ResetPassword = () => {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-dark font-ManropeBold text-xl sm:text-2xl">
          Reset Your Password
        </Text>
        <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
          Password must be different than before.
        </Text>
        <View className="mt-6">
          <InputField
            label=""
            value={form.newPassword}
            onChangeText={(value: string) =>
              setForm({ ...form, newPassword: value })
            }
            placeholder="New password"
            secureTextEntry={true}
          />
        </View>
        <View className="mt-3">
          <InputField
            label=""
            value={form.confirmPassword}
            onChangeText={(value: string) =>
              setForm({ ...form, confirmPassword: value })
            }
            placeholder="Confirm password"
            secureTextEntry={true}
          />
        </View>
      </View>
      <View className="px-4">
        <CustomButton title="Reset Password" onPress={() => router.push("/")} />
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
