import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useFormik } from "formik";
import * as yup from "yup";
import InputField from "@/common/components/InputField";
import CustomButton from "@/common/components/CustomButton";
import AppContainer from "@/common/components/AppContainer";
import { AuthRepository } from "@/repositories/auth/auth";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks/redux";
import { login, setSubscribed } from "@/store";
import { useLocalSearchParams } from "expo-router";

const validationSchema = yup.object({
  user_name: yup.string().required("Username is required"),
  business_name: yup.string().required("Business name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+\d{1,4}/, "Phone must start with country code (e.g. +92)"),
});

const GoogleProfile = () => {
  const params = useLocalSearchParams<{
    token: string;
    server_auth_code?: string;
    access_token?: string;
    refresh_token?: string;
    email?: string;
    given_name?: string;
    family_name?: string;
  }>();

  const AuthRepo = AuthRepository.getInstance();
  const dispatch = useAppDispatch();

  const { mutate, isError, error } = useMutation({
    mutationFn: (payload: {
      token: string;
      server_auth_code?: string;
      access_token?: string;
      refresh_token?: string;
      user_name: string;
      business_name: string;
      phone: string;
    }) => AuthRepo.googleSignUp(payload),
  });

  const formik = useFormik({
    initialValues: {
      user_name: params.given_name || "",
      business_name: "",
      phone: "+92",
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(
        {
          token: params.token,
          server_auth_code: params.server_auth_code,
          access_token: params.access_token as string | undefined,
          refresh_token: params.refresh_token as string | undefined,
          user_name: values.user_name,
          business_name: values.business_name,
          phone: values.phone,
        },
        {
          onSuccess: (data) => {
            dispatch(login(data));

            const hasSubscriptionAccess =
              data.hasSubscriptionAccess ?? data.user.subscription;

            dispatch(setSubscribed(hasSubscriptionAccess));

            Alert.alert(
              "Welcome to Comgari! 🎉",
              "Your 7-day free trial has started!\n\nEnjoy full access to all features for the next 7 days.\n\n⚠️ Important: A payment method is required to continue after your free trial.",
              [
                {
                  text: "Get Started",
                  onPress: () => {
                    
                    if (!hasSubscriptionAccess) {
                      router.push({
                        pathname: "/(auth)/go-pro",
                      });
                    } else {
                      router.replace("/(root)/(tabs)/home");
                    }
                  },
                },
              ]
            );
          },
          onError: (error: any) => {
            console.error("Google signup error:", error);
          },
        }
      );
    },
  });

  return (
    <AppContainer
      hasScroll
      isError={isError}
      message={(error as any)?.message}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View className="bg-white rounded-3xl p-6 w-full">
            <Text className="text-dark text-center font-ManropeBold text-2xl mb-2">
              Complete Your Profile
            </Text>
            <Text className="text-gray-600 text-center font-ManropeRegular text-sm mb-6">
              Just a few more details to get started
            </Text>

            {params.email && (
              <View className="mb-4">
                <InputField
                  label="Email"
                  value={params.email}
                  editable={false}
                  placeholder="Email"
                />
              </View>
            )}

            <View className="mb-4">
              <InputField
                label="Username"
                value={formik.values.user_name}
                onChangeText={formik.handleChange("user_name")}
                placeholder="Enter your username"
                onBlur={formik.handleBlur("user_name")}
                error={
                  formik.touched.user_name ? formik.errors.user_name : undefined
                }
              />
            </View>

            <View className="mb-4">
              <InputField
                label="Business Name"
                value={formik.values.business_name}
                onChangeText={formik.handleChange("business_name")}
                placeholder="Enter your business name"
                onBlur={formik.handleBlur("business_name")}
                error={
                  formik.touched.business_name
                    ? formik.errors.business_name
                    : undefined
                }
              />
            </View>

            <View className="mb-6">
              <InputField
                label="Phone Number"
                value={formik.values.phone}
                onChangeText={formik.handleChange("phone")}
                placeholder="+92 300 1234567"
                keyboardType="phone-pad"
                onBlur={formik.handleBlur("phone")}
                error={formik.touched.phone ? formik.errors.phone : undefined}
              />
            </View>

            <CustomButton
              title="Complete Sign Up"
              onPress={() => formik.handleSubmit()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default GoogleProfile;
