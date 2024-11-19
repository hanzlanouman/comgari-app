//app\(root)\(tabs)\clients\components\ClientEditModal.tsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { ClientRepository } from '@/repositories/client/client';
import { router } from 'expo-router';
import { useQueryClient } from 'react-query';
import { useAppSelector } from '@/hooks/redux';
import { ClientStatus, ClientType } from "@/common/types";

interface ClientEditModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  clientId: number;
  client: {
    name: string;
    description?: string;
    email?: string;
    phone?: string;
    type?: ClientType;
    status: ClientStatus;
    logo?: string | null;
    brief?: string | null;
  };
}

export const ClientEditModal: React.FC<ClientEditModalProps> = ({
  bottomSheetRef,
  clientId,
  client
}) => {
  const clientRepo = ClientRepository.getInstance();
  const queryClient = useQueryClient();
  const snapPoints = useMemo(() => ["49%", "80%"], []); 

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const handleDeleteClient = async () => {
    // Ensure user is authenticated
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
                user,
              }; 
              console.log('Request Payload:', req);

              await clientRepo.deleteClient(req, clientId);
              
              await queryClient.invalidateQueries("clients");
              if (bottomSheetRef.current) {
                await bottomSheetRef.current.dismiss();
              }
  
              router.replace('/(root)/(tabs)/clients'); 
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
    // Ensure client ID is valid
    if (!clientId) {
      Alert.alert('Error', 'Invalid client ID');
      return;
    }
  
    // Add null checks for client object properties
    router.push({
      pathname: '/(root)/(tabs)/clients/add-client',
      params: {
        isEditing: 'true',
        clientId: clientId,
        name: client?.name || '',
        description: client?.description || '',
        email: client?.email || '',
        phone: client?.phone || '',
        type: client?.type || undefined,
        status: client?.status || undefined,
        logo: client?.logo || '',
        brief: client?.brief || '',
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
      index={1}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        borderRadius: 24,
      }}
    >
      <BottomSheetView className="relative flex-grow p-4">
        <Text className="text-xl font-ManropeBold text-dark mb-4">
          Client Actions
        </Text>

        <TouchableOpacity 
          className="flex-row items-center p-4 border-b border-light"
          onPress={handleEditClient}
        >
          <Pencil size={20} color="#1B78B9" />
          <Text className="ml-3 text-base font-ManropeMedium text-dark">Edit Client</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center p-4"
          onPress={handleDeleteClient}
        >
          <Trash2 size={20} color="#FF4D4D" />
          <Text className="ml-3 text-base font-ManropeMedium text-red-500">Delete Client</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};