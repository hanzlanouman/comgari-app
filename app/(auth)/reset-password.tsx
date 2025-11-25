import { SafeAreaView, View, Text } from "react-native";
import InputField from "@/common/components/InputField";
import CustomButton from "@/common/components/CustomButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
  ResetPassowrdSchema,
  ResetPasswordPayload,
} from "@/repositories/auth/schemas";
import { useFormik } from "formik";
import { AuthRepository } from "@/repositories/auth/auth";
import AppContainer from "@/common/components/AppContainer";
import { route } from "@/common";
type ResetPasswordProps = {
  otp: string;
  username: string;
};
const ResetPassword = () => {
  const AuthRepo = AuthRepository.getInstance();
  const { otp, username } = useLocalSearchParams<ResetPasswordProps>();

  const router = useRouter();

  const { mutate, isError, error } = useMutation({
    mutationFn: (resetPasswordPayload: ResetPasswordPayload) =>
      AuthRepo.resetPassword(resetPasswordPayload),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordConfirm: "",
      username: username,
      otp: otp,
    },
    validationSchema: ResetPassowrdSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => {
          router.push(route.auth.login);
        },
      });
    },
  });

  return (
    <AppContainer isError={isError} message={error?.message}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-4">
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
            Set a new password. Create a strong password with numbers, letters,
            and symbols.
          </Text>
          <View className="mt-6">
            <InputField
              label=""
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              placeholder="New password"
              onBlur={() => {
                formik.handleBlur("password");
              }}
              secureTextEntry={true}
            />
          </View>
          <View className="mt-3">
            <InputField
              label=""
              value={formik.values.passwordConfirm}
              onChangeText={formik.handleChange("passwordConfirm")}
              placeholder="Confirm password"
              secureTextEntry={true}
            />
          </View>
        </View>
        <View className="px-4">
          <CustomButton
            title="Reset Password"
            onPress={() => {
              formik.values.username = username;
              formik.handleSubmit();
            }}
          />
        </View>
      </SafeAreaView>
    </AppContainer>
  );
};

export default ResetPassword;
