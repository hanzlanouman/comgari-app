import { SafeAreaView, View, Text } from "react-native";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";

const Otp = () => {
  const [form, setForm] = useState({
    codeOne: "",
    codeTwo: "",
    codeThree: "",
    codeFour: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-dark font-ManropeBold text-xl sm:text-2xl">
          Enter OTP Code!
        </Text>
        <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-3">
          We have send the code to{" "}
          <Text className="font-ManropeMedium text-blue">+92 3410566466</Text>,
          and
          <Text className="font-ManropeMedium text-blue">
            {" "}
            info@comgari.com
          </Text>
        </Text>
        <View className="flex-row -mx-2 mt-8">
          <View className="w-3/12 px-2">
            <InputField
              label=""
              value={form.codeOne}
              onChangeText={(value: string) =>
                setForm({ ...form, codeOne: value })
              }
              placeholder=""
              className="text-center"
            />
          </View>
          <View className="w-3/12 px-2">
            <InputField
              label=""
              value={form.codeTwo}
              onChangeText={(value: string) =>
                setForm({ ...form, codeTwo: value })
              }
              placeholder=""
              className="text-center"
            />
          </View>
          <View className="w-3/12 px-2">
            <InputField
              label=""
              value={form.codeThree}
              onChangeText={(value: string) =>
                setForm({ ...form, codeThree: value })
              }
              placeholder=""
              className="text-center"
            />
          </View>
          <View className="w-3/12 px-2">
            <InputField
              label=""
              value={form.codeFour}
              onChangeText={(value: string) =>
                setForm({ ...form, codeFour: value })
              }
              placeholder=""
              className="text-center"
            />
          </View>
        </View>
        <Text className="bg-white text-sm sm:text-base text-black font-ManropeMedium pt-4 pb-7">
          Don’t receive OTP:{" "}
          <Link href="" className="text-blue underline font-ManropeSemibold">
            Resend code
          </Link>
        </Text>
      </View>
      <View className="px-4">
        <CustomButton
          title="Verify Now"
          onPress={() => router.push("/(auth)/reset-password")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Otp;
