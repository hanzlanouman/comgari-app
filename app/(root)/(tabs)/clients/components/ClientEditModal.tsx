import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Pencil, Trash2, ChevronRight  } from 'lucide-react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { ClientRepository } from '@/repositories/client/client';
import { router } from 'expo-router';
import { useQueryClient } from 'react-query';
import { useAppSelector } from '@/hooks/redux';
import { ClientStatus, ClientType } from "@/common/types";

interface Client {
  id: number;
  name: string;
  description?: string | null;
  email?: string;
  phone?: string;
  type?: ClientType;
  status: ClientStatus;
  logo?: string | null;
  brief?: string | null;
  member_ids?: number[];
}

interface ClientEditModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  clientId: number;
  clientData: Client;
  request: {
    user: {
      id: number;
      auth_id?: string;
    }
  };
}

export const ClientEditModal: React.FC<ClientEditModalProps> = ({
  bottomSheetRef,
  clientId,
  clientData
}) => {
  const clientRepo = ClientRepository.getInstance();
  const queryClient = useQueryClient();
  const snapPoints = useMemo(() => ["25%"], []); 

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleDeleteClient = async () => {
    if (!isAuthenticated || !user?.id) {
      Alert.alert('Error', 'You must be logged in to delete a client');
      return;
    }

    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const req = {
                user: {
                  id: user.id,
                  auth_id: user.authId
                }
              }; 
              await clientRepo.deleteClient(req, clientId);
              await queryClient.invalidateQueries("clients");
              if (bottomSheetRef.current) {
                await bottomSheetRef.current.dismiss();
              }
              router.replace('/(root)/(tabs)/clients/clients'); 
            } catch (error) {
              console.error('Delete client error:', error);
              Alert.alert('Error', 'Failed to delete client. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEditClient = () => {
    if (!clientId) {
      Alert.alert('Error', 'Invalid client ID');
      return;
    }
    router.push({
      pathname: '/(root)/(tabs)/clients/add-client',
      params: {
        isEditing: 'true',
        clientId: clientId,
        name: clientData.name || '',
        description: clientData.description || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        type: clientData.type || undefined,
        status: clientData.status || undefined,
        logo: clientData.logo || '',
        brief: clientData.brief || '',
        member_ids: clientData.client_user?.map(cu => cu.member_id) || [],
      },
    });
    bottomSheetRef.current?.dismiss();
  };

  const renderBackdrop = useMemo(
    () => (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
    ref={bottomSheetRef}
    snapPoints={snapPoints}
    index={0}
    enablePanDownToClose
    backdropComponent={renderBackdrop}
    backgroundStyle={{ borderRadius: 12 }}
  >
    <BottomSheetView style={{ padding: 16 }}>
      {/* Edit Button */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          padding: 16,
          borderRadius: 8,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#E8E8E8',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
        onPress={handleEditClient}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pencil size={20} color="#1B78B9" />
          <Text style={{ marginLeft: 12, fontSize: 16, color: '#333333', fontFamily: 'Manrope-Medium' }}>
            Edit
          </Text>
        </View>
        <ChevronRight size={20} color="#1B78B9" />
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          padding: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E8E8E8',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
        onPress={handleDeleteClient}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Trash2 size={20} color="#FF4D4D" />
          <Text style={{ marginLeft: 12, fontSize: 16, color: '#FF4D4D', fontFamily: 'Manrope-Medium' }}>
            Delete
          </Text>
        </View>
        <ChevronRight size={20} color="#FF4D4D" />
      </TouchableOpacity>
    </BottomSheetView>
  </BottomSheetModal>
  );
};
