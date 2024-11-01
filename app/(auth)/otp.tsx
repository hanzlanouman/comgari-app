/* eslint-disable prettier/prettier */
import { SafeAreaView, View, Text } from "react-native";
import InputField from "@/common/components/InputField";
import { useRef, useState } from "react";
import CustomButton from "@/common/components/CustomButton";
import { Link, router, useLocalSearchParams } from "expo-router";
import { OTP_TYPE } from "@/common/enum";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/hooks/redux";
import { TLoginResponse, TVerifyCredPayload } from "@/repositories/auth/types";
import { useFormik } from "formik";
import { OtpSchema } from "@/repositories/auth/schemas";
import { useMutation } from "react-query";
import { login } from "@/store";
import { AuthRepository } from "@/repositories/auth/auth";
import { TextInput } from "react-native-gesture-handler";
import OtpField from "@/common/components/OtpField";
import { route } from "@/common";
import { AppContainer } from "@/common/components";
export type TOtpProps =
  | {
      username: string;
      authResponse: string;
      type: OTP_TYPE.VIERIFICATION;
    }
  | {
      username: string;
      type: OTP_TYPE.PASSWORD_RESET;
      authResponse?: string;
    };
export type TOtpComponentProps = {
  afterVerifyRoute: string;
  resetPassworRoute: string;
};
const Otp = ({ afterVerifyRoute, resetPassworRoute }: TOtpComponentProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const AuthRepo = AuthRepository.getInstance();
  const { username, authResponse, type } = useLocalSearchParams<TOtpProps>();
  const parsedAuthResponse: TLoginResponse = authResponse
    ? JSON.parse(authResponse)
    : undefined;
  const {
    mutate: verfifyCred,
    isError,
    error,
  } = useMutation({
    mutationFn: (payload: TVerifyCredPayload) =>
      AuthRepo.verifyCred(payload, parsedAuthResponse!),
    onSuccess: () => {
      dispatch(login(parsedAuthResponse));
      router.replace(route.auth.login);
    },
  });

  const formik = useFormik({
    initialValues: {
      otp: ["", "", "", ""],
    },
    validationSchema: OtpSchema,
    onSubmit: () => {
      handleSubmit(formik.values.otp.join(""));
    },
  });
  const inputRefs = useRef<(TextInput | null)[]>(Array(4).fill(null));

  const handleChange = (text: string, index: number) => {
    const newOtp = [...formik.values.otp];
    newOtp[index] = text;
    formik.setFieldValue("otp", newOtp);

    if (newOtp[index].length > 0) {
      inputRefs.current[index + 1]?.focus();
    } else {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const resendOtp = async () => {
    try {
      await AuthRepo.sendOtp({ username });
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (otp: string) => {
    switch (type) {
      case OTP_TYPE.VIERIFICATION:
        verfifyCred({
          username,
          otp,
        });

        break;

      case OTP_TYPE.PASSWORD_RESET:
        router.push({
          pathname: route.auth.Otp,
          params: { username: username, otp: formik.values.otp.join("") },
        });
        break;

      default:
        break;
    }
  };
  return (
    <AppContainer isError={isError} message={Error?.message}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-4">
          <Text className="text-dark font-ManropeBold text-xl sm:text-2xl">
            Enter OTP Code!
          </Text>
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-3">
            We have send the code to{" "}
            <Text className="font-ManropeMedium text-blue">+92 3410566466</Text>
            , and
            <Text className="font-ManropeMedium text-blue"> {username}</Text>
          </Text>
          <View className="flex-row -mx-2">
            {formik.values.otp.map((_, index) => (
              <OtpField
                key={index}
                title=""
                value={formik.values.otp[index]}
                handleChangeText={(text) => handleChange(text, index)}
                placeholder="0"
                otherStyles="mt-8 w-3/12 px-2"
                inputStyles="text-center"
                type="text"
                index={index}
                inputRef={inputRefs}
                error={
                  formik.touched.otp && formik.errors.otp
                    ? formik.errors.otp
                    : ""
                }
              />
            ))}
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
            onPress={() => {
              formik.handleSubmit();
            }}
          />
        </View>
      </SafeAreaView>
    </AppContainer>
  );
};

export default Otp;
