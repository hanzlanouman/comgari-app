import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { vs } from "react-native-size-matters";
import { images } from "@/constants";
import { ProgressBar } from "@/common/components";
import { useRouter } from "expo-router";

type ClientCardProps = {
  id: number;
  name: string;
  category: string;
  status: string;
  progress: number;
  getCategoryColor: (category: string) => string;
  getStatusColor: (status: string) => string;
};

const ClientCard: React.FC<ClientCardProps> = ({
  id,
  name,
  category,
  status,
  progress,
  getCategoryColor,
  getStatusColor,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/(root)/(tabs)/clients/client-detail")}
      className="bg-white border p-5 rounded-xl mb-4"
      style={{ borderColor: "#E5E7EB" }}
    >
      <View className="flex-row items-center mb-3">
        <Image
          source={images.user}
          resizeMode="cover"
          className="rounded-xl"
          style={{ width: vs(45), height: vs(45) }}
        />
        <View className="flex-1 ml-3">
          <Text className="text-base font-ManropeBold text-gray-900">
            {name}
          </Text>
          <View className="flex-row items-center mt-1">
            <View
              style={{
                backgroundColor: getCategoryColor(category) + '20',
                padding: 2,
                borderRadius: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: getCategoryColor(category),
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text
              style={{ color: getCategoryColor(category) }}
              className="text-sm font-ManropeMedium ml-2"
            >
              {category}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-sm font-ManropeMedium text-gray-500 mb-3">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </Text>

      <View className="flex-row items-center mb-3">
        <Image
          source={images.user}
          resizeMode="cover"
          className="rounded-full border-2 border-white"
          style={{ width: vs(30), height: vs(30) }}
        />
        <Image
          source={images.user}
          resizeMode="cover"
          className="rounded-full border-2 border-white -ml-3"
          style={{ width: vs(30), height: vs(30) }}
        />
        <Text className="text-sm font-ManropeMedium text-gray-700 ml-3">
          Members
        </Text>
      </View>

      <ProgressBar progress={progress} color="#2196F3" height={6} style={{ marginBottom: 12 }} />

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-sm font-ManropeMedium text-gray-600">
            Due on:
          </Text>
          <View className="flex-row items-center ml-2">
            <CalendarDays size={16} color="#64748B" />
            <Text className="text-sm font-ManropeMedium text-gray-600 ml-1">
              Oct 05 2021
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: getStatusColor(status) + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{ color: getStatusColor(status) }}
            className="text-sm font-ManropeMedium"
          >
            {status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ClientCard;
