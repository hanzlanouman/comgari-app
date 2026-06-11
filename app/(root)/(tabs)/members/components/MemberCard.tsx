import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { vs } from "react-native-size-matters";
import UserAvatar from "@/common/components/UserAvatar";
import { TMember } from "../members";

const getRoleName = (roleId: number | undefined) => {
  switch (roleId) {
    case 2:
      return "Admin";
    case 3:
      return "Secretary";
    case 4:
      return "Salesman";
    case 5:
      return "General Contractor";
    default:
      return "Member";
  }
};
export default function MemberCard({ member }: { member: TMember }) {
  return (
    <View>
      <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20] mt-2.5">
        <View className="relative items-center">
          <UserAvatar imageUrl={member.image} name={member.full_name || 'M'} size={vs(70)} />
          <View
            className="bg-purple rounded-3xl pb-[3] absolute bottom-0 px-2"
            style={{ maxWidth: vs(80) }}
          >
            <Text
              className="text-white text-center font-ManropeMedium"
              style={{ fontSize: Platform.OS === "ios" ? 11 : 9 }}
              numberOfLines={1}
              adjustsFontSizeToFit
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
