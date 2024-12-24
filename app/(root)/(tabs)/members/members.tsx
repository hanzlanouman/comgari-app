//app\(root)\(tabs)\members\members.tsx
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/common";
import ActionModal from "./components/ActionModal";
import { router } from "expo-router";
import { AppContainer, CustomButton } from "@/common/components";
import MemberCard from "./components/MemberCard";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { MemberRepository } from "@/repositories";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
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

  const actionModalRef = useRef<BottomSheetModal>(null);

  const { data, isError, error, refetch } = useQuery(["member"], async () => {
    return await MemberRepo.getMember();
  });

  // Mutation for deleting a member
  const deleteMemberMutation = useMutation({
    mutationFn: () => {
      if (!selectedMember) throw new Error("No member selected");
      return MemberRepo.deleteMember(selectedMember.id);
    },
    onSuccess: async () => {
      // Update local state
      queryClient.setQueryData(["member"], (oldMembers: TMember[] = []) =>
        oldMembers.filter((member) => member.id !== selectedMember?.id)
      );

      // Invalidate and refetch
      await queryClient.invalidateQueries({
        queryKey: ["member"],
      });

      // Dismiss modal
      actionModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error("Error deleting member:", error);
      queryClient.invalidateQueries({
        queryKey: ["member"],
      });
    },
  });

  // Handle member press to open action modal
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
          memberId: selectedMember.id.toString(),
          memberData: JSON.stringify(selectedMember)
        }
      });
    }
  }, [selectedMember]);

  // Handle delete press
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
        data?.data?.map((item: any) => ({
          id: item?.Auth?.user[0]?.id,
          user_name: item?.Auth?.username,
          full_name: item?.Auth?.user[0]?.full_name,
          image: item?.Auth?.user[0]?.avatar,
          phone: item?.Auth?.phone || undefined,
          email: item?.Auth?.email || '',
          role_id: item?.Auth?.user[0]?.user_roles[0]?.role?.id || 0,
          status: item?.Auth?.status,
          permission_ids: item?.Auth?.user?.[0]?.permission_by_user
            ?.map((p: any) => p?.permission?.id || p?.permissionId)
            ?.filter((id: any) => id !== undefined) || []
        })) || []
      );
    }
  }, [data]);

  console.log(member)

  return (
    <SafeAreaView>
      <AppContainer isError={isError} message={error}>
        <FlatList
          data={member}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => <TouchableOpacity onPress={() => handleMemberPress(item)}>
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
                  We can't find any
                </Text>
                <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                  member yet!
                </Text>
                <View className="w-[158px] mx-auto mt-5">
                  <CustomButton
                    title="Add Member"
                    onPress={() => router.push("/")}
                  />
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