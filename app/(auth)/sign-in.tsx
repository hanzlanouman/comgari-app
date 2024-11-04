import { useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { images } from "@/constants";
import InputField from "@/common/components/InputField";
import { router } from "expo-router";
import CustomButton from "@/common/components/CustomButton";
import { useFormik } from "formik";
import {
  LoginPayload,
  LoginSchema,
  SignupSchema,
} from "@/repositories/auth/schemas";
import AppContainer from "@/common/components/AppContainer";
import { AuthRepository } from "@/repositories/auth/auth";
import { useMutation } from "react-query";
import { route } from "@/common";
import { useAppDispatch } from "@/hooks/redux";
import { login } from "@/store";

const SignIn = () => {
  const AuthRepo = AuthRepository.getInstance();
  const dispatch = useAppDispatch();
  const { mutate, isError, error } = useMutation({
    mutationFn: (payload: LoginPayload) => AuthRepo.login(payload),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (value) => {
      mutate(value, {
        onSuccess: (data) => {
          dispatch(login(data));
        },
      });
    },
  });
  return (
    <AppContainer hasScroll isError={isError} message={error?.message}>
      <ImageBackground
        source={images.login}
        resizeMode="cover"
        className="w-full h-screen">
        <View className="bg-white rounded-t-3xl p-5 absolute left-0 bottom-0 w-full">
          <Text className="text-dark text-center font-ManropeBold text-xl sm:text-2xl">
            Let’s Connect With Us!
          </Text>
          <View className="mt-6">
            <InputField
              label=""
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              placeholder="Email"
              keyboardType="email-address"
              onBlur={formik.handleBlur("email")}
            />
          </View>
          <View className="mt-3">
            <InputField
              label=""
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              placeholder="Password"
              secureTextEntry={true}
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
