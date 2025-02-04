import { useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { images } from "@/constants";
import InputField from "@/common/components/InputField";
import { router } from "expo-router";
import CustomButton from "@/common/components/CustomButton";
import { useFormik } from "formik";
import {
  LoginPayload,
  LoginSchema,
} from "@/repositories/auth/schemas";
import AppContainer from "@/common/components/AppContainer";
import { AuthRepository } from "@/repositories/auth/auth";
import { useMutation } from "react-query";
import { route } from "@/common";
import { useAppDispatch } from "@/hooks/redux";
import { login, setSubscribed } from "@/store";
import { OTP_TYPE } from "@/common/enum";

const SignIn = () => {
  const AuthRepo = AuthRepository.getInstance();
  const dispatch = useAppDispatch();
  const [otpScreen, setOtpScreen] = useState(false);

  const { mutate, isError, error } = useMutation({
    mutationFn: (payload: LoginPayload) => AuthRepo.login(payload),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      // First, validate all fields
      const errors: { email?: string; password?: string } = {};

      if (!values.email) {
        errors.email = "Email is required";
      }

      if (!values.password) {
        errors.password = "Password is required";
      }

      // If there are any errors, set them and prevent submission
      if (Object.keys(errors).length > 0) {
        formik.setErrors(errors);
        return;
      }

      mutate(values, {

        onSuccess: (data) => {
          dispatch(login(data));
          dispatch(setSubscribed(data.user.subscription));
          console.log("data.user.subscription", data.user.subscription)
          if (!data.user.subscription) {
            
            router.push({
              pathname: "/(auth)/go-pro",
            });
          }
          
        },
        onError: (error) => {
          // Specific error handling for account verification
          if (error.message === "Please Verify Your Account First") {
            setOtpScreen(true);
            // Alert.alert(
            //   "Account Verification",
            //   "Please verify your account before logging in.",
            //   [
            //     {
            //       text: "Verify Now",
            //       onPress: () => {
            //         router.push({
            //           pathname: route.auth.Otp,
            //           params: {
            //             username: values.email,
            //             type: OTP_TYPE.MEMBER_VERIFICATION,
            //           },
            //         });
            //       },
            //     },
            //     { text: "Cancel", style: "cancel" },
            //   ]
            // );
          } 
        },
      });
    },
  });

  const onClick = () => {
    router.push({
      pathname: route.auth.Otp,
      params: {
        username: formik.values.email,
        type: OTP_TYPE.MEMBER_VERIFICATION,
      },
    });
  };

  return (
    <AppContainer
      hasScroll
      isError={isError}
      message={error?.message}
      onPress={otpScreen ? onClick : undefined}>
      <ImageBackground
        source={images.login}
        resizeMode="cover"
        className="w-full h-screen">
        <View className="bg-white rounded-t-3xl p-5 absolute left-0 bottom-0 w-full">
          <Text className="text-dark text-center font-ManropeBold text-xl sm:text-2xl">
            Let's Connect With Us!
          </Text>
          <View className="mt-6">
            <InputField
              label=""
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              placeholder="Email"
              keyboardType="email-address"
              onBlur={formik.handleBlur("email")}
              error={formik.touched.email ? formik.errors.email : undefined}
            />
          </View>
          <View className="mt-3">
            <InputField
              label=""
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              placeholder="Password"
              secureTextEntry={true}
              onBlur={formik.handleBlur("password")}
              error={formik.touched.password ? formik.errors.password : undefined}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push(route.auth.forgotPassword);
            }}
            className="flex-row justify-end mt-3">
            <Text className="text-sm sm:text-base text-blue font-ManropeMedium">
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <View className="mt-5">
            <CustomButton
              title="Sign In"
              onPress={() => formik.handleSubmit()}
            />
          </View>
          <View className="flex-row items-center justify-center my-5">
            <Text className="text-sm sm:text-base text-dark font-ManropeMedium">
              Doesn't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.replace(route.auth.register);
              }}
              className="ml-1 relative -top-[1]">
              <Text className="text-blue text-sm sm:text-base font-ManropeSemibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </AppContainer>
  );
};

export default SignIn;