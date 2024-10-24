import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useState } from "react";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    businessName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 px-5 py-4">
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
            Please complete all information to create your account on Comgari.
          </Text>
          <View className="mt-6">
            <InputField
              label=""
              value={form.fullName}
              onChangeText={(value: string) =>
                setForm({ ...form, fullName: value })
              }
              placeholder="Full name"
            />
          </View>
          <View className="mt-3">
            <InputField
              label=""
              value={form.email}
              onChangeText={(value: string) =>
                setForm({ ...form, email: value })
              }
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
          <View className="mt-3">
            <InputField
              label=""
              value={form.businessName}
              onChangeText={(value: string) =>
                setForm({ ...form, businessName: value })
              }
              placeholder="Business name"
            />
          </View>
          <View className="mt-3">
            <InputField
              label=""
              value={form.phoneNumber}
              onChangeText={(value: string) =>
                setForm({ ...form, phoneNumber: value })
              }
              placeholder="Contact number"
            />
          </View>
          <View className="mt-3">
            <InputField
              label=""
              value={form.password}
              onChangeText={(value: string) =>
                setForm({ ...form, newPassword: value })
              }
              placeholder="Password"
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
      </ScrollView>
      <View className="px-4 pt-4 bg-white">
        <CustomButton title="Sign Up" onPress={() => router.push("/")} />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
