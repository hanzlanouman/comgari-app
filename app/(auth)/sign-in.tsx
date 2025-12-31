import { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
let GoogleSignin: any = null;
try {
  GoogleSignin =
    require("@react-native-google-signin/google-signin").GoogleSignin;
} catch (e) {
  console.warn("GoogleSignin not available (expected in Expo Go)");
}

// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { images } from "@/constants";
import InputField from "@/common/components/InputField";
import { router } from "expo-router";
import CustomButton from "@/common/components/CustomButton";
import { useFormik } from "formik";
import { LoginPayload, LoginSchema } from "@/repositories/auth/schemas";
import AppContainer from "@/common/components/AppContainer";
import { AuthRepository } from "@/repositories/auth/auth";
import { PaymentRepository } from "@/repositories/payment/payment";
import { useMutation } from "@tanstack/react-query";
import { route } from "@/common";
import { useAppDispatch } from "@/hooks/redux";
import { login, logout, setSubscribed } from "@/store";
import { OTP_TYPE } from "@/common/enum";
import { IS_ANDROID, IS_IOS } from "@/utils";


const REMEMBER_ME_KEY = "comgari_remembered_email";

const SignIn = () => {
  const AuthRepo = AuthRepository.getInstance();
  const PaymentRepo = PaymentRepository.getInstance();
  const dispatch = useAppDispatch();
  const [otpScreen, setOtpScreen] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { mutate, isError, error } = useMutation({
    mutationFn: (payload: LoginPayload) => AuthRepo.login(payload),
  });

  // Check if user has SuperAdmin role
  const isSuperAdmin = (userData: any) => {
    return userData.user.user_roles.some(
      (userRole: any) => userRole.role?.name === "SuperAdmin"
    );
  };

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

      // Handle Remember Me
      if (rememberMe) {
        AsyncStorage.setItem(REMEMBER_ME_KEY, values.email);
      } else {
        AsyncStorage.removeItem(REMEMBER_ME_KEY);
      }

      mutate(values, {
        onSuccess: async (data) => {
          if (isSuperAdmin(data)) {
            Alert.alert(
              "SuperAdmin Access",
              "The SuperAdmin dashboard is not available on the app. Please go to the website to access the SuperAdmin dashboard.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    dispatch(logout());
                  },
                },
              ]
            );
            return;
          }

          dispatch(login(data));

          // Check if user has subscription or is on trial
          let hasSubscriptionAccess = data.user.subscription;

          // If subscription is false, check if user is on trial
          // Trial users should have access to the dashboard
          if (!hasSubscriptionAccess) {
            try {
              // Pass the access token since it's not yet stored in the API client
              const trialStatus = await PaymentRepo.getTrialStatus();
              // If user is on trial or has active subscription, grant access
              if (
                trialStatus?.is_on_trial ||
                trialStatus?.has_active_subscription
              ) {
                hasSubscriptionAccess = true;
              }
            } catch (error) {
              // If trial status check fails, use the original subscription flag
              console.log(
                "Trial status check failed, using original subscription flag"
              );
            }
          }

          dispatch(setSubscribed(hasSubscriptionAccess));

          // Navigate based on subscription/trial status
          if (!hasSubscriptionAccess) {
            router.push({
              pathname: "/(auth)/go-pro",
            });
          }
        },
        onError: (error: any) => {
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

  // Load remembered email on mount
  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const email = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        if (email) {
          formik.setFieldValue("email", email);
          setRememberMe(true);
        }
      } catch (error) {
        console.log("Error loading remembered email:", error);
      }
    };
    loadRememberedEmail();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Get ID token and server auth code from userInfo
      const idToken = userInfo?.data?.idToken;
      const serverAuthCode = userInfo?.data?.serverAuthCode;

      if (!idToken && !serverAuthCode) {
        throw new Error("No tokens received from Google");
      }

      // Call backend
      const result = await AuthRepo.googleSignIn({
        token: idToken || undefined,
        server_auth_code: serverAuthCode || undefined
      });

      if (result.isSignup) {
        // New user - navigate to profile screen
        router.push({
          pathname: "/(auth)/google-profile" as any,
          params: {
            token: idToken,
            server_auth_code: serverAuthCode,
            email: result.email,
            given_name: result.given_name,
            family_name: result.family_name,
          },
        });
      } else {
        // Existing user - login
        dispatch(login(result));

        let hasSubscriptionAccess = result.user.subscription;

        if (!hasSubscriptionAccess) {
          try {
            const trialStatus = await PaymentRepo.getTrialStatus();
            if (
              trialStatus?.is_on_trial ||
              trialStatus?.has_active_subscription
            ) {
              hasSubscriptionAccess = true;
            }
          } catch (error) {
            console.log("Trial status check failed");
          }
        }

        dispatch(setSubscribed(hasSubscriptionAccess));

        if (!hasSubscriptionAccess) {
          router.push({
            pathname: "/(auth)/go-pro",
          });
        }
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        "Google Sign-In Failed",
        error.message || "Please try again"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

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
      message={(error as any)?.message}
      onPress={otpScreen ? onClick : undefined}
      style={[
        styles.scrollContainerBase,
        IS_ANDROID ? styles.scrollContainerAndroid : styles.scrollContainerIos,
      ]}
    >
      <ImageBackground
        source={images.login}
        resizeMode="cover"
        className="w-full h-screen"
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          <View
            className="bg-white rounded-t-3xl p-5 w-full"
            style={styles.formWrapper}
          >
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
                error={
                  formik.touched.password ? formik.errors.password : undefined
                }
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push(route.auth.forgotPassword);
              }}
              className="flex-row justify-end mt-3"
            >
              <Text className="text-sm sm:text-base text-blue font-ManropeMedium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center mt-3"
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderColor: "#4F46E5",
                  borderRadius: 4,
                  backgroundColor: rememberMe ? "#4F46E5" : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {rememberMe && (
                  <Text style={{ color: "white", fontSize: 14 }}>✓</Text>
                )}
              </View>
              <Text className="ml-2 text-sm text-dark font-ManropeMedium">
                Remember me
              </Text>
            </TouchableOpacity>
            <View className="mt-5">
              <CustomButton
                title="Sign In"
                onPress={() => formik.handleSubmit()}
              />
            </View>
            <View className="mt-3">
              {googleLoading ? (
                <View className="bg-white border border-gray-300 rounded-lg py-3 flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="#4F46E5" />
                  <Text className="ml-2 text-dark font-ManropeMedium">
                    Signing in with Google...
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleGoogleSignIn}
                  className="bg-white border border-gray-300 rounded-lg py-3 flex-row justify-center items-center"
                >
                  <Text className="text-dark font-ManropeMedium text-base">
                    🔐 Continue with Google
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {IS_ANDROID && (
              <View className="flex-row items-center justify-center my-5">
                <Text className="text-sm sm:text-base text-dark font-ManropeMedium">
                  Doesn't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.replace(route.auth.register);
                  }}
                  className="ml-1 relative -top-[1]"
                >
                  <Text className="text-blue text-sm sm:text-base font-ManropeSemibold">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainerBase: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  scrollContainerIos: {
    paddingBottom: 40,
  },
  scrollContainerAndroid: {
    paddingBottom: 80,
  },
  background: {
    flex: 1,
    width: "100%",
  },
  formWrapper: {
    paddingBottom: 24,
  },
});

export default SignIn;
