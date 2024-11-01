import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/common";

import { router } from "expo-router";
import { CustomButton } from "@/common/components";
import MemberCard from "./components/MemberCard";
import { useQuery } from "react-query";
import { MemberRepository } from "@/repositories";
import { useEffect, useState } from "react";
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
  const [member, setMembers] = useState<Member[]>([]);
  const { data, isError } = useQuery(["member"], async () => {
    return await MemberRepo.getMember();
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setMembers(
        data?.data?.map((item: any) => ({
          id: item.user.id,
          name: item.user.full_name,
          image: item.user.avatar,
          phone: item.user.AuthUser?.phone || null,
          email: item.user.AuthUser?.email || null,
          role: item.roleName,
        })) || []
      );
    }
  }, [data]);
  console.log(member, "Member");
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {member?.length > 0 ? ( // Check member.length instead of data?.data?.length
          <View className="pb-4">
            {member?.map((m) => <MemberCard key={m.id} member={m} />)}
          </View>
        ) : (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Members;
