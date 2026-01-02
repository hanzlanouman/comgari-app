import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { vs } from "react-native-size-matters";
import { icons } from "@/constants";
import { ClientRepository } from "@/repositories/client/client";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      pathname: `/Leads/${id}/media/${type}` as any,
      params: { id, items: JSON.stringify(items) },
    });
  };

  const RightArrowIcon = () => (
    <Image
      source={icons.frame}
      resizeMode="contain"
      className="text-gray-500"
      style={{ width: 24, height: 24 }}
    />
  );

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["bottom", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: vs(10),
        }}
      >
        <View className="mb-5">
          <Text className="text-base font-ManropeRegular text-gray-500 mt-1">
            You can find all the media files you uploaded ever in the Comgari.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigateToCategory(id, "images", groupedMediaItems.images)
          }
          className={`flex-row items-center justify-between p-4 rounded-lg mt-4  border border-light`}
        >
          <View className="flex-row items-center border-light rounded-[20]">
            <View
              className="rounded-lg bg-[#D1FAE5] flex items-center justify-center shadow"
              style={{ width: 48, height: 48 }}
            >
              <Image
                source={icons.image}
                resizeMode="contain"
                className=""
                style={{ width: 24, height: 24 }}
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
          className={`flex-row items-center justify-between p-4 rounded-lg mt-4 border border-light`}
        >
          <View className="flex-row items-center">
            <View
              className="rounded-lg bg-[#FEE2E2] flex items-center justify-center shadow"
              style={{ width: 48, height: 48 }}
            >
              <Image
                source={icons.video}
                resizeMode="contain"
                className=""
                style={{ width: 24, height: 24 }}
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
          className={`flex-row items-center justify-between p-4 rounded-lg mt-4  border border-light`}
        >
          <View className="flex-row items-center">
            <View
              className="rounded-lg bg-[#FFF4E2] flex items-center justify-center shadow"
              style={{ width: 48, height: 48 }}
            >
              <Image
                source={icons.file}
                resizeMode="contain"
                className=""
                style={{ width: 24, height: 24 }}
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
