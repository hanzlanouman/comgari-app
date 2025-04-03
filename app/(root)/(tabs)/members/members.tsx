//app\(root)\(tabs)\members\members.tsx
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";
import ActionModal from "./components/ActionModal";
import { router } from "expo-router";
import { AppContainer, CustomButton } from "@/common/components";
import MemberCard from "./components/MemberCard";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { MemberRepository } from "@/repositories";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import WithRole from "@/common/components/withRole";
import { useAppSelector } from "@/hooks/redux";
import { useAuthorization } from "@/context/PermissionContext";

import {
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
enum UserStatus {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}
export type TMember = {
  id: number;
  user_name: string;
  full_name: string;
  image?: string;
  role_id: number;
  email: string;
  phone?: string;
  status: UserStatus;
  permission_ids?: number[];
};

const Members = () => {
  const MemberRepo = MemberRepository.getInstance();
  const [member, setMembers] = useState<TMember[]>([]);
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<TMember | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { getPermission } = useAuthorization();
  const actionModalRef = useRef<BottomSheetModal>(null);
  const hasPermission = getPermission(user!, "manage", "member");
  const { data, isError, error, refetch } = useQuery(["member"], MemberRepo.getMember);

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: number) => {
      return MemberRepo.deleteMember(memberId);
    },
    onSuccess:  () => {
      queryClient.invalidateQueries(["member"]);
      setDeleteModalOpen(false);
      actionModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error("Error deleting member:", error);
      setDeleteModalOpen(false);
      queryClient.invalidateQueries(["member"]);
    },
  });

  const handleMemberPress = useCallback((member: TMember) => {
    setSelectedMember(member);
    actionModalRef.current?.present();
  }, []);

  const handleUpdatePress = useCallback(() => {
    actionModalRef.current?.dismiss();
    if (selectedMember) {
      router.push({
        pathname: "/(root)/(tabs)/members/add-member",
        params: {
          isEditing: 'true',
          memberId: selectedMember.id?.toString(),
          memberData: JSON.stringify(selectedMember)
        }
      });
    }
  }, [selectedMember]);

  const handleDeletePress = useCallback(() => {
    if (selectedMember) {
      setMemberToDelete(selectedMember.id);
      setDeleteModalOpen(true);
    }
  }, [selectedMember]);

  const confirmDelete = useCallback(() => {
    if (memberToDelete !== null) {
      deleteMemberMutation.mutate(memberToDelete);
    }
  }, [memberToDelete, deleteMemberMutation]);

  const cancelDelete = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (data) {
      setMembers(
        data?.data
          ?.map((item: any) => ({
            id: item?.Auth?.user?.id,
            user_name: item?.Auth?.username,
            full_name: item?.Auth?.user?.full_name,
            image: item.Auth.user.avatar,
            phone: item?.Auth?.phone || undefined,
            email: item?.Auth?.email || '',
            role_id: item?.Auth?.user?.user_roles[0]?.role_id,
            status: item?.Auth?.status,
            permission_ids: item?.Auth?.user?.permission_by_user
              ?.map((p: any) => p?.permission?.id || p?.permissionId)
              ?.filter((id: any) => id !== undefined) || [],
          }))
          ?.sort((a: any, b: any) => b.id - a.id)
      );
    }
  }, [data]);


  return (
    <SafeAreaView>
      <AppContainer isError={isError} message={error}>
        <FlatList
          data={member}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => <TouchableOpacity
            onPress={() => hasPermission && handleMemberPress(item)}
            disabled={!hasPermission}
          >
            <MemberCard member={item} />
          </TouchableOpacity>}
          contentContainerStyle={{
            paddingBottom: vs(150),
          }}
          ListEmptyComponent={
            <View className="flex-grow flex-col items-center justify-center px-4">
              <Image
                source={images.member}
                resizeMode="contain"
                style={{ width: scale(150), height: vs(150) }}
                className="mx-auto"
              />
              <View>
                <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                  No team members added yet. Start growing your team by adding members to manage clients and properties.
                </Text>
                <View className="w-[158px] mx-auto mt-5">
                  <WithRole permission="manage" resource="member" user={user!}>
                    <CustomButton
                      title="Add Member"
                      onPress={() => router.push("/(root)/(tabs)/members/add-member")}
                    />
                  </WithRole>
                </View>
              </View>
            </View>
          }
        />
        <ActionModal
          ref={actionModalRef}
          onUpdate={handleUpdatePress}
          onDelete={handleDeletePress}
        />
        
        {/* Delete Confirmation Modal */}
        <Modal
          visible={deleteModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Member</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete this member? This action cannot be undone.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={cancelDelete}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </AppContainer>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Members;



