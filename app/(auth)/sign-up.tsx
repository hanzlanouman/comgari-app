import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "@/common/components/InputField";
import CustomButton from "@/common/components/CustomButton";
import { router } from "expo-router";
import { AuthRepository } from "@/repositories/auth/auth";
import AppContainer from "@/common/components/AppContainer";
import { useMutation } from "react-query";
import { SignupPayload } from "@/repositories/auth/schemas";
import { OTP_TYPE } from "@/common/enum";
import { route } from "@/common";
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";

// Add type declaration for custom method
declare module "yup" {
  interface StringSchema {
    notMatchOtherField(otherField: string, message: string): StringSchema;
  }
}

const SignUp = () => {
  useRedirectIfIOS();
  const authRepo = AuthRepository.getInstance();
  const { mutate, isError, error } = useMutation<
    any,
    Error,
    Partial<SignupPayload>
  >((payload) => authRepo.register(payload));

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
      <AppContainer isError={isError} message={error?.message as string}>
        <ScrollView className="flex-1 px-5 py-4">
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
              error={formik.touched.businessName && formik.errors.businessName}
              placeholder="Business name"
            />
          </View>

          <View className="mt-3">
            <InputField
              value={formik.values.phoneNumber}
              onChangeText={formik.handleChange("phoneNumber")}
              onBlur={formik.handleBlur("phoneNumber")}
              error={formik.touched.phoneNumber && formik.errors.phoneNumber}
              placeholder="Contact number"
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

          <View className="mt-3">
            <InputField
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              placeholder="Confirm password"
              secureTextEntry={true}
            />
          </View>
        </ScrollView>
      </AppContainer>

      <View className="px-4 py-4 bg-white">
        <CustomButton
          title="Sign Up"
          onPress={() => {
            formik.handleSubmit();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
