import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/common/components/InputField";
import { useRouter } from "expo-router";
import CustomButton from "@/common/components/CustomButton";
import { useFormik } from "formik";
import {
  forgotPasswordPayload,
  forgotPasswordSchema,
} from "@/repositories/auth/schemas";
import { AuthRepository } from "@/repositories/auth/auth";
import { useMutation } from "@tanstack/react-query";
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
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
        <View className="flex-1 p-4">
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-3">
            Enter your email below to receive a password reset link.{" "}
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
        <View className="px-4 pb-4">
          <CustomButton
            title="Send Code"
            onPress={() => {
              formik.handleSubmit();
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ForgotPassword;
