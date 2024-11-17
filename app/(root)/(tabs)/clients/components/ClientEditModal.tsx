import React, { useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Formik } from 'formik';
import { LinearGradient } from 'expo-linear-gradient';
import { Pencil, Trash } from 'lucide-react-native';
import { CustomButton } from '@/common/components'; // Assuming you have a custom button component
import { router } from 'expo-router';

interface ClientEditModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onEdit: () => void; // Function for editing the client
  onDelete: () => void; // Function for deleting the client
}

const ClientEditModal: React.FC<ClientEditModalProps> = ({ bottomSheetRef, onEdit, onDelete }) => {
  const snapPoints = useMemo(() => ['49%', '80%'], []);
  
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{
        borderRadius: 24,
      }}
    >
      <BottomSheetView className="relative flex-grow p-4">
        <Text className="text-xl font-ManropeBold text-dark mb-4">
          Edit or Delete Client
        </Text>
        
        <TouchableOpacity onPress={onEdit} className="w-full p-4 bg-blue-500 rounded-md mb-2">
          <Text className="text-white text-center text-lg">Edit Client</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete} className="w-full p-4 bg-red-500 rounded-md">
          <Text className="text-white text-center text-lg">Delete Client</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default ClientEditModal;
