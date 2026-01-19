import {
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "@/common/components/InputField";
import { PhoneField } from "@/common/components";
import CustomButton from "@/common/components/CustomButton";
import { router } from "expo-router";
import { AuthRepository } from "@/repositories/auth/auth";
import AppContainer from "@/common/components/AppContainer";
import { useMutation } from "@tanstack/react-query";
import { SignupPayload } from "@/repositories/auth/schemas";
import { OTP_TYPE } from "@/common/enum";
import { route } from "@/common";
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";
import { GoogleIOSClientID, GoogleWebClientID } from "@/common/enviornment";
import { images } from "@/constants";
import { IS_IOS } from "@/utils";

let GoogleSignin: any = null;
try {
  GoogleSignin =
    require("@react-native-google-signin/google-signin").GoogleSignin;
} catch (e) {
  console.warn("GoogleSignin not available (expected in Expo Go)");
}

// import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Add type declaration for custom method
declare module "yup" {
  interface StringSchema {
    notMatchOtherField(otherField: string, message: string): StringSchema;
  }
}

const SignUp = () => {
  useRedirectIfIOS();
  const authRepo = AuthRepository.getInstance();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { mutate, isError, error } = useMutation<
    any,
    Error,
    Partial<SignupPayload>
  >({
    mutationFn: (payload) => authRepo.register(payload),
  });

  // Configure Google Sign-In once (required before signIn)
  useEffect(() => {
    if (Platform.OS === "web" || !GoogleSignin) {
      return;
    }

    try {
      GoogleSignin.configure({
        webClientId: GoogleWebClientID,
        iosClientId: GoogleIOSClientID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        scopes: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
      });
    } catch (error) {
      console.warn("Failed to configure GoogleSignin:", error);
    }
  }, []);

  // Google Sign-Up handler (same flow as sign-in for new users)
  const handleGoogleSignUp = async () => {
    if (Platform.OS === "web" || !GoogleSignin) {
      Alert.alert(
        "Not Available",
        "Google Sign-In is not available in this environment"
      );
      return;
    }
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Get ID token and server auth code from userInfo
      const idToken = userInfo?.idToken || userInfo?.data?.idToken;
      const serverAuthCode =
        userInfo?.serverAuthCode || userInfo?.data?.serverAuthCode;

      if (!idToken && !serverAuthCode) {
        throw new Error("No tokens received from Google");
      }

      // Call backend
      const apiResult = await authRepo.googleSignIn({
        token: idToken || undefined,
        server_auth_code: serverAuthCode || undefined,
      });

      // Backend may wrap new-user response inside `data`; normalize it
      const payload = apiResult?.data ?? apiResult;
      const {
        isSignup,
        email,
        given_name,
        family_name,
        token: tokenFromApi,
        server_auth_code: codeFromApi,
        access_token,
        refresh_token,
      } = payload || {};

      if (isSignup) {
        // New user - navigate to profile screen
        router.push({
          pathname: "/(auth)/google-profile" as any,
          params: {
            token: idToken || tokenFromApi,
            server_auth_code: serverAuthCode || codeFromApi,
            access_token,
            refresh_token,
            email,
            given_name,
            family_name,
          },
        });
      } else {
        // Existing user - redirect to sign-in
        Alert.alert(
          "Account Exists",
          "An account with this email already exists. Please sign in instead.",
          [
            {
              text: "Go to Sign In",
              onPress: () => router.replace(route.auth.login),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("Google Sign-Up Error:", error);
      Alert.alert("Google Sign-Up Failed", error.message || "Please try again");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Custom test for unique values across fields
  // Using a simpler implementation for custom method
  Yup.addMethod(
    Yup.string,
    "notMatchOtherField",
    function (otherField, message) {
      // @ts-ignore - Ignoring TypeScript errors for 'this' context
      return this.test({
        name: "not-match-other-field",
        message,
        test: function (value) {
          // @ts-ignore
          const otherValue = this.parent[otherField];
          return value !== otherValue;
        },
      });
    }
  );

  const formik = useFormik({
    initialValues: {
      user_name: "",
      fullName: "",
      email: "",
      businessName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      user_name: Yup.string()
        .required("User name is required")
        .notMatchOtherField(
          "phoneNumber",
          "Username cannot be the same as phone number"
        )
        .min(3, "Username must be at least 3 characters"),
      fullName: Yup.string()
        .required("Full name is required")
        .min(2, "Full name must be at least 2 characters"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      businessName: Yup.string()
        .required("Business name is required")
        .min(2, "Business name must be at least 2 characters"),
      phoneNumber: Yup.string()
        .required("Contact number is required")
        .notMatchOtherField(
          "user_name",
          "Phone number cannot be the same as username"
        )
        .matches(
          /^\+[1-9]\d{1,14}$/,
          "Phone number must include country code (e.g., +1 for US)"
        ),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: (values) => {
      const payload = {
        business_name: values.businessName,
        full_name: values.fullName,
        password: values.password,
        user_name: values.user_name,
        phone: values.phoneNumber,
        email: values.email,
      };

      mutate(payload, {
        onSuccess: (data) => {
          router.push({
            pathname: route.auth.Otp,
            params: {
              username: formik.values.email,
              type: OTP_TYPE.VIERIFICATION,
              authResponse: JSON.stringify(data),
            },
          });
        },
      });
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <AppContainer isError={isError} message={error?.message as string}>
          <ScrollView
            className="flex-1 px-5 py-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
              Set up your Comgari account by filling in the details below.{"\n"}
              Already have an account?{" "}
              <Text
                className="text-blue"
                onPress={() => router.push("/(auth)/sign-in")}
              >
                Log in here
              </Text>
            </Text>

            <View className="mt-6">
              <InputField
                value={formik.values.user_name}
                onChangeText={formik.handleChange("user_name")}
                onBlur={formik.handleBlur("user_name")}
                error={
                  formik.touched.user_name && formik.errors.user_name
                    ? formik.errors.user_name
                    : undefined
                }
                placeholder="User Name"
              />
            </View>

            <View className="mt-6">
              <InputField
                value={formik.values.fullName}
                onChangeText={formik.handleChange("fullName")}
                onBlur={formik.handleBlur("fullName")}
                error={
                  formik.touched.fullName && formik.errors.fullName
                    ? formik.errors.fullName
                    : undefined
                }
                placeholder="Full name"
              />
            </View>

            <View className="mt-3">
              <InputField
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                error={formik.touched.email && formik.errors.email}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>

            <View className="mt-3">
              <InputField
                value={formik.values.businessName}
                onChangeText={formik.handleChange("businessName")}
                onBlur={formik.handleBlur("businessName")}
                error={
                  formik.touched.businessName && formik.errors.businessName
                }
                placeholder="Business name"
              />
            </View>

            <View className="mt-3">
              <PhoneField
                value={formik.values.phoneNumber}
                onChangeText={formik.handleChange("phoneNumber")}
                // placeholder="Contact number"
                error={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? (formik.errors.phoneNumber as string)
                    : undefined
                }
              />
            </View>

            <View className="mt-3">
              <InputField
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                error={formik.touched.password && formik.errors.password}
                placeholder="Password"
                secureTextEntry={true}
              />
            </View>

            <View className="mt-3 mb-6">
              <InputField
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                error={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                placeholder="Confirm password"
                secureTextEntry={true}
              />
            </View>
          </ScrollView>

          <View className="px-4 py-4 mb-4 bg-white">
            <CustomButton
              title="Sign Up"
              onPress={() => {
                formik.handleSubmit();
              }}
            />
            {!IS_IOS && (
              <View className="mt-3">
                {googleLoading ? (
                  <View className="bg-white border border-gray-300 rounded-lg py-3 flex-row justify-center items-center">
                    <ActivityIndicator size="small" color="#4F46E5" />
                    <Text className="ml-2 text-dark font-ManropeMedium">
                      Signing up with Google...
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleGoogleSignUp}
                    className="bg-white border border-gray-300 rounded-lg py-3 flex-row justify-center items-center"
                  >
                    <Image
                      source={images.googleLogo}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                    />
                    <Text className="text-dark font-ManropeMedium text-base ml-2">
                      Continue with Google
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </AppContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
