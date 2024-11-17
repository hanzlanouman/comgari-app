import React from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { FormikProps } from 'formik';
import { Upload } from 'lucide-react-native';
import { vs } from 'react-native-size-matters';
import { InputField } from '@/common/components';
import { OptionType, ClientType, ClientStatus } from '@/common/types';
import DropdownSelect from '@/common/components/Select';
import MultiSelectDropdown from '@/common/components/MultiSelect';
import { images } from '@/constants';

import * as ImagePicker from 'expo-image-picker';

interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  description?: string;
  logo?: string;
  type?: ClientType;
  status: ClientStatus;
  member_ids: number[];
}

interface AddClientFormProps {
  formik: FormikProps<ClientFormValues>;
  typeOptions: OptionType[];
  statusOptions: OptionType[];
  memberOptions: OptionType[];
}

export default function AddClientForm({
  formik,
  typeOptions,
  statusOptions,
  memberOptions,
}: AddClientFormProps) {
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) { 
      console.log('User canceled image picker');
    } else {
      const imageUrl = result.assets[0].uri; 
      formik.setFieldValue('logo', imageUrl);
    }
  };

  return (
    <View>
      <View
        className="mt-2.5 relative mx-auto"
        style={{ width: vs(80), height: vs(80) }}
      >
        <Image
          source={formik.values.logo ? { uri: formik.values.logo } : images.user}
          resizeMode="cover"
          className="rounded-full mx-auto w-full h-full"
        />
        <TouchableOpacity
          onPress={handleImageUpload}
          className="bg-blue rounded-full flex-row items-center justify-center w-7 h-7 absolute bottom-0 right-0 pb-px"
        >
          <Upload size={13} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View className="mt-5">
        <InputField
          label=""
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          placeholder="Client name"
          error={
            typeof formik.errors.name === 'string'
              ? formik.errors.name
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          placeholder="Client email"
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
          value={formik.values.phone}
          onChangeText={formik.handleChange('phone')}
          placeholder="Client phone"
          error={
            typeof formik.errors.phone === 'string'
              ? formik.errors.phone
              : undefined
          }
        />
      </View>

      <View className="mt-3">
        <MultiSelectDropdown
          placeholder="Select Members"
          data={memberOptions} 
          selectedValues={formik.values.member_ids.map(String)}
          setFieldValue={formik.setFieldValue}
          error={
            typeof formik.errors.member_ids === 'string'
              ? formik.errors.member_ids
              : undefined
          }
          fieldName="member_ids"
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Select Client Type"
          data={typeOptions}
          selectedValue={formik.values.type || ''}
          setFieldValue={(field, value) => {
            formik.setFieldValue(field, value as ClientType);
          }}
          error={
            typeof formik.errors.type === 'string'
              ? formik.errors.type
              : undefined
          }
          fieldName="type"
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Select Client Status"
          data={statusOptions}
          selectedValue={formik.values.status || ''}
          setFieldValue={(field, value) => {
            formik.setFieldValue(field, value as ClientStatus);
          }}
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