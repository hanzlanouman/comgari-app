import { View, Platform, Text } from "react-native";
import React from "react";
import { CustomButton, InputField } from "@/common/components";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import { ChevronDown, Search, X } from "lucide-react-native";
import * as Yup from "yup";
import { FormikProps } from "formik";
import { OptionType } from "@/common/types";
import DropdownSelect from "@/common/components/Select";
import MultiSelectDropdown from "@/common/components/MultiSelect";

// Define the validation schema using Yup
const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Contact number is required"),
  role: Yup.string().required("Role is required"),
  status: Yup.string().required("Status is required"),
});

interface AddMemberFormProps {
  formik: FormikProps<any>;
  roleOptions: OptionType[];
  permissionOptions: OptionType[];
  statusOptions: OptionType[];
}

export default function AddMemberForm({
  formik,
  roleOptions,
  permissionOptions,
  statusOptions,
}: AddMemberFormProps) {
  return (
    <View>
      <View className="mt-2.5">
        <InputField
          label=""
          value={formik.values.user_name}
          onChangeText={formik.handleChange("user_name")}
          placeholder="User Name"
          error={
            typeof formik.errors.user_name === "string"
              ? formik.errors.user_name
              : undefined
          }
        />
      </View>
      <View className="mt-2.5">
        <InputField
          label=""
          value={formik.values.full_name}
          onChangeText={formik.handleChange("full_name")}
          placeholder="Full name"
          error={
            typeof formik.errors.full_name === "string"
              ? formik.errors.full_name
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.email}
          onChangeText={formik.handleChange("email")}
          placeholder="Email"
          keyboardType="email-address"
          error={
            typeof formik.errors.email === "string"
              ? formik.errors.email
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.phone}
          onChangeText={formik.handleChange("phone")}
          placeholder="Contact number"
          error={
            typeof formik.errors.phone === "string"
              ? formik.errors.phone
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Role"
          data={roleOptions}
          selectedValue={formik.values.role_id}
          setFieldValue={formik.setFieldValue}
          error={
            typeof formik.errors.role_id === "string"
              ? formik.errors.role_id
              : undefined
          }
          fieldName="role_id"
        />
      </View>

      <View className="mt-3">
        <MultiSelectDropdown
          placeholder="Permissions"
          data={permissionOptions}
          selectedValues={formik.values.permission_ids}
          setFieldValue={formik.setFieldValue}
          error={
            typeof formik.errors.permission_ids == "string"
              ? formik.errors.permission_ids
              : undefined
          }
          fieldName="permission_ids"
        />
      </View>

      <View className="mt-2.5">
        <DropdownSelect
          placeholder="Status"
          data={statusOptions}
          selectedValue={formik.values.status}
          setFieldValue={formik.setFieldValue}
          error={
            typeof formik.errors.status === "string"
              ? formik.errors.status
              : undefined
          }
          fieldName="status"
        />
      </View>
      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.password}
          onChangeText={formik.handleChange("password")}
          placeholder="Password"
          error={
            typeof formik.errors.password === "string"
              ? formik.errors.password
              : undefined
          }
          generatePasswordIcon={true}
          onGeneratePassword={formik.handleChange("password")}
          secureTextEntry={true}
        />
      </View>
      <View className="p-4 bg-white">
        <CustomButton
          title="Add Member"
          onPress={() => {
            console.log(formik.errors, "Error is");
            formik.handleSubmit();
          }}
        />
      </View>
    </View>
  );
}
