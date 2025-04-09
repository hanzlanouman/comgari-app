import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView } from "react-native";
import { vs } from "react-native-size-matters";
import { icons } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { ClientRepository } from "@/repositories/client/client";
import { useFocusEffect } from "@react-navigation/native";

type MediaItem = {
  id?: number;
  url: string;
  mimeType: string;
  clientId: number;
  ownerId: number;
  ownerType: string;
  createdAt?: string;
  updatedAt?: string;
};

type MediaGroups = {
  images: MediaItem[];
  videos: MediaItem[];
  documents: MediaItem[];
};

const Media: React.FC = () => {
  const clientRepo = ClientRepository.getInstance();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const { clientId } = useLocalSearchParams();
  const navigation = useNavigation();
  const id = Number(clientId);

  const fetchClientMedia = useCallback(async () => {
    try {
      const response = await clientRepo.getClientMedia({
        client_id: id,
        owner_id: id,
        owner_type: "client",
      });
      setMediaItems(Array.isArray(response) ? response : []);
    } catch (error: any) {
      Alert.alert("Error", "Failed to fetch media. Please try again later.");
      console.error("Fetch Media Error:", error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchClientMedia();
    }, [fetchClientMedia])
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Media",
    });
  }, [navigation]);

  const groupedMediaItems = mediaItems.reduce<MediaGroups>(
    (acc, item) => {
      if (item.mimeType.startsWith("image/")) {
        acc.images.push(item);
      } else if (item.mimeType.startsWith("video/")) {
        acc.videos.push(item);
      } else {
        acc.documents.push(item);
      }
      return acc;
    },
    { images: [], videos: [], documents: [] }
  );

  const navigateToCategory = (id: number, type: string, items: MediaItem[]) => {
    router.push({
      pathname: `/clients/${id}/media/${type}` as any,
      params: { id, items: JSON.stringify(items) },
    });
  };

  // Create a right arrow icon component to reuse
  const RightArrowIcon = () => (
    <Image
      source={icons.video} // Use an existing icon as fallback since arrowRight is missing
      resizeMode="contain"
      className="w-5 h-5 text-gray-500"
      style={{ transform: [{ rotate: "90deg" }] }} // Rotate the icon to make it point right
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: vs(10),
        }}>
        <View className="mb-5">
          <Text className="text-base font-ManropeRegular text-gray-500 mt-1">
            You can find all the media files you uploaded ever in the Comgari.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigateToCategory(id, "images", groupedMediaItems.images)
          }
          className={`flex-row items-center justify-between p-4 rounded-lg mt-4  border border-light`}>
          <View className="flex-row items-center border-light rounded-[20px]">
            <View className="w-12 h-12 rounded-lg bg-[#D1FAE5] flex items-center justify-center shadow">
              <Image
                source={icons.video}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
            <View className="ml-4">
              <Text className="text-lg font-ManropeMedium text-dark">
                Images
              </Text>
              <Text className="text-sm font-ManropeRegular text-gray-500">
                {groupedMediaItems.images.length} items
              </Text>
            </View>
          </View>
          <RightArrowIcon />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigateToCategory(id, "videos", groupedMediaItems.videos)
          }
          className={`flex-row items-center justify-between p-4 rounded-lg mt-4 border border-light`}>
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-lg bg-[#FEE2E2] flex items-center justify-center shadow">
              <Image
                source={icons.video}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
            <View className="ml-4">
              <Text className="text-lg font-ManropeMedium text-dark">
                Videos
              </Text>
              <Text className="text-sm font-ManropeRegular text-gray-500">
                {groupedMediaItems.videos.length} items
              </Text>
            </View>
          </View>
          <RightArrowIcon />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigateToCategory(id, "documents", groupedMediaItems.documents)
          }
          className={`flex-row items-center justify-between p-4 rounded-lg mt-4  border border-light`}>
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-lg bg-[#FFF4E2] flex items-center justify-center shadow">
              <Image
                source={icons.video}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
            <View className="ml-4">
              <Text className="text-lg font-ManropeMedium text-dark">
                Documents
              </Text>
              <Text className="text-sm font-ManropeRegular text-gray-500">
                {groupedMediaItems.documents.length} items
              </Text>
            </View>
          </View>
          <RightArrowIcon />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Media;
