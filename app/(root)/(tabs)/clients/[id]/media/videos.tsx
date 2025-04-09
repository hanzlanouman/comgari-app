import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import { Action } from "@/common/enum";
import { Trash2, X, Play, Upload } from "lucide-react-native";
import { getImageUrl } from "@/constants";
import { IS_ANDROID, pickDocument, showErrorAlert } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "react-query";
import { useUpload } from "@/hooks/use-upload";

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

const VideosMediaDetailScreen = () => {
  const { id, items } = useLocalSearchParams<{
    id: string;
    items: string;
  }>();

  const [parsedItems, setParsedItems] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const clientRepo = ClientRepository.getInstance();
  const navigation = useNavigation();
  const { uploadAsync } = useUpload();

  useEffect(() => {
    const parsed = JSON.parse(items || "[]");
    setParsedItems(parsed);
  }, [items]);

  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenVideos = 16;
  const sidePadding = 16;
  const videoWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenVideos * 2) / 3;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const groupByDate = (items: MediaItem[]) => {
    // Sort by date in descending order (latest first)
    const sortedItems = [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt || "").getTime();
      const dateB = new Date(b.createdAt || "").getTime();
      return dateB - dateA;
    });

    // Group by formatted date
    return sortedItems.reduce((acc, item) => {
      const dateKey = formatDate(item.createdAt || "");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {} as Record<string, MediaItem[]>);
  };

  const groupedItems = groupByDate(parsedItems);

  const handleDelete = async (item: MediaItem) => {
    try {
      Alert.alert(
        "Delete Video",
        "Are you sure you want to delete this video?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const deletePayload = {
                  media: [
                    {
                      prev_media_id: item.id,
                      client_id: Number(id),
                      owner_type: item.ownerType || "Client",
                      owner_id: Number(id),
                      action: Action.REMOVE,
                      mimeType: item.mimeType,
                    },
                  ],
                };

                await clientRepo.updateClientMedia(Number(id), deletePayload);

                const updatedItems = parsedItems.filter((i) => i.id !== item.id);
                setParsedItems(updatedItems);
                setModalVisible(false);
                setSelectedItem(null);

                Alert.alert("Success", "Video deleted successfully");
              } catch (apiError) {
                console.error("Delete API Error:", apiError);
                Alert.alert("Delete Failed", "Could not delete the video");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting video:", error);
      Alert.alert("Delete Failed", "Could not delete the video");
    }
  };

  const renderVideoItem = (item: MediaItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={{
        width: videoWidth,
        height: videoWidth,
        marginRight: index % 3 === 2 ? 0 : spacingBetweenVideos,
        marginBottom: spacingBetweenVideos,
      }}
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
    >
      <Video
        source={{ uri: getImageUrl(item.url) }}
        style={{ width: "100%", height: "100%" }}
        className="rounded-[20px]"
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={false}
        isMuted
      />
      <View style={{ position: "absolute", bottom: 10, right: 10 }}>
        <Play size={24} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );

  const renderVideoModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
          onPress={() => setModalVisible(false)}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                position: "absolute",
                top: IS_ANDROID ? 24 : 18,
                left: 16,
                right: 16,
                zIndex: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => selectedItem && handleDelete(selectedItem)}
                style={{
                  backgroundColor: "red",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Trash2 size={16} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: "black",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <X size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Video
                source={{ uri: getImageUrl(selectedItem.url) }}
                style={{ width: "90%", height: "90%" }}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                isLooping
                shouldPlay
                onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
              />
            </View>
          </SafeAreaView>
        </Pressable>
      </Modal>
    );
  };

  const saveMediaMutation = useMutation(async (mediaItems: MediaItem[]) => {
    const payload = {
      files: mediaItems.map(({ url, mimeType, clientId, ownerId, ownerType }) => ({
        url,
        mimeType,
        clientId,
        ownerId,
        ownerType,
      })),
    };
    return await clientRepo.saveClientMedia(payload);
  });

  const pickMedia = async () => {
    try {
      const resp = await pickDocument(true, { type: "video/*" })
      if (!resp.isSuccess) {
        showErrorAlert(resp.error)
        return
      }
      setIsUploading(true);
      const uploadedMediaItems = []
      for (const file of resp.result) {
        try {
          // Validate the file is a video type
          if (!file.type?.startsWith("video/")) {
            showErrorAlert("Only video files are allowed")
            continue
          }
          
          const res = await uploadAsync(file)
          if (res.isSuccess && res.result) {
            uploadedMediaItems.push({
              url: res.result,
              mimeType: file.type,
              clientId: Number(id),
              ownerId: Number(id),
              ownerType: "client",
            })
          } else if (!res.isSuccess) {
            showErrorAlert(res.error || "Failed to upload video")
          }
        } catch (fileError) {
          console.error("Error processing file:", fileError)
          // Continue with other files
        }
      }
      
      if (uploadedMediaItems.length > 0) {
        try {
          await saveMediaMutation.mutateAsync(uploadedMediaItems);
          
          // Refresh the list with newly added items
          const response = await clientRepo.getClientMedia({
            client_id: Number(id),
            owner_id: Number(id),
            owner_type: "client",
          });
          
          // Handle the response safely
          const mediaItems = Array.isArray(response) ? response : [];
          
          // Filter for video type
          const updatedVideoItems = mediaItems.filter((item: any) => 
            item.mimeType && item.mimeType.startsWith("video/")
          );
          
          setParsedItems(updatedVideoItems);
        } catch (apiError) {
          console.error("API Error:", apiError);
          showErrorAlert("Failed to save uploaded videos")
        }
      }
      
      setIsUploading(false);
    } catch (error: any) {
      showErrorAlert(error?.message || "An unexpected error occurred")
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
        onPressIn={pickMedia}
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
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Videos",
      headerRight: () => <UploadButton />,
    });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        className="px-4"
      >
        {Object.keys(groupedItems).map((date, index) => (
          <View key={index}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 16,
                marginBottom: 8,
                color: "#333",
              }}
            >
              {date}
            </Text>
            <View className="flex flex-row flex-wrap mt-2">
              {groupedItems[date].map(renderVideoItem)}
            </View>
          </View>
        ))}
      </ScrollView>

      {renderVideoModal()}
    </SafeAreaView>
  );
};

export default VideosMediaDetailScreen;
