// add-client.tsx
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { CustomButton } from '@/common/components';
import { AppContainer } from '@/common/components';
import AddClientForm from './components/AddClientForm';
import { clientSchema } from '@/repositories/client/schemas';
import { ClientFormValues, OptionType } from '@/common/types';

const AddClient = () => {
  const statusOptions: OptionType[] = [
    { key: 'ACTIVE', value: 'Active' },
    { key: 'INACTIVE', value: 'Inactive' },
    { key: 'SUSPENDED', value: 'Suspended' },
  ];

  const roleOptions: OptionType[] = [
    { key: 1, value: 'Super Admin' },
    { key: 2, value: 'Admin' },
    { key: 3, value: 'User' },
    { key: 4, value: 'Contractor' },
    { key: 5, value: 'Dealer' },
  ];

  const initialValues: ClientFormValues = {
    fullName: '',
    email: '',
    phoneNumber: '',
    description: '',
    roleId: 0,
    permissionIds: [],
    status: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: clientSchema,
    onSubmit: (values) => {
      console.log('Form values:', values);
      router.push('/');
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
          <AddClientForm
            formik={formik}
            roleOptions={roleOptions}
            statusOptions={statusOptions}
          />
        </ScrollView>
        <View className="p-4 bg-white">
          <CustomButton
            title="Add Client"
            onPress={() => {
              console.log('Errors:', formik.errors);
              formik.handleSubmit();
            }}
          />
        </View>
      </AppContainer>
    </SafeAreaView>
  );
};

export default AddClient;
