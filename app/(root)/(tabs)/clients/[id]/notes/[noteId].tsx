import React, { useRef, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";

import { images, getImageUrl } from "@/constants";
import { vs } from "react-native-size-matters";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModalProvider,
  BottomSheetModal
} from "@gorhom/bottom-sheet";
import { Pencil } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import ActionModal from "../../components/ActionModal";

type MediaItem = {
  id?: number;
  url: string;
  mimeType: string;
  clientId: number;
  localUri?: string;
};

const NoteDetails = () => {
  const { id, noteId, noteDetails } = useLocalSearchParams();
  const note = noteDetails ? JSON.parse(noteDetails as string) : null;

  const clientRepo = ClientRepository.getInstance();
  const navigation = useNavigation();
  const actionModalRef = useRef<BottomSheetModal>(null);

  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenImages = 16;
  const sidePadding = 16;
  const imageWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

  const handleUpdatePress = () => {
    router.push({
      pathname: "/(root)/(tabs)/clients/[id]/notes/add-note",
      params: {
        id: id,
        noteId: note.id,
        noteDetails: JSON.stringify(note)
      }
    }
    );
  }
  const handleDeletePress = async () => {
    try {
      await clientRepo.deleteNote(noteId);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Note Details",
      headerRight: () => (
        <LinearGradient
          colors={["#1B78B9", "#63348F"]}
          className="rounded-full w-8 h-8"
          start={[0, 0]}
          end={[1, 1]}
        >
          <TouchableOpacity
            onPress={() => actionModalRef.current?.present()}
            className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px"
          >
            <Pencil size={17} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>
      ),
    });
  }, [navigation]);

  if (!note) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-dark">Unable to load note details</Text>
      </SafeAreaView>
    );
  }

  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, '');
  };
  const getMediaPreview = (mimeType: string, url: string) => {
    if (!mimeType || !url) {
      return images.pdf; // Default placeholder for missing data
    }
    switch (true) {
      case mimeType.includes("pdf"):
        return images.pdf; // Predefined icon for PDFs
      case mimeType.includes("text"):
        return images.doc; // Predefined icon for text files
      case mimeType.includes("video"):
        return { uri: url }; // Video URL for `Video` component
      case mimeType.includes("image"):
        return { uri: url }; // Image URL for `Image` component
      default:
        return images.pdf; // Fallback for unknown types
    }
  };
  const renderMediaPreview = (media: MediaItem, index: number) => {
    const isImage = media.mimeType?.includes("image");
    const isVideo = media.mimeType?.includes("video");
    const isPDFOrText = media.mimeType?.includes("pdf") || media.mimeType?.includes("text");
    return (
      <View
        key={index}
        style={{
          width: imageWidth,
          height: imageWidth,
          marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
          marginBottom: spacingBetweenImages,
        }}
        className="relative">

        {isImage ? (
          <Image
            source={{ uri: getImageUrl(media.url) }}
            style={{ width: "100%", height: "100%" }}
            className="rounded-[20px]"
            resizeMode="cover"
          />
        ) : isVideo ? (
          <Video
            source={{ uri: getImageUrl(media.url) }}
            style={{ width: "100%", height: "100%" }}
            className="rounded-[20px]"
            resizeMode="cover"
            shouldPlay={false}
          />
        ) : isPDFOrText ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f3f3f3",
              borderRadius: 20,
            }}
          >
            <Image
              source={images.pdf}
              style={{ width: "100%", height: "100%" }}
              className="rounded-[20px]"
              resizeMode="contain"
            />
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f3f3f3",
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#4A4A4A", fontSize: 14, textAlign: "center" }}>
              Unsupported File
            </Text>
          </View>
        )}
      </View>
    );
  };
  return (
<GestureHandlerRootView style={{ flex: 1 }}>
  <BottomSheetModalProvider>
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-4 mt-4">
          {/* User Info */}
          <View className="flex-row items-center">
            <Image
              source={
                note.project?.created_by?.user[0]?.avatar
                  ? { uri: getImageUrl(note.project.created_by.user[0].avatar) }
                  : images.user
              }
              resizeMode="cover"
              className="rounded-full"
              style={{ width: vs(50), height: vs(50) }}
            />
            <View className="pl-4">
              <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                {note.project?.created_by?.user[0]?.full_name || "Unknown User"}
              </Text>
              <Text className="text-base font-ManropeMedium text-dark-100 mt-1">
                {new Date(note.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Note Content */}
          <Text className="text-sm sm:text-base font-ManropeMedium text-dark-100 mt-4">
            {stripHtmlTags(note.notes)}
          </Text>
        </View>

        {/* Media Items */}
        {note.media && note.media.length > 0 && (
          <View className="p-4">
            <View className="flex flex-row flex-wrap">
              {note.media.map(renderMediaPreview)}
            </View>
          </View>
        )}

        {/* Action Modal */}
        <ActionModal
          ref={actionModalRef}
          onUpdate={handleUpdatePress}
          onDelete={handleDeletePress}
        />
      </ScrollView>
    </SafeAreaView>
  </BottomSheetModalProvider>
</GestureHandlerRootView>

  );
};

export default NoteDetails;