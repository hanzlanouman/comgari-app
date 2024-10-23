import { useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { images } from "@/constants";
import InputField from "@/components/InputField";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <ImageBackground
      source={images.login}
      resizeMode="cover"
      className="w-full h-screen"
    >
      <View className="bg-white rounded-t-3xl p-5 absolute left-0 bottom-0 w-full">
        <Text className="text-dark text-center font-ManropBold text-xl sm:text-2xl">
          Let’s Connect With Us!
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
        <View className="mt-3">
          <InputField
            label=""
            value={form.password}
            onChangeText={(value: string) =>
              setForm({ ...form, password: value })
            }
            placeholder="Password"
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(auth)/forgot-password");
          }}
          className="flex-row justify-end mt-3"
        >
          <Text className="text-sm sm:text-base text-blue font-ManropeMedium">
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <View className="mt-5">
          <CustomButton title="Sign In" onPress={() => router.replace("/")} />
        </View>
        <View className="flex-row items-center justify-center my-5">
          <Text className="text-sm sm:text-base text-dark font-ManropMedium">
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.replace("/(auth)/sign-up");
            }}
            className="ml-1 relative -top-[1]"
          >
            <Text className="text-blue text-sm sm:text-base font-ManropSemibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignIn;
