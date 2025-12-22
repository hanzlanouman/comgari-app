/* eslint-disable prettier/prettier */
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef } from "react";
import CustomButton from "@/common/components/CustomButton";
import { Href, useLocalSearchParams } from "expo-router";
import { OTP_TYPE } from "@/common/enum";
import { useRouter } from "expo-router";
import { TVerifyCredPayload } from "@/repositories/auth/types";
import { useFormik } from "formik";
import { OtpSchema } from "@/repositories/auth/schemas";
import { useMutation } from "@tanstack/react-query";
import { AuthRepository } from "@/repositories/auth/auth";
import { TextInput } from "react-native";
import OtpField from "@/common/components/OtpField";
import { route } from "@/common";
import { AppContainer, ErrorText } from "@/common/components";
import { useAppDispatch } from "@/hooks/redux";
import { login, setSubscribed } from "@/store";
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
  }
  | {
    username: string;
    type: OTP_TYPE.MEMBER_VERIFICATION;
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

  const {
    mutate: verfifyCred,
    isError,
    error,
  } = useMutation({
    mutationFn: async (payload: TVerifyCredPayload) => {
      try {
        // Parse authResponse if it's a string
        const parsedAuthResponse =
          typeof authResponse === "string" && authResponse
            ? JSON.parse(authResponse)
            : authResponse;

        return await AuthRepo.verifyCred(payload, parsedAuthResponse);
      } catch (err) {
        console.error("Error in verifyCred:", err);
        throw err;
      }
    },
    onSuccess: () => {
      if (type === OTP_TYPE.MEMBER_VERIFICATION) {
        router.push(route.auth.login);
      } else {
        // Parse authResponse and log in the user
        // Trial subscription is now auto-created during signup
        // Navigate directly to home instead of go-pro
        try {
          const parsedAuthResponse =
            typeof authResponse === "string" && authResponse
              ? JSON.parse(authResponse)
              : authResponse;

          if (parsedAuthResponse) {
            dispatch(login(parsedAuthResponse));
            // User has auto-trial subscription created during signup
            dispatch(setSubscribed(true));
          }

          router.replace({
            pathname: "/(root)/(tabs)/home",
            params: { showTrialStartModal: "true" }
          });
        } catch (err) {
          console.error("Error parsing authResponse:", err);
          // Fallback to go-pro if parsing fails
          router.push({
            pathname: "/(auth)/go-pro",
            params: {
              authResponse: authResponse,
            },
          });
        }
      }
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
          pathname: route.auth.resetPassword,
          params: { username: username, otp: formik.values.otp.join("") },
        });
        break;
      case OTP_TYPE.MEMBER_VERIFICATION:
        verfifyCred({
          username,
          otp,
        });

      default:
        break;
    }
  };
  return (
    <AppContainer isError={isError} message={error?.message as string}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-4">
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-3">
            Verification code sent to your contact number and email. Please
            check your SMS or email.{" "}
          </Text>
          <View className="flex-row -mx-2 mt-5 mb-2">
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
              />
            ))}
          </View>
          <ErrorText
            error={
              formik.touched.otp && formik.errors.otp
                ? typeof formik.errors.otp === "string"
                  ? formik.errors.otp
                  : "Please enter the correct OTP code."
                : ""
            }
          />
          <Text className="bg-white text-sm sm:text-base text-black font-ManropeMedium pt-4 pb-7">
            Don't receive OTP:{" "}
            <Text
              className="text-blue underline font-ManropeSemibold"
              onPress={resendOtp}
            >
              Resend code
            </Text>
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
