import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
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
import { ChevronRight, Download, Trash2, Upload } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClientRepository } from "@/repositories/client/client";
import { getImageUrl } from "@/constants";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Action } from '@/common/enum';
import { downloadMedia, pickDocument, showErrorAlert, showSuccessAlert } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "react-query";
import { useUpload } from "@/hooks/use-upload";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

const MediaDocuments = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { items, id } = useLocalSearchParams();
  const clientRepo = ClientRepository.getInstance();
  const [isUploading, setIsUploading] = useState(false);
  const navigation = useNavigation();
  const { uploadAsync } = useUpload();

  const [documentItems, setDocumentItems] = useState(items ? JSON.parse(items as string) : []);

  const snapPoints = useMemo(() => ["30%", "40%"], []);

  const renderBackdrop = useMemo(
    // eslint-disable-next-line react/display-name
    () => (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleDownload = async (doc: any) => {
    bottomSheetModalRef.current?.close();
    const { success, message } = await downloadMedia(getImageUrl(doc.url));
    setTimeout(() => {
      if (success) {
        showSuccessAlert(message)
      } else {
        showErrorAlert(message)
      }
    }, 1000)
  };


  const handleDelete = async (doc: any) => {
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
                // Update local state to remove the deleted document
                const updatedDocuments = documentItems.filter((item:any) => item.id !== doc.id);
                setDocumentItems(updatedDocuments);
                bottomSheetModalRef.current?.close();
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

  const handlePresentModalPress = useCallback((doc: any) => {
    setSelectedDocument(doc);
    bottomSheetModalRef.current?.present();
  }, []);

  const saveMediaMutation = useMutation(async (mediaItems) => {
    const payload = {
      files: mediaItems.map(({ url, mimeType, clientId, ownerId, ownerType }: any) => ({
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
      // Accept application types for documents
      const resp = await pickDocument(true, { 
        type: "application/*" 
      });
      
      if (!resp.isSuccess) {
        showErrorAlert(resp.error)
        return
      }
      
      setIsUploading(true);
      const uploadedMediaItems = []
      
      for (const file of resp.result) {
        const res = await uploadAsync(file)
        if (res.isSuccess) {
          uploadedMediaItems.push({
            url: res.result,
            mimeType: file.type,
            clientId: Number(id),
            ownerId: Number(id),
            ownerType: "client",
          })
        }
      }
      
      await saveMediaMutation.mutateAsync(uploadedMediaItems);
      
      try {
        // Refresh the list with newly added items
        const response = await clientRepo.getClientMedia({
          client_id: Number(id),
          owner_id: Number(id),
          owner_type: "client",
        });
        
        // Handle the response safely
        const mediaItems = Array.isArray(response) ? response : [];
        
        // Filter for documents (not images or videos)
        const updatedDocItems = mediaItems.filter((item: any) => 
          item.mimeType && 
          !item.mimeType.startsWith("image/") && 
          !item.mimeType.startsWith("video/")
        );
        
        setDocumentItems(updatedDocItems);
      } catch (fetchError) {
        console.error("Error fetching updated media:", fetchError);
      }
      
      setIsUploading(false);
    } catch (error) {
      showErrorAlert(error?.message || "Error uploading documents")
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
      title: "Documents",
      headerRight: () => <UploadButton />,
    });
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
            className="px-4"
          >
            {documentItems.map((doc: any, index: number) => (
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
                          <Download size={16} color="#ffffff" />
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