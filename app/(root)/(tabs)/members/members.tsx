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

import { router } from "expo-router";
import { AppContainer, CustomButton } from "@/common/components";
import MemberCard from "./components/MemberCard";
import { useQuery } from "react-query";
import { MemberRepository } from "@/repositories";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export type TMember = {
  id: number;
  name: string;
  image: string;
  role: string;
  email: string;
  phone: string;
  status: string;
};

const Members = () => {
  const MemberRepo = MemberRepository.getInstance();
  const [member, setMembers] = useState<TMember[]>([]);

  const { data, isError, error, refetch } = useQuery(["member"], async () => {
    return await MemberRepo.getMember();
  });

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
          renderItem={({ item }) => <MemberCard member={item} />}
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
                  We can’t find any
                </Text>
                <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                  member yet!
                </Text>
                <View className="w-[158px] mx-auto mt-5">
                  <CustomButton
                    title="Add Member"
                    onPress={() => router.push("/")} // Adjust navigation if needed
                  />
                </View>
              </View>
            </View>
          }
        />
      </AppContainer>
    </SafeAreaView>
  );
};

export default Members;
