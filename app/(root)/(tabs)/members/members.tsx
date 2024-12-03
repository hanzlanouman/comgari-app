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
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

export type TMember = {
  id: number;
  name: string;
  image: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  user_name?: string;
  role_id?: number;
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

  // Handle update press to open edit modal
  const handleUpdatePress = useCallback(() => {
    actionModalRef.current?.dismiss();
    // Navigate to add-member screen with edit mode and prefilled data
    if (selectedMember) {
      router.push({
        pathname: "/(root)/(tabs)/members/add-member",
        params: {
          isEditMode: 'true',
          memberId: selectedMember.id.toString(),
          userName: selectedMember.user_name || '',
          fullName: selectedMember.name || '',
          email: selectedMember.email || '',
          phone: selectedMember.phone || '',
          status: selectedMember.status || '',
          roleId: selectedMember.role_id?.toString() || '0',
          // You might need to pass permission_ids as a string 
          // or handle it in the add-member screen
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
      console.log(data, "Data of member is");
      setMembers(
        data?.data?.map((item: any) => ({
          id: item?.Auth?.user[0]?.id,
          name: item?.Auth?.user[0]?.full_name,
          image: item?.Auth?.user[0]?.avatar,
          phone: item?.Auth?.phone || null,
          email: item?.Auth?.email || null,
          role: item?.Auth?.user[0]?.user_roles[0]?.role?.name || null,
          status: item?.Auth?.status,
          user_name: item?.Auth?.user[0]?.user_name,
          role_id: item?.Auth?.user[0]?.user_roles[0]?.role?.id,
          // You might want to handle permissions similarly
        })) || []
      );
    }
  }, [data]);

  return (
    <SafeAreaView>
      <AppContainer isError={isError} message={error}>
        <FlatList
          data={member}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMemberPress(item)}>
              <MemberCard member={item} />
            </TouchableOpacity>
          )}
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
                    onPress={() => router.push("/(root)/(tabs)/members/add-member")}
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