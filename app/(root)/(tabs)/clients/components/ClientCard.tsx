import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { vs } from "react-native-size-matters";
import { images } from "@/constants";
import { ProgressBar } from "@/common/components";
import { useRouter } from "expo-router";

type ClientCardProps = {
  client: {
    id: number;
    name: string;
    description?: string;
    category?: string;    
    status?: string;      
    progress?: number;    
    logo?: string | null;
    getCategoryColor?: (category: string) => string;
    getStatusColor?: (status: string) => string;
  };
  onPress: () => void;
};

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onPress,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white border p-5 rounded-xl mb-4"
      style={{ borderColor: "#E5E7EB" }}
    >
      <View className="flex-row items-center mb-3">
        <Image
          source={client.logo ? { uri: client.logo } : images.user}
          resizeMode="cover"
          className="rounded-xl"
          style={{ width: vs(45), height: vs(45) }}
        />
        <View className="flex-1 ml-3">
          <Text className="text-base font-ManropeBold text-gray-900">
            {client.name}
          </Text>
          {client.category && (
            <View className="flex-row items-center mt-1">
              <View
                style={{
                  backgroundColor: client.getCategoryColor?.(client.category) + '20',
                  padding: 2,
                  borderRadius: 4,
                }}
              >
                <View
                  style={{
                    backgroundColor: client.getCategoryColor?.(client.category),
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text
                style={{ color: client.getCategoryColor?.(client.category) }}
                className="text-sm font-ManropeMedium ml-2"
              >
                {client.category}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text className="text-sm font-ManropeMedium text-gray-500 mb-3">
        {client.description || "No description available"} 
      </Text>

      <ProgressBar progress={client.progress ?? 0} color="#2196F3" height={6} style={{ marginBottom: 12 }} />

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
        {client.status && (
          <View
            style={{
              backgroundColor: client.getStatusColor?.(client.status) + '20',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{ color: client.getStatusColor?.(client.status) }}
              className="text-sm font-ManropeMedium"
            >
              {client.status}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ClientCard;
