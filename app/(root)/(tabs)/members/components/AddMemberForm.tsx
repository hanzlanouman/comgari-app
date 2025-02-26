//app\(root)\(tabs)\members\components\AddMemberForm.tsx
import { View, Platform, ScrollView, Text } from "react-native";
import React from "react";
import { CustomButton, InputField, MutlitSelectWithDefault } from "@/common/components";
import { KeyboardAvoidingView } from "react-native";

import { FormikProps } from "formik";
import { OptionType } from "@/common/types";
import DropdownSelect from "@/common/components/Select";

interface AddMemberFormProps {
  formik: FormikProps<any>;
  roleOptions: OptionType[];
  permissionOptions: OptionType[];
  statusOptions: OptionType[];
  isEditing?: boolean;
}

export default function AddMemberForm({
  formik,
  roleOptions,
  permissionOptions,
  statusOptions,
  isEditing = false,
}: AddMemberFormProps) {
  const permissionTitles = permissionOptions.map((item: any) => formik.values.permission_ids?.includes(item.key) ? item.value : null).filter((item: any) => item !== null).flat();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text className="text-sm  text-dark-100 mb-6">
          Add new team members by filling in their details below.
        </Text>

        <View>
          <View className="mt-2.5">
            <InputField
              label=""
              disabled={isEditing}
              value={formik.values.user_name}
              onChangeText={formik.handleChange("user_name")}
              placeholder="Username"
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
              disabled={isEditing}
              value={formik.values.email.toLowerCase()}
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
          {formik.values.role_id === 4 && (
            <View className="mt-3" >
              <MutlitSelectWithDefault
                search
                save="key"
                placeholder="Permissions"
                options={permissionOptions}
                value={formik.values.permission_ids}
                valueTitles={permissionTitles}
                onSelect={(val) => {
                  formik.setFieldValue("permission_ids", val.map((item: any) => parseInt(item)))
                }}
                error={
                  typeof formik.errors.permission_ids == "string"
                    ? formik.errors.permission_ids
                    : undefined
                }
              />
            </View>
          )}
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
          {!isEditing && (
            <View className="mt-3">
              <InputField
                label=""
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                placeholder="Password"
                error={
                  formik.touched.password && typeof formik.errors.password === "string"
                    ? formik.errors.password
                    : undefined
                }
                secureTextEntry={true}
              />
            </View>
          )}
          {/* <Text className="text-sm  text-dark-100 mt-3">
            They will receive an invitation to set up their account and access their dashboard.
          </Text> */}
          <View className="p-4 bg-white">
            <CustomButton
              title={isEditing ? "Update Member" : "Add Member"}
              onPress={() => {
                formik.handleSubmit();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}