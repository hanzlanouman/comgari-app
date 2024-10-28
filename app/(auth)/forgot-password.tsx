import { View, Text, SafeAreaView } from "react-native";
import { useState } from "react";
import InputField from "@/common/components/InputField";
import { router, useRouter } from "expo-router";
import CustomButton from "@/common/components/CustomButton";
import { useFormik } from "formik";
import {
  forgotPasswordPayload,
  forgotPasswordSchema,
} from "@/repositories/auth/schemas";
import { AuthRepository } from "@/repositories/auth/auth";
import { useMutation } from "react-query";
import { OTP_TYPE } from "@/common/enum";
type ForgotPasswordProps = {
  otpRoute: string;
};
const ForgotPassword = ({ otpRoute }: ForgotPasswordProps) => {
  const router = useRouter();
  const authrepo = AuthRepository.getInstance();

  const { mutate } = useMutation({
    mutationFn: (forgotPasswordPayLoad: forgotPasswordPayload) =>
      authrepo.forgotPassword(forgotPasswordPayLoad),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => {
          router.push({
            pathname: "/(auth)/otp",
            params: {
              username: formik.values.username,
              type: OTP_TYPE.PASSWORD_RESET,
            },
          });
        },
      });
    },
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
            value={formik.values.username}
            onChangeText={formik.handleChange("username")}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
      </View>
      <View className="px-4">
        <CustomButton
          title="Send Code"
          onPress={() => {
            formik.handleSubmit();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
