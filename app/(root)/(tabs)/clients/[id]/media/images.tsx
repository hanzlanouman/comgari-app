import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Trash2, X } from "lucide-react-native";
import { Action } from "@/common/enum";
import { ClientRepository } from "@/repositories/client/client";
import { getImageUrl } from "@/constants";

type MediaItem = {
  id?: number;
  url: string;
  mimeType: string;
  clientId: number;
  ownerId: number;
  createdAt?: string;
  updatedAt?: string;
  ownerType: string;
};

const ImagesMediaDetailScreen = () => {
  const { id, items } = useLocalSearchParams<{
    id: string;
    items: string;
  }>();

  const [parsedItems, setParsedItems] = useState<MediaItem[]>(
    JSON.parse(items || "[]")
  );
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const clientRepo = ClientRepository.getInstance();

  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenImages = 16;
  const sidePadding = 16;
  const imageWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

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
      Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
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

              Alert.alert("Success", "Image deleted successfully");
            } catch (apiError) {
              console.error("Delete API Error:", apiError);
              Alert.alert("Delete Failed", "Could not delete the image");
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Delete Failed", "Could not delete the image");
    }
  };

  const renderImageItem = (item: MediaItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={{
        width: imageWidth,
        height: imageWidth,
        marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
        marginBottom: spacingBetweenImages,
      }}
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
    >
      <Image
        source={{ uri: getImageUrl(item.url) }}
        style={{ width: "100%", height: "100%" }}
        className="rounded-[20px]"
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderImageModal = () => {
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
                top: 18,
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
              <Image
                source={{ uri: getImageUrl(selectedItem.url) }}
                style={{ width: "90%", height: "90%" }}
                resizeMode="contain"
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
              {groupedItems[date].map(renderImageItem)}
            </View>
          </View>
        ))}
      </ScrollView>

      {renderImageModal()}
    </SafeAreaView>
  );
};

export default ImagesMediaDetailScreen;
