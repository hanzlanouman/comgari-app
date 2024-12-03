import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView } from "react-native";
import { vs } from "react-native-size-matters";
import { icons } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import { Upload } from "lucide-react-native";
import { useMutation } from "react-query";
import { ClientRepository } from "@/repositories/client/client";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "application/pdf",
  "text/plain",
];

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".mp4",
  ".pdf",
  ".txt",
];

type MediaItem = {
  id?: number;
  url: string;
  mimeType: string;
  clientId: number;
  ownerId: number;
  ownerType: string;
};

const Media: React.FC = () => {
  const clientRepo = ClientRepository.getInstance();
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const { clientId } = useLocalSearchParams();
  const navigation = useNavigation();
  const id = Number(clientId);
  const fetchClientMedia = async () => {
    try {
      const response = await clientRepo.getClientMedia({
        client_id: id,
        owner_id: id,
        owner_type: "client",
      });
      console.log(response, "Response is this");
      setMediaItems(response || []);
    } catch (error: any) {
      Alert.alert("Error", `Failed to fetch media: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchClientMedia();
    navigation.setOptions({
      headerShown: true,
      title: "Media",
      headerRight: () => <UploadButton />,
    });
  }, [navigation]);
  const groupedMediaItems = mediaItems.reduce(
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
  const uploadMediaMutation = useMutation({
    mutationFn: async (file: {
      uri: string;
      type: string;
      fileName?: string;
    }) => {
      const formData = new FormData();
      const fileToUpload = {
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.fileName || "file.jpg",
      } as any;
      formData.append("files", fileToUpload);
      const response = await clientRepo.uploadMedia(formData);
      console.log(response, "Response of upload Media");
      return {
        url: response.data[0]?.filename,
        mimeType: file.type || "image/jpeg",
        localUri: file.uri,
      };
    },
  });

  const saveMediaMutation = useMutation({
    mutationFn: async (mediaItems: MediaItem[]) => {
      try {
        // Save media using the new saveClientMedia method
        const payload = {
          files: mediaItems.map((item) => ({
            url: item.url,
            mimeType: item.mimeType,
            clientId: item.clientId,
            ownerId: item.ownerId,
            ownerType: item.ownerType,
          })),
        };

        return await clientRepo.saveClientMedia(payload);
      } catch (error: any) {
        throw new Error(`Validation or saving failed: ${error.message}`);
      }
    },
  });

  const pickMedia = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
        copyToCacheDirectory: false,
      });

      // Type guard to check if result is a successful pick
      if (result.canceled) {
        return;
      }
      if (!result.assets) {
        return;
      }

      const validFiles = result.assets || [];

      // Rest of the existing filtering and upload logic remains the same
      const filteredFiles = validFiles.filter((file) => {
        const mimeTypeAllowed = ALLOWED_TYPES.includes(file.mimeType || "");
        const extensionAllowed = ALLOWED_EXTENSIONS.some((ext) =>
          file.name.toLowerCase().endsWith(ext)
        );
        return mimeTypeAllowed || extensionAllowed;
      });

      if (filteredFiles.length === 0) {
        Alert.alert(
          "Invalid File",
          "Only images, videos, PDFs, and text files are allowed."
        );
        return;
      }

      // Uploading files
      setIsUploading(true);

      const uploadedMediaItems: MediaItem[] = [];
      for (const file of filteredFiles) {
        try {
          //     const formdata=new FormData()
          //     formdata.append()
          //   const uploadResult = await uploadMediaMutation.mutateAsync({
          //     uri: file.uri,
          //     type: file.mimeType || "application/octet-stream",
          //     fileName: file.name,
          //   });
          const formData = new FormData();
          if (!file.uri && file.mimeType && file.name) {
            return;
          }
          const fileToUpload = {
            uri: file.uri,
            type: file.mimeType || "image/jpeg",
            name: file.name || "file.jpg",
          } as any;
          formData.append("files", fileToUpload);
          const response = await clientRepo.uploadMedia(formData);
          console.log(response, "Response is this of upload");
          if (!response) {
            return;
          }
          const mediaItem: MediaItem = {
            url: response?.data[0]?.filename,
            mimeType: file.mimeType!,
            clientId: Number(id),
            ownerId: Number(id),
            ownerType: "client",
          };

          uploadedMediaItems.push(mediaItem);
          setUploadedMedia((prev) => [...prev, mediaItem]);
        } catch (error: any) {
          Alert.alert("Error", `Failed to upload media: ${error.message}`);
        }
      }

      try {
        await saveMediaMutation.mutateAsync(uploadedMediaItems);

        await fetchClientMedia();
      } catch (error: any) {
        Alert.alert("Error", `Failed to save media: ${error.message}`);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to pick media");
    } finally {
      setIsUploading(false);
    }
  };

  const UploadButton = () => (
    <LinearGradient
      colors={["#1B78B9", "#63348F"]}
      style={{
        borderRadius: 999,
        width: 32,
        height: 32,
      }}
      start={[0, 0]}
      end={[1, 1]}>
      <TouchableOpacity
        onPress={pickMedia}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        disabled={isUploading}>
        <Upload size={18} color="#ffffff" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const navigateToCategory = (id: number, type: string, items: MediaItem[]) => {
    console.log(items, "Items is this");
    router.push({
      pathname: `/clients/${id}/media/${type}`,
      params: { id, items: JSON.stringify(items) },
    });
  };

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
            You can find all the media files you uploaded ever in the Comgarli.
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
          <Image
            source={icons.arrowRight}
            resizeMode="contain"
            className="w-5 h-5 text-gray-500"
          />
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
          <Image
            source={icons.arrowRight}
            resizeMode="contain"
            className="w-5 h-5 text-gray-500"
          />
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
          <Image
            source={icons.arrowRight}
            resizeMode="contain"
            className="w-5 h-5 text-gray-500"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Media;
