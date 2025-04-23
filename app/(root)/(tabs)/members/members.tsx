//app\(root)\(tabs)\members\members.tsx
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";
import ActionModal from "./components/ActionModal";
import { router } from "expo-router";
import { AppContainer, CustomButton } from "@/common/components";
import MemberCard from "./components/MemberCard";
import { useQuery, useMutation } from "react-query";
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
import { showAlertBox } from "@/utils";
enum UserStatus {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}
export type TMember = {
  auth_id: number;
  id: number;
  user_name: string;
  full_name: string;
  image?: string;
  role_id: number;
  email: string;
  phone?: string;
  status: UserStatus;
  permission_ids?: number[];
  created_by?: number;
};

const Members = () => {
  const MemberRepo = MemberRepository.getInstance();
  const [member, setMembers] = useState<TMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TMember | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { getPermission } = useAuthorization();
  const actionModalRef = useRef<BottomSheetModal>(null);
  const hasPermission = getPermission(user!, "manage", "member");
  const { data, isError, error, refetch } = useQuery(["member"], MemberRepo.getMember);

  const deleteMemberMutation = useMutation({
    mutationFn: () => {
      actionModalRef.current?.dismiss();
      if (!selectedMember) throw new Error("No member selected");
      return MemberRepo.deleteMember(selectedMember.auth_id);
    },
    onSuccess: async () => {
      refetch();
      actionModalRef.current?.dismiss();
    },
    onError: (error: any) => {
      console.error("Error deleting member:", error);
      refetch();
      showAlertBox("Error", error || "Something went wrong");
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
      deleteMemberMutation.mutate();
    }
  }, [selectedMember, deleteMemberMutation]);

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
            auth_id: item?.Auth?.id,
            id: item?.Auth?.user?.id,
            user_name: item?.Auth?.username,
            full_name: item?.Auth?.user?.full_name,
            image: item?.Auth?.user?.avatar,
            phone: item?.Auth?.phone || undefined,
            email: item?.Auth?.email || '',
            role_id: item?.Auth?.user?.user_roles[0]?.role_id,
            status: item?.Auth?.status,
            created_by: item?.created_by,
            permission_ids: item?.Auth?.user?.permission_by_user
              ?.map((p: any) => p?.permission?.id || p?.permissionId)
              ?.filter((id: any) => id !== undefined) || [],
          }))
          ?.sort((a: TMember, b: TMember) => b.id - a.id) // Sort members by descending order of `id`
      );
    }
  }, [data]);


  return (
    <SafeAreaView>
      <AppContainer isError={isError} message={error as string}>
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
          user={user}
          selectedMember={selectedMember}
          onUpdate={handleUpdatePress}
          onDelete={handleDeletePress}
        />
      </AppContainer>
    </SafeAreaView>
  );
};

export default Members;