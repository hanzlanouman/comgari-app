import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { useAppSelector } from '@/hooks/redux'; 
import { CustomButton, AppContainer } from '@/common/components';
import AddClientForm from './components/AddClientForm';
import { createClientSchema } from '@/repositories/client/schemas';
import { OptionType, ClientType, CLIENT_TYPES, ClientStatus, CLIENT_STATUS } from '@/common/types';
import { ClientRepository } from '@/repositories/client/client';
import { MemberRepository } from '@/repositories/member/member';

interface ClientFormValues {
  name: string;
  description?: string;
  logo?: string;
  type?: ClientType;
  status: ClientStatus;
  member_ids: number[];
}

type TMember = {
  id: number;
  name: string;
  image: string;
  role: string;
  email: string;
  phone: string;
  status: string;
};

const AddClient = () => {
  const clientRepo = ClientRepository.getInstance();
  const memberRepo = MemberRepository.getInstance();

  const [memberOptions, setMemberOptions] = useState<OptionType[]>([
    { key: 1, value: 'joe bro' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const { data } = await memberRepo.getMember();
        const members: TMember[] = data?.data || [];
        const options: OptionType[] = [
          { key: 1, value: 'joe bro' },
          ...members.map((member) => ({
            key: member.id,
            value: member.name || 'Unknown',
          })),
        ];
        setMemberOptions(options);
      } catch (error: any) {
        console.warn('Error fetching members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [memberRepo]);

  if (!isAuthenticated) {
    router.push('/(auth)/sign-in');
    return null;
  }

  const clientTypeOptions: OptionType[] = CLIENT_TYPES.map(type => ({
    key: type,
    value: type.charAt(0) + type.slice(1).replace('_', ' ')
  }));

  const statusOptions: OptionType[] = CLIENT_STATUS.map(status => ({
    key: status,
    value: status.charAt(0) + status.slice(1).replace('_', ' ')
  }));

  const initialValues: ClientFormValues = {
    name: '',
    description: '',
    logo: undefined,
    type: undefined,
    status: ClientStatus.Active,
    member_ids: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: createClientSchema,
    onSubmit: async (values) => {
      try {
        const req = { user: { id: user?.id } };
        const payload = values;

        await clientRepo.createClient(req, payload);
        
        router.push('/(tabs)/clients/clients');
      } catch (error) {
        console.error('Error creating client:', error);
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
            <AddClientForm
              formik={formik}
              typeOptions={clientTypeOptions}
              statusOptions={statusOptions}
              memberOptions={memberOptions} 
            />
        </ScrollView>
        <View className="p-4 bg-white">
          <CustomButton
            title="Add Client"
            onPress={() => {
              formik.handleSubmit();
            }}
          />
        </View>
      </AppContainer>
    </SafeAreaView>
  );
};

export default AddClient;