import React, { useRef } from "react";
import { MediaItem } from "@/app/(root)/(tabs)/clients/[id]/notes/add-note";
import { getImageUrl, icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import {
  Trash2,
  Play,
  FileText,
  X,
  Download,
  Share2,
  ChevronRight,
} from "lucide-react-native";
import { Text, StyleSheet, Platform, ActivityIndicator } from "react-native";
import {
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";
import {
  IS_ANDROID,
  downloadMedia,
  showErrorAlert,
  showSuccessAlert,
} from "@/utils";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { isRunningInExpoGo } from "expo";

const windowWidth = Dimensions.get("window").width;
const spacingBetweenImages = 16;
const sidePadding = 16;
const imageWidth =
  (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

export const AssetPreview = ({
  disabled,
  index,
  media,
  removeMedia,
}: {
  disabled: boolean;
  media: MediaItem;
  index: number;
  removeMedia?: () => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [videoStatus, setVideoStatus] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const mediaUrl = media?.localUri || media?.url || "";

  const isImage = media?.mimeType?.toLowerCase().includes("image") || false;
  const isVideo = media?.mimeType?.toLowerCase().includes("video") || false;
  const isPDF = media?.mimeType?.toLowerCase().includes("pdf") || false;
  const isWord =
    media?.mimeType?.toLowerCase().includes("word") ||
    media?.mimeType?.toLowerCase().includes("doc") ||
    media?.mimeType?.toLowerCase().includes("docx") ||
    media?.mimeType?.toLowerCase().includes("officedocument") ||
    false;
  const isDocument = isPDF || isWord;

  const handleDownload = async () => {
    bottomSheetModalRef.current?.close();

    try {
      if (isRunningInExpoGo()) {
        const fileUrl = getImageUrl(mediaUrl);
        const fileName = mediaUrl.split("/").pop() || "document";
        const fileUri = FileSystem.cacheDirectory + fileName;

        setIsDownloading(true);

        const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);

        if (downloadResult.status !== 200) {
          throw new Error("Failed to download file");
        }

        if (Platform.OS === "android") {
          try {
            const permissions =
              await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

            if (permissions.granted) {
              const base64Data = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
              });

              const mimeType = media?.mimeType || "application/pdf";

              const destinationUri =
                await FileSystem.StorageAccessFramework.createFileAsync(
                  permissions.directoryUri,
                  fileName,
                  mimeType
                );

              await FileSystem.StorageAccessFramework.writeAsStringAsync(
                destinationUri,
                base64Data,
                { encoding: FileSystem.EncodingType.Base64 }
              );

              showSuccessAlert("Document saved successfully");
            } else {
              showErrorAlert("Permission to save file was denied");
              await Sharing.shareAsync(fileUri, {
                mimeType: media?.mimeType || "application/pdf",
                dialogTitle: "Save Document",
              });
            }
          } catch (err) {
            console.error("Storage access error:", err);
            showErrorAlert(
              "Could not save to selected location. Opening share options..."
            );
            await Sharing.shareAsync(fileUri, {
              mimeType: media?.mimeType || "application/pdf",
              dialogTitle: "Save Document",
            });
          }
        } else {
          await Sharing.shareAsync(fileUri, {
            mimeType: media?.mimeType || "application/pdf",
            dialogTitle: "Save Document",
          });
        }
      } else {
        const { success, message } = await downloadMedia(getImageUrl(mediaUrl));
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

  const handleShareDocument = async () => {
    try {
      const fileUrl = getImageUrl(mediaUrl);
      const rawFileName = (mediaUrl.split("/").pop() || "document").split("?")[0];
      const cacheDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "";
      const fileUri = cacheDir + rawFileName;

      setIsDownloading(true);

      const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error("Failed to download file for sharing");
      }

      setIsDownloading(false);

      // Close sheet and wait for its dismissal animation to finish before
      // presenting the iOS share sheet — UIActivityViewController will be
      // silently ignored if a modal is still animating out.
      bottomSheetModalRef.current?.close();
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      const mimeType = media?.mimeType || "application/pdf";
      const uti = mimeType.includes("pdf")
        ? "com.adobe.pdf"
        : mimeType.includes("msword")
        ? "com.microsoft.word.doc"
        : mimeType.includes("officedocument")
        ? "org.openxmlformats.wordprocessingml.document"
        : "public.item";

      await Sharing.shareAsync(downloadResult.uri, { mimeType, UTI: uti });
    } catch (error) {
      showErrorAlert("Error sharing document");
      console.error("Share error:", error);
      setIsDownloading(false);
    }
  };

  if (!media || !media.mimeType) {
    return (
      <View
        style={{
          width: imageWidth,
          height: imageWidth,
          marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
          marginBottom: spacingBetweenImages,
          backgroundColor: "#f3f3f3",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#4A4A4A", fontSize: 14, textAlign: "center" }}>
          Invalid Media
        </Text>
      </View>
    );
  }

  const renderModal = () => {
    if (!modalVisible) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.modalCloseButton}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButtonCircle}
              >
                <X size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {isImage ? (
                <Image
                  source={{ uri: getImageUrl(mediaUrl) }}
                  style={{ width: "100%", height: "80%" }}
                  resizeMode="contain"
                />
              ) : isVideo ? (
                <Video
                  source={{ uri: getImageUrl(mediaUrl) }}
                  style={{ width: "90%", height: "90%" }}
                  resizeMode={ResizeMode.CONTAIN}
                  useNativeControls
                  isLooping
                  shouldPlay
                  onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
                />
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={isPDF ? icons.pdfIcon : icons.docIcon}
                    style={{ width: 100, height: 100, marginBottom: 20 }}
                    resizeMode="contain"
                  />
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {mediaUrl.split("/").pop() || "Document"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={{
          width: imageWidth,
          height: imageWidth,
          marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
          marginBottom: spacingBetweenImages,
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#f3f3f3",
          position: "relative",
        }}
        onPress={() => {
          if (isDocument) {
            bottomSheetModalRef.current?.present();
          } else {
            setModalVisible(true);
          }
        }}
        disabled={disabled}
      >
        {removeMedia && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={removeMedia}
            disabled={disabled}
          >
            <Trash2 size={12} color="#ffffff" />
          </TouchableOpacity>
        )}

        {isImage ? (
          <Image
            source={{ uri: getImageUrl(mediaUrl) }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : isVideo ? (
          <>
            <Video
              source={{ uri: getImageUrl(mediaUrl) }}
              style={{ width: "100%", height: "100%" }}
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay={false}
              isMuted
            />
            <View style={styles.playButtonOverlay}>
              <Play size={24} color="#ffffff" />
            </View>
          </>
        ) : isPDF ? (
          <View style={styles.documentContainer}>
            <Image
              source={icons.pdfIcon}
              style={{ width: "60%", height: "60%" }}
              resizeMode="contain"
            />
          </View>
        ) : isWord ? (
          <View style={styles.documentContainer}>
            <Image
              source={icons.docIcon}
              style={{ width: "60%", height: "60%" }}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.fileContainer}>
            <FileText size={40} color="#4A4A4A" />
            <Text style={styles.fileTypeText}>
              {media.mimeType.split("/")[1]?.toUpperCase() || "File"}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {renderModal()}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["18%"]}
        handleComponent={null}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
        backgroundStyle={{ borderRadius: 24 }}
      >
        <BottomSheetView>
          <View style={{ padding: 16, paddingTop: 8 }}>
            {isDownloading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <ActivityIndicator size="large" color="#1B78B9" />
              </View>
            )}

            {Platform.OS !== "ios" && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDownload}
              >
                <View style={styles.actionButtonContent}>
                  <LinearGradient
                    colors={["#1B78B9", "#63348F"]}
                    style={styles.actionIcon}
                    start={[0, 0]}
                    end={[1, 1]}
                  >
                    <Download size={16} color="#ffffff" />
                  </LinearGradient>
                  <Text style={styles.actionText}>Download</Text>
                </View>
                <ChevronRight size={16} color="#1C1C1C" />
              </TouchableOpacity>
            )}

            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShareDocument}
              >
                <View style={styles.actionButtonContent}>
                  <View style={styles.shareIcon}>
                    <Share2 size={16} color="#ffffff" />
                  </View>
                  <Text style={styles.actionText}>Share</Text>
                </View>
                <ChevronRight size={16} color="#1C1C1C" />
              </TouchableOpacity>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalCloseButton: {
    position: "absolute",
    top: IS_ANDROID ? 24 : 18,
    right: 16,
    zIndex: 10,
  },
  closeButtonCircle: {
    backgroundColor: "black",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  playButtonOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  documentContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  fileContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fileTypeText: {
    color: "#4A4A4A",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  shareIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1C1C1C",
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    fontFamily: "ManropeMedium",
    color: "#1C1C1C",
    marginLeft: 10,
  },
});
