/* eslint-disable prettier/prettier */
import { SafeAreaView, ScrollView, View, Text } from "react-native";
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

const SignUp = () => {
  const authRepo = AuthRepository.getInstance();
  const { mutate, isError, error } = useMutation({
    mutationFn: (payload: Partial<SignupPayload>) => authRepo.register(payload),
  });
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
    validationSchema: Yup.object({
      user_name: Yup.string().required("User name is required"),
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      businessName: Yup.string().required("Business name is required"),
      phoneNumber: Yup.string().required("Contact number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
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
        role_id: 1,
      };
      console.log(payload, "Pay load is ");
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
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer isError={isError} message={error?.message}>
        <View className="flex-1 px-5 py-4">
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
            Please complete all information to create your account on Comgari.
          </Text>
          <View className="mt-6">
            <InputField
              label="User Name"
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
              label="Full Name"
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
              label="Email"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={formik.touched.email && formik.errors.email} // Pass error message
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
          <View className="mt-3">
            <InputField
              label="Business Name"
              value={formik.values.businessName}
              onChangeText={formik.handleChange("businessName")}
              onBlur={formik.handleBlur("businessName")}
              error={formik.touched.businessName && formik.errors.businessName} // Pass error message
              placeholder="Business name"
            />
          </View>
          <View className="mt-3">
            <InputField
              label="Contact Number"
              value={formik.values.phoneNumber}
              onChangeText={formik.handleChange("phoneNumber")}
              onBlur={formik.handleBlur("phoneNumber")}
              error={formik.touched.phoneNumber && formik.errors.phoneNumber} // Pass error message
              placeholder="Contact number"
            />
          </View>
          <View className="mt-3">
            <InputField
              label="Password"
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              error={formik.touched.password && formik.errors.password} // Pass error message
              placeholder="Password"
              secureTextEntry={true}
            />
          </View>
          <View className="mt-3">
            <InputField
              label="Confirm Password"
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
        </View>
      </AppContainer>

      <View className="px-4 pt-4 bg-white">
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
