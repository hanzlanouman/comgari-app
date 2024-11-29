import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import { Action } from "@/common/enum";
import { Trash2, X, Play } from "lucide-react-native";
import { getImageUrl } from "@/constants";

type MediaItem = {
  id?: number;
  url: string;
  mimeType: string;
  clientId: number;
  ownerId: number;
  ownerType: string;
};

const VideosMediaDetailScreen = () => {
  const { id, items } = useLocalSearchParams<{
    id: string;
    items: string;
  }>();

  const [parsedItems, setParsedItems] = useState<MediaItem[]>(
    JSON.parse(items || "[]")
  );
  // const parsedItems: MediaItem[] = JSON.parse(items || '[]');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const clientRepo = ClientRepository.getInstance();

  useEffect(() => {
    setParsedItems(JSON.parse(items || "[]"));
    console.log(items, "Item is this");
  }, [items]);
  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenVideos = 16;
  const sidePadding = 16;
  const videoWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenVideos * 2) / 3;
  const handleDelete = async (item) => {
    try {
      Alert.alert(
        "Delete Video",
        "Are you sure you want to delete this video?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                // Prepare payload for deletion
                const deletePayload = {
                  media: [
                    {
                      prev_media_id: item.id,
                      client_id: Number(id),
                      owner_type: item.owner_type || "Client",
                      owner_id: Number(id),
                      action: Action.REMOVE,
                      mimeType: item.mimeType,
                    },
                  ],
                };

                // Call update client media API for deletion
                await clientRepo.updateClientMedia(Number(id), deletePayload);

                // Optionally update local state or refetch documents
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
  const renderVideoItem = (item: MediaItem, index: number) => {
    console.log(item, "Item" + index);
    return (
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
        }}>
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
  };

  const renderVideoModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
          onPress={() => setModalVisible(false)}>
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                position: "absolute",
                top: 18,
                left: 16,
                right: 16,
                zIndex: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <TouchableOpacity
                onPress={() => selectedItem && handleDelete(selectedItem)}
                style={{
                  backgroundColor: "red",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
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
                }}>
                <X size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}>
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        className="px-4">
        <View>
          <View className="flex flex-row flex-wrap mt-4">
            {parsedItems.map(renderVideoItem)}
          </View>
        </View>
      </ScrollView>

      {renderVideoModal()}
    </SafeAreaView>
  );
};

export default VideosMediaDetailScreen;
