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
  const { user } = useAppSelector((state) => state.auth);
  const { getPermission } = useAuthorization();
  const actionModalRef = useRef<BottomSheetModal>(null);
  const hasPermission = getPermission(user!, "manage", "member");
  const { data, isError, error, refetch } = useQuery(["member"], MemberRepo.getMember);

  const deleteMemberMutation = useMutation({
    mutationFn: () => {
      if (!selectedMember) throw new Error("No member selected");
      return MemberRepo.deleteMember(selectedMember.id);
    },
    onSuccess: async () => {
      queryClient.setQueryData(["member"], (oldMembers: TMember[] = []) =>
        oldMembers.filter((member) => member.id !== selectedMember?.id)
      );

      await queryClient.invalidateQueries({
        queryKey: ["member"],
      });

      actionModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error("Error deleting member:", error);
      queryClient.invalidateQueries({
        queryKey: ["member"],
      });
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
            id: item?.Auth?.user?.id,
            user_name: item?.Auth?.username,
            full_name: item?.Auth?.user?.full_name,
            image: item?.Auth?.user?.avatar,
            phone: item?.Auth?.phone || undefined,
            email: item?.Auth?.email || '',
            role_id: item?.Auth?.user?.user_roles?.role?.id || 0,
            status: item?.Auth?.status,
            permission_ids: item?.Auth?.user?.permission_by_user
              ?.map((p: any) => p?.permission?.id || p?.permissionId)
              ?.filter((id: any) => id !== undefined) || [],
          }))
          ?.sort((a, b) => b.id - a.id) // Sort members by descending order of `id`
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
            paddingBottom: vs(10),
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
      </AppContainer>
    </SafeAreaView>
  );
};

export default Members;
