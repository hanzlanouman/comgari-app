import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { icons } from "@/constants";
import { ChevronRight, PencilLine, Trash2, Upload } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as FileSystem from 'expo-file-system';
import { ClientRepository } from "@/repositories/client/client";
import * as Sharing from 'expo-sharing';
import { getImageUrl } from "@/constants";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { Action} from '@/common/enum';
const MediaDocuments = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { items, id } = useLocalSearchParams();
  const clientRepo = ClientRepository.getInstance();

  const documentItems = items ? JSON.parse(items as string) : [];

  const snapPoints = useMemo(() => ["22%", "22%"], []);

  const renderBackdrop = useMemo(
    () => (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleDownload = async (doc) => {
    try {
      // Validate document URL
      if (!doc.url) {
        Alert.alert('Error', 'No document URL provided');
        return;
      }

      // Get the full URL for the document
      const fileUrl = getImageUrl(doc.url);

      // Generate a unique filename to prevent conflicts
      const filename = `${Date.now()}_${fileUrl.split('/').pop()}`;

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(
        fileUrl, 
        `${FileSystem.documentDirectory}${filename}`
      );

      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        // Share the downloaded file
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Download Complete', `File saved to ${downloadResult.uri}`);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      Alert.alert('Download Failed', 'Could not download the document');
    }
  };

  const handleDelete = async (doc) => {
    try {
      Alert.alert(
        'Delete Document', 
        'Are you sure you want to delete this document?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                // Prepare payload for deletion
                const deletePayload = {
                  media: [{
                    prev_media_id: doc.id,
                    client_id: Number(id),
                    owner_type: doc.owner_type || 'Client', 
                    owner_id: Number(id),
                    action: Action.REMOVE,
                    mimeType: doc.mimeType
                  }]
                };

                // Call update client media API for deletion
                await clientRepo.updateClientMedia(Number(id), deletePayload);

                // Optionally update local state or refetch documents
                Alert.alert('Success', 'Document deleted successfully');
              } catch (apiError) {
                console.error('Delete API Error:', apiError);
                Alert.alert('Delete Failed', 'Could not delete the document');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting document:', error);
      Alert.alert('Delete Failed', 'Could not delete the document');
    }
  };

  const handlePresentModalPress = useCallback((doc) => {
    setSelectedDocument(doc);
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
            className="px-4"
          >
            {documentItems.map((doc, index) => (
              <TouchableOpacity
                key={index}
                className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
                onPress={() => handlePresentModalPress(doc)}
              >
                <View className="flex-row items-center flex-1">
                  <Image 
                    source={
                      doc.mimeType.includes('pdf') ? icons.pdfIcon : icons.docIcon
                    } 
                    className="w-9 h-9" 
                  />
                  <View className="pl-2.5">
                    <Text
                      className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {doc.url || 'Untitled Document'}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={16} className="text-dark" />
              </TouchableOpacity>
            ))}

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              backdropComponent={renderBackdrop}
              backgroundStyle={{
                borderRadius: 24,
              }}
            >
              <BottomSheetView>
                <View className="p-4 pt-2">
                  <TouchableOpacity 
                    className="flex-row items-center justify-between border border-light rounded-xl p-2.5"
                    onPress={() => selectedDocument && handleDownload(selectedDocument)}
                  >
                    <View className="flex-row items-center">
                      <LinearGradient
                        colors={["#1B78B9", "#63348F"]}
                        className="rounded-full w-8 h-8"
                        start={[0, 0]}
                        end={[1, 1]}
                      >
                        <TouchableOpacity
                          className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px"
                        >
                          <Upload size={16} color="#ffffff" />
                        </TouchableOpacity>
                      </LinearGradient>
                      <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                        Download
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#1C1C1C" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-row items-center justify-between border border-light rounded-xl p-2.5 mt-3"
                    onPress={() => selectedDocument && handleDelete(selectedDocument)}
                  >
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        className="bg-red rounded-full w-8 h-8 flex flex-row justify-center items-center"
                      >
                        <Trash2 size={16} color="#ffffff" />
                      </TouchableOpacity>
                      <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                        Delete
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#1C1C1C" />
                  </TouchableOpacity>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </ScrollView>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default MediaDocuments;