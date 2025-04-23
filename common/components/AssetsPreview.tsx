import React from "react";
import { MediaItem } from "@/app/(root)/(tabs)/clients/[id]/notes/add-note";
import { getImageUrl, icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import { Trash2, Play, FileText, X } from "lucide-react-native";
import { Text, StyleSheet } from "react-native";
import {
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";
import { IS_ANDROID } from "@/utils";

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

  // Get URL from either localUri or url property
  const mediaUrl = media?.localUri || media?.url || "";

  // Determine media type
  const isImage = media?.mimeType?.toLowerCase().includes("image") || false;
  const isVideo = media?.mimeType?.toLowerCase().includes("video") || false;
  const isPDF = media?.mimeType?.toLowerCase().includes("pdf") || false;
  const isWord =
    media?.mimeType?.toLowerCase().includes("word") ||
    media?.mimeType?.toLowerCase().includes("doc") ||
    media?.mimeType?.toLowerCase().includes("docx") ||
    media?.mimeType?.toLowerCase().includes("officedocument") ||
    false;

  // Ensure we have valid media object with required properties
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
        onPress={() => setModalVisible(true)}
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
});
