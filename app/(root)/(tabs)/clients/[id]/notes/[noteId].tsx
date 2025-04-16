import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";

import { images, getImageUrl } from "@/constants";
import { vs } from "react-native-size-matters";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Pencil } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import ActionModal from "../../components/ActionModal";
import { AssetPreview } from "@/common/components";
import { useQueryClient } from "react-query";

const NoteDetails = () => {
  const params = useLocalSearchParams();
  const id =
    typeof params.id === "string"
      ? parseInt(params.id, 10)
      : (params.id as unknown as number);
  const noteId =
    typeof params.noteId === "string"
      ? parseInt(params.noteId, 10)
      : (params.noteId as unknown as number);
  const noteDetails = params.noteDetails as string;
  const [note, setNote] = useState<any>(null);

  const clientRepo = ClientRepository.getInstance();
  const queryClient = useQueryClient();

  const navigation = useNavigation();
  const actionModalRef = useRef<BottomSheetModal>(null);

  // Parse note details when component mounts
  useEffect(() => {
    if (noteDetails) {
      try {
        const parsedNote = JSON.parse(noteDetails);

        // Fix media URLs if they're not already formatted
        if (parsedNote.media && Array.isArray(parsedNote.media)) {
          parsedNote.media = parsedNote.media.map((m: any) => {
            // Ensure we have localUri for each media item
            if (!m.localUri && m.url) {
              m.localUri = m.url;
            }
            return m;
          });
        }

        console.log("Media items:", parsedNote.media);
        setNote(parsedNote);
      } catch (error) {
        console.error("Error parsing note details:", error);
      }
    }
  }, [noteDetails]);

  const handleUpdatePress = () => {
    actionModalRef?.current?.dismiss();
    router.push({
      pathname: "/(root)/(tabs)/clients/[id]/notes/add-note",
      params: {
        id: id,
        noteId: note?.id,
        noteDetails: JSON.stringify(note),
      },
    });
  };

  const handleDeletePress = async () => {
    try {
      await clientRepo.deleteNote(noteId);
      queryClient.invalidateQueries(["clientNotes"]);
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
            onPressIn={() => actionModalRef.current?.present()}
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
        <Text className="text-lg text-dark">Loading note details...</Text>
      </SafeAreaView>
    );
  }

  const stripHtmlTags = (html: string | null | undefined) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
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
                    note?.author?.user?.avatar
                      ? { uri: getImageUrl(note.author.user.avatar) }
                      : images.user
                  }
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(50), height: vs(50) }}
                />
                <View className="pl-4">
                  <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                    {note?.author?.user?.full_name || "Unknown User"}
                  </Text>
                  <Text className="text-base font-ManropeMedium text-dark-100 mt-1">
                    {note?.created_at
                      ? new Date(note.created_at).toLocaleDateString()
                      : ""}
                  </Text>
                </View>
              </View>

              {/* Note Content */}
              <Text className="text-sm sm:text-base font-ManropeMedium text-dark-100 mt-4">
                {stripHtmlTags(note?.notes)}
              </Text>
            </View>

            {/* Media Items */}
            {note?.media &&
              Array.isArray(note.media) &&
              note.media.length > 0 && (
                <View className="px-4 pt-2 pb-4">
                  <Text className="text-base font-ManropeSemibold text-dark mb-2">
                    Attachments ({note.media.length})
                  </Text>
                  <View className="flex flex-row flex-wrap">
                    {note.media.map((media: any, index: number) => (
                      <AssetPreview
                        disabled={false}
                        index={index}
                        media={media}
                        key={index}
                      />
                    ))}
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
