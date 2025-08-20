import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { getImageUrl, images } from "@/constants";
import { vs } from "react-native-size-matters";
import { TMember } from "../members";

const getRoleName = (roleId: number | undefined) => {
  switch (roleId) {
    case 2:
      return "Admin";
    case 3:
      return "Secretary";
    case 4:
      return "Salesman";
    default:
      return "Member";
  }
};
export default function MemberCard({ member }: { member: TMember }) {
  return (
    <View>
      <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20px] mt-2.5">
        <View className="relative items-center">
          <Image
            source={
              member.image ? { uri: getImageUrl(member.image) } : images.user
            }
            resizeMode="cover"
            className="rounded-full"
            style={{ width: vs(70), height: vs(70) }}
          />
          <View className="bg-purple rounded-3xl pb-[3px] absolute bottom-0 transform -translate-x-1/2 px-2">
            <Text
              className="text-white text-sm text-center font-ManropeMedium"
              style={{ fontSize: Platform.OS === "ios" ? 14 : 11 }}
            >
              {getRoleName(member?.role_id)}
            </Text>
          </View>
        </View>
        <View className="pl-3 flex-grow">
          <Text className="text-base sm:text-lg font-ManropeBold text-dark">
            {member?.full_name}
          </Text>
          <TouchableOpacity
            onPress={() =>
              member?.email && Linking.openURL(`mailto:${member.email}`)
            }
          >
            <Text className="text-sm font-ManropeMedium text-blue">
              {member?.email}
            </Text>
          </TouchableOpacity>
          <View className="flex-row items-center justify-between mt-3">
            <TouchableOpacity
              onPress={() =>
                member?.phone && Linking.openURL(`tel:${member.phone}`)
              }
            >
              <Text className="text-sm font-ManropeMedium text-blue">
                {member?.phone}
              </Text>
            </TouchableOpacity>
            <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
              <Text className="text-sm font-ManropeMedium text-green text-center">
                {member?.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
