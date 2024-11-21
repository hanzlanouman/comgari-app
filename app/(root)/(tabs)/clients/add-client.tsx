import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFormik } from 'formik';
import { useAppSelector } from '@/hooks/redux'; 
import { CustomButton, AppContainer } from '@/common/components';
import AddClientForm from './components/AddClientForm';
import { createClientSchema } from '@/repositories/client/schemas';
import { OptionType, ClientType, CLIENT_TYPES, ClientStatus, CLIENT_STATUS } from '@/common/types';
import { ClientRepository } from '@/repositories/client/client';
import { MemberRepository } from '@/repositories/member/member';
import { useQueryClient } from 'react-query';


interface ClientFormValues {
  name: string;
  description?: string;
  logo?: string;
  type?: ClientType;
  status: ClientStatus;
  member_ids: number[];
  email?: string;
  phone?: string;
  brief?: string;
}

const AddClient = () => {
  const clientRepo = ClientRepository.getInstance();
  const memberRepo = MemberRepository.getInstance();
  const queryClient = useQueryClient();
  const [memberOptions, setMemberOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const params = useLocalSearchParams();
  
  const clientId = params.isEditing === 'true' 
    ? params.clientId 
      ? Number(params.clientId) 
      : undefined 
    : undefined;

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const { data } = await memberRepo.getMember();
        const members = data || [];
        const options: OptionType[] = members.map((member) => ({
          key: member.id,
          value: member.Auth.username || 'Unknown',
        }));
        
        setMemberOptions(options);
      } catch (error) {
        console.error('Error fetching members:', error);
        Alert.alert('Error', 'Failed to load members. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();

    if (params.isEditing === 'true' && clientId) {
      setIsEditing(true);
    }
  }, []);

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
    name: String(params.name || ''),
    description: String(params.description || ''),
    logo: String(params.logo || undefined),
    type: params.type as ClientType,
    status: (params.status as ClientStatus) || ClientStatus.Active,
    member_ids: params.member_ids ? 
      Array.isArray(params.member_ids) 
        ? params.member_ids.map(Number) 
        : [Number(params.member_ids)] 
      : [],
    email: String(params.email || ''),
    phone: String(params.phone || ''),
    brief: String(params.brief || ''),
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, 
    validationSchema: createClientSchema,
    onSubmit: async (values) => {
      try {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        const req = { user: { id: user.id } };
        
        if (isEditing && clientId) {
          await clientRepo.updateClient(req, clientId, values);
        } else {
          await clientRepo.createClient(req, values);
        }
        await queryClient.invalidateQueries("clients");
        router.replace('/(root)/(tabs)/clients/clients');
      } catch (error) {
        console.error('Error saving client:', error);
        Alert.alert('Error', 'Failed to save client');
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
            title={isEditing ? "Update Client" : "Add Client"}
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