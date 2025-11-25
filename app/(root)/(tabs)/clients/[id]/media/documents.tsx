import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { icons } from "@/constants";
import {
  ChevronRight,
  Download,
  Trash2,
  Upload,
  Share2,
} from "lucide-react-native";
import { ClientRepository } from "@/repositories/client/client";
import { getImageUrl } from "@/constants";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Action } from "@/common/enum";
import {
  downloadMedia,
  pickDocument,
  showErrorAlert,
  showSuccessAlert,
} from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "@tanstack/react-query";
import { useUpload } from "@/hooks/use-upload";
import * as Sharing from "expo-sharing";
import { isRunningInExpoGo } from "expo";
import * as FileSystem from "expo-file-system";

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
  const [isDownloading, setIsDownloading] = useState(false);

  const [documentItems, setDocumentItems] = useState(
    items ? JSON.parse(items as string) : []
  );

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

    try {
      if (isRunningInExpoGo()) {
        const fileUrl = getImageUrl(doc.url);
        const fileName = doc.url.split("/").pop() || "document";
        const fileUri = FileSystem.cacheDirectory + fileName;

        // Show loading state
        setIsDownloading(true);

        // Download the file
        const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);

        if (downloadResult.status !== 200) {
          throw new Error("Failed to download file");
        }

        if (Platform.OS === "android") {
          try {
            // Request storage permissions
            const permissions =
              await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

            if (permissions.granted) {
              // Read the downloaded file
              const base64Data = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
              });

              const mimeType = doc.mimeType || "application/pdf";

              // Create new file in selected directory
              const destinationUri =
                await FileSystem.StorageAccessFramework.createFileAsync(
                  permissions.directoryUri,
                  fileName,
                  mimeType
                );

              // Write the file content
              await FileSystem.StorageAccessFramework.writeAsStringAsync(
                destinationUri,
                base64Data,
                { encoding: FileSystem.EncodingType.Base64 }
              );

              showSuccessAlert("Document saved successfully");
            } else {
              showErrorAlert("Permission to save file was denied");
              // Fallback to share sheet if permission denied
              await Sharing.shareAsync(fileUri, {
                mimeType: doc.mimeType || "application/pdf",
                dialogTitle: "Save Document",
              });
            }
          } catch (err) {
            console.error("Storage access error:", err);
            showErrorAlert(
              "Could not save to selected location. Opening share options..."
            );
            // Fallback to share sheet
            await Sharing.shareAsync(fileUri, {
              mimeType: doc.mimeType || "application/pdf",
              dialogTitle: "Save Document",
            });
          }
        } else {
          // iOS handling
          await Sharing.shareAsync(fileUri, {
            mimeType: doc.mimeType || "application/pdf",
            dialogTitle: "Save Document",
          });
        }
      } else {
        const { success, message } = await downloadMedia(getImageUrl(doc.url));
        setTimeout(() => {
          if (success) {
            showSuccessAlert(message);
          } else {
            showErrorAlert(message);
          }
        }, 1000);
      }
    } catch (error) {
      showErrorAlert("Error downloading document");
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareDocument = async (doc: any) => {
    bottomSheetModalRef.current?.close();

    try {
      const fileUrl = getImageUrl(doc.url);
      const fileName = doc.url.split("/").pop() || "document";
      const fileUri = FileSystem.cacheDirectory + fileName;

      setIsDownloading(true);

      const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error("Failed to download file for sharing");
      }

      // Set isDownloading to false before showing the share dialog
      setIsDownloading(false);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: doc.mimeType || "application/pdf",
          dialogTitle: "Share Document",
          UTI:
            doc.mimeType && doc.mimeType.includes("pdf")
              ? "com.adobe.pdf"
              : "public.item",
        });
      } else {
        showErrorAlert("Sharing is not available on this device");
      }
    } catch (error) {
      showErrorAlert("Error sharing document");
      console.error("Share error:", error);
      setIsDownloading(false);
    }
  };

  const handleDelete = async (doc: any) => {
    try {
      Alert.alert(
        "Delete Document",
        "Are you sure you want to delete this document?",
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
                const deletePayload = {
                  media: [
                    {
                      prev_media_id: doc.id,
                      client_id: Number(id),
                      owner_type: doc.owner_type || "Client",
                      owner_id: Number(id),
                      action: Action.REMOVE,
                      mimeType: doc.mimeType,
                    },
                  ],
                };

                await clientRepo.updateClientMedia(Number(id), deletePayload);

                const updatedDocuments = documentItems.filter(
                  (item: any) => item.id !== doc.id
                );
                setDocumentItems(updatedDocuments);
                bottomSheetModalRef.current?.close();
                Alert.alert("Success", "Document deleted successfully");
              } catch (apiError) {
                console.error("Delete API Error:", apiError);
                Alert.alert("Delete Failed", "Could not delete the document");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting document:", error);
      Alert.alert("Delete Failed", "Could not delete the document");
    }
  };

  const handlePresentModalPress = useCallback((doc: any) => {
    setSelectedDocument(doc);
    bottomSheetModalRef.current?.present();
  }, []);

  const saveMediaMutation = useMutation({
    mutationFn: async (mediaItems: any[]) => {
      const payload = {
        files: mediaItems.map(
          ({ url, mimeType, clientId, ownerId, ownerType }) => ({
            url,
            mimeType,
            clientId,
            ownerId,
            ownerType,
          })
        ),
      };
      return await clientRepo.saveClientMedia(payload);
    },
  });

  const pickMedia = async () => {
    try {
      const resp = await pickDocument(true, {
        type: "*/*",
      });

      if (!resp.isSuccess) {
        showErrorAlert(resp.error);
        return;
      }

      setIsUploading(true);
      const uploadedMediaItems: any[] = [];

      for (const file of resp.result) {
        if (
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const res = await uploadAsync(file);
          if (res.isSuccess) {
            uploadedMediaItems.push({
              url: res.result,
              mimeType: file.type,
              clientId: Number(id),
              ownerId: Number(id),
              ownerType: "client",
            });
          }
        } else {
          showErrorAlert("Only PDF and Word documents are allowed");
        }
      }

      if (uploadedMediaItems.length > 0) {
        await saveMediaMutation.mutateAsync(uploadedMediaItems);

        try {
          const response = await clientRepo.getClientMedia({
            client_id: Number(id),
            owner_id: Number(id),
            owner_type: "client",
          });

          const mediaItems = Array.isArray(response) ? response : [];

          const updatedDocItems = mediaItems.filter(
            (item: any) =>
              item.mimeType &&
              (item.mimeType === "application/pdf" ||
                item.mimeType === "application/msword" ||
                item.mimeType ===
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
          );

          setDocumentItems(updatedDocItems);
        } catch (fetchError) {
          console.error("Error fetching updated media:", fetchError);
        }
      }

      setIsUploading(false);
    } catch (error: any) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? error.message
          : "Error uploading documents";
      showErrorAlert(errorMessage);
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
      end={[1, 1]}
    >
      <TouchableOpacity
        onPressIn={pickMedia}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        disabled={isUploading}
      >
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
            className="px-4"
          >
            {isDownloading && (
              <View
                className="absolute inset-0 z-50 flex-1"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#1B78B9" />
              </View>
            )}
            {documentItems.map((doc: any, index: number) => (
              <TouchableOpacity
                key={index}
                className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
                onPress={() => handlePresentModalPress(doc)}
              >
                <View className="flex-row items-center flex-1">
                  <Image
                    source={
                      doc.mimeType.includes("pdf")
                        ? icons.pdfIcon
                        : icons.docIcon
                    }
                    className="w-9 h-9"
                  />
                  <View className="pl-2.5 flex-1">
                    <Text
                      className="text-sm sm:text-base text-dark font-ManropeMedium"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {doc.url
                        ? doc.url.split("/").pop() || "Untitled Document"
                        : "Untitled Document"}
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
                  {Platform.OS !== "ios" && (
                    <TouchableOpacity
                      className="flex-row items-center justify-between border border-light rounded-xl p-2.5"
                      onPress={() =>
                        selectedDocument && handleDownload(selectedDocument)
                      }
                    >
                      <View className="flex-row items-center">
                        <LinearGradient
                          colors={["#1B78B9", "#63348F"]}
                          className="rounded-full w-8 h-8"
                          start={[0, 0]}
                          end={[1, 1]}
                        >
                          <TouchableOpacity className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px">
                            <Download size={16} color="#ffffff" />
                          </TouchableOpacity>
                        </LinearGradient>
                        <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                          Download
                        </Text>
                      </View>
                      <ChevronRight size={16} color="#1C1C1C" />
                    </TouchableOpacity>
                  )}

                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      className="flex-row items-center justify-between border border-light rounded-xl p-2.5"
                      onPress={() =>
                        selectedDocument &&
                        handleShareDocument(selectedDocument)
                      }
                    >
                      <View className="flex-row items-center">
                        <TouchableOpacity className="bg-dark rounded-full w-8 h-8 flex flex-row justify-center items-center">
                          <Share2 size={16} color="#ffffff" />
                        </TouchableOpacity>
                        <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                          Share
                        </Text>
                      </View>
                      <ChevronRight size={16} color="#1C1C1C" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    className="flex-row items-center justify-between border border-light rounded-xl p-2.5 mt-3"
                    onPress={() =>
                      selectedDocument && handleDelete(selectedDocument)
                    }
                  >
                    <View className="flex-row items-center">
                      <TouchableOpacity className="bg-red rounded-full w-8 h-8 flex flex-row justify-center items-center">
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
  );
};

export default MediaDocuments;
