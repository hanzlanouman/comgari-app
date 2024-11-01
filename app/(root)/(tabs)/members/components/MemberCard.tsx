import { View, Text, Image, Platform } from "react-native";
import React from "react";
import { images } from "@/common";
import { vs } from "react-native-size-matters";
import { TMember } from "../members";

export default function MemberCard({ member }: { member: TMember }) {
  return (
    <View>
      <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20px] mt-2.5">
        <View className="relative items-center">
          <Image
            source={member?.image ? member?.image : images?.user}
            resizeMode="cover"
            className="rounded-full"
            style={{ width: vs(70), height: vs(70) }}
          />
          <View className="bg-purple rounded-3xl pb-[3px] absolute bottom-0 transform -translate-x-1/2 px-2.5">
            <Text
              className="text-white text-sm text-center font-ManropeMedium"
              style={{ fontSize: Platform.OS === "ios" ? 14 : 11 }}>
              {member?.role}
            </Text>
          </View>
        </View>
        <View className="pl-3 flex-grow">
          <Text className="text-base sm:text-lg font-ManropeBold text-dark">
            {member?.name}
          </Text>
          <Text className="text-sm font-ManropeMedium text-dark-100">
            {member?.email}
          </Text>
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-sm font-ManropeMedium text-dark-100">
              {member?.phone}
            </Text>
            <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
              <Text className="text-sm font-ManropeMedium text-green text-center">
                Active
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
