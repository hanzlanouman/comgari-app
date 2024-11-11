import React from 'react';
import {
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FormikProps } from 'formik';
import { Upload } from 'lucide-react-native';
import { vs } from 'react-native-size-matters';
import { InputField } from '@/common/components';
import { OptionType, ClientFormValues } from '@/common/types';
import DropdownSelect from '@/common/components/Select';
import MultiSelectDropdown from '@/common/components/MultiSelect';
import { images } from '@/constants';

interface AddClientFormProps {
  formik: FormikProps<ClientFormValues>;
  roleOptions: OptionType[];
  statusOptions: OptionType[];
}

export default function AddClientForm({
  formik,
  roleOptions,
  statusOptions,
}: AddClientFormProps) {
  return (
    <View>
      <View
        className="mt-2.5 relative mx-auto"
        style={{ width: vs(80), height: vs(80) }}
      >
        <Image
          source={images.user}
          resizeMode="cover"
          className="rounded-full mx-auto w-full h-full"
        />
        <TouchableOpacity
          onPress={() => {}}
          className="bg-blue rounded-full flex-row items-center justify-center w-7 h-7 absolute bottom-0 right-0 pb-px"
        >
          <Upload size={13} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View className="mt-5">
        <InputField
          label=""
          value={formik.values.fullName}
          onChangeText={formik.handleChange('fullName')}
          placeholder="Full name"
          error={
            typeof formik.errors.fullName === 'string'
              ? formik.errors.fullName
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          placeholder="Email"
          keyboardType="email-address"
          error={
            typeof formik.errors.email === 'string'
              ? formik.errors.email
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.phoneNumber}
          onChangeText={formik.handleChange('phoneNumber')}
          placeholder="Contact number"
          error={
            typeof formik.errors.phoneNumber === 'string'
              ? formik.errors.phoneNumber
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <MultiSelectDropdown
          placeholder="Assign member"
          data={roleOptions}
          selectedValues={formik.values.permissionIds}
          setFieldValue={formik.setFieldValue}
          error={
            typeof formik.errors.permissionIds === 'string'
              ? formik.errors.permissionIds
              : undefined
          }
          fieldName="permissionIds"
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Select Type"
          data={roleOptions}
          selectedValue={formik.values.roleId}
          setFieldValue={formik.setFieldValue}
          error={
            typeof formik.errors.roleId === 'string'
              ? formik.errors.roleId
              : undefined
          }
          fieldName="roleId"
        />
      </View>

      <View className="mt-2.5">
        <DropdownSelect
          placeholder="Status"
          data={statusOptions}
          selectedValue={formik.values.status}
          setFieldValue={formik.setFieldValue}
          error={
            typeof formik.errors.status === 'string'
              ? formik.errors.status
              : undefined
          }
          fieldName="status"
        />
      </View>

      <View className="mt-3">
        <TextInput
          className="border border-light rounded-xl h-28 p-4 font-ManropeMedium text-[15px] lowercase text-left"
          value={formik.values.description}
          editable
          multiline
          placeholderTextColor="#1C1C1C"
          placeholder="Description"
          onChangeText={formik.handleChange('description')}
        />
      </View>
    </View>
  );
}