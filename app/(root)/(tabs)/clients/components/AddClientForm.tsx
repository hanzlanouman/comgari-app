import React, { useState } from 'react';
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
import { Action } from '@/common/enum';
import DropdownSelect from '@/common/components/Select';
import MultiSelectDropdown from '@/common/components/MultiSelect';
import { ClientRepository } from '@/repositories/client/client';
import { images, getImageUrl } from '@/constants';
import * as ImagePicker from 'expo-image-picker';

interface MemberAction {
  staff_id: number;
  action: Action;
}

interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  description?: string;
  logo?: string;
  type?: ClientType;
  status: ClientStatus;
  member_ids: number[];
  client_Staff: MemberAction[];
}

interface AddClientFormProps {
  formik: FormikProps<ClientFormValues>;
  typeOptions: OptionType[];
  statusOptions: OptionType[];
  memberOptions: OptionType[];
  isEditing?: boolean;
}

export default function AddClientForm({
  formik,
  typeOptions,
  statusOptions,
  memberOptions,
  isEditing,
}: AddClientFormProps) {
  const clientRepo = ClientRepository.getInstance();
  // Initialize state directly with formik values
  const [selectedMembers, setSelectedMembers] = useState<number[]>(formik.values.member_ids || []);
  const [memberActions, setMemberActions] = useState<MemberAction[]>(formik.values.client_Staff || []);

  const handleMemberSelection = (field: string, value: string[]) => {
    const newSelected = value.map(Number);
    
    // Find added and removed members
    const addedMembers = newSelected.filter(id => !selectedMembers.includes(id));
    const removedMembers = selectedMembers.filter(id => !newSelected.includes(id));
    
    // Create new member actions array
    const newMemberActions = [...memberActions];

    // Add new members
    addedMembers.forEach(id => {
      const existingIndex = newMemberActions.findIndex(item => item.staff_id === id);
      
      if (existingIndex !== -1) {
        newMemberActions[existingIndex] = { staff_id: id, action: Action.ADD };
      } else {
        newMemberActions.push({ staff_id: id, action: Action.ADD });
      }
    });

    // Add removed members
    removedMembers.forEach(id => {
      const existingIndex = newMemberActions.findIndex(item => item.staff_id === id);
      
      if (existingIndex !== -1) {
        newMemberActions[existingIndex] = { staff_id: id, action: Action.REMOVE };
      } else {
        newMemberActions.push({ staff_id: id, action: Action.REMOVE });
      }
    });

    // Update all states at once
    setMemberActions(newMemberActions);
    setSelectedMembers(newSelected);
    formik.setFieldValue(field, newSelected);
    formik.setFieldValue('client_Staff', newMemberActions);
  };

  // Function to upload the selected image
  const uploadMedia = async (file: ImagePicker.ImagePickerAsset): Promise<string> => {
    try {
      const formData = new FormData();
      const fileToUpload = {
        uri: file.uri,
        type: file.mimeType || 'image/jpeg',
        name: file.uri.split('/').pop() || 'image.jpg',
      } as any;
      formData.append('files', fileToUpload);

      const response = await clientRepo.uploadMedia(formData);

      if (response?.data?.length > 0) {
        return response.data[0].filename;
      } else if (Array.isArray(response) && response.length > 0) {
        return response[0].filename;
      }

      throw new Error('No file data received from server');
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
        base64: false,
      });

      if (!result.canceled && result.assets?.[0]) {
        try {
          const imageUrl = await uploadMedia(result.assets[0]);
          if (!imageUrl) {
            throw new Error('No image URL returned');
          }
          formik.setFieldValue('logo', imageUrl);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          Alert.alert(
            'Upload failed',
            'Failed to upload image. Please check your connection and try again.'
          );
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert(
        'Error',
        'Failed to access image picker. Please check app permissions.'
      );
    }
  };

  return (
    <View>
      <View
        className="mt-2.5 relative mx-auto"
        style={{ width: vs(80), height: vs(80) }}
      >
        <Image
          source={formik.values.logo ? { uri: getImageUrl(formik.values.logo) } : images.user}
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
          error={typeof formik.errors.name === 'string' ? formik.errors.name : undefined}
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          placeholder="Client email"
          error={typeof formik.errors.email === 'string' ? formik.errors.email : undefined}
        />
      </View>

      <View className="mt-3">
        <InputField
          label=""
          value={formik.values.phone}
          onChangeText={formik.handleChange('phone')}
          placeholder="Client phone"
          error={typeof formik.errors.phone === 'string' ? formik.errors.phone : undefined}
        />
      </View>

      <View className="mt-3">
        <MultiSelectDropdown
          placeholder="Select Members"
          data={memberOptions}
          selectedValues={formik.values.member_ids?.map(String) || []} 
          setFieldValue={handleMemberSelection}
          error={typeof formik.errors.member_ids === 'string' ? formik.errors.member_ids : undefined}
          fieldName="member_ids"
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Select Client Type"
          data={typeOptions}
          selectedValue={String(formik.values.type || '')}  
          setFieldValue={(field, value) => {
            formik.setFieldValue(field, value);
          }}
          error={typeof formik.errors.type === 'string' ? formik.errors.type : undefined}
          fieldName="type"
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Select Client Status"
          data={statusOptions}
          selectedValue={String(formik.values.status || '')} 
          setFieldValue={(field, value) => {
            formik.setFieldValue(field, value);
          }}
          error={typeof formik.errors.status === 'string' ? formik.errors.status : undefined}
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