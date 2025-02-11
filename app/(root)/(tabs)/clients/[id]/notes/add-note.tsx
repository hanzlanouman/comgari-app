import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { LinearGradient } from "expo-linear-gradient";

import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Upload, Trash2 } from "lucide-react-native";
import { useFormik } from "formik";
import { useMutation } from "react-query";

// Import necessary constants and types
import { CustomButton } from "@/common/components";
import { getImageUrl, images } from "@/constants";
import { ClientRepository } from "@/repositories/client/client";
import { InsertLinkModal } from "../../components/InsertLinkModal";
import { getExtFromUri, pickDocument, showErrorAlert } from "@/utils";
import { useUpload } from "@/hooks/use-upload";

type MediaItem = {
  id?: number;
  url: string;
  mimeType: string;
  clientId: number;
  localUri?: string;
};

type MediaUpdatePayload = {
  prev_media_id?: number;
  new_url?: string;
  client_id: number;
  owner_type: string;
  mimeType?: string;
  owner_id: number;
  action: "Add" | "Remove";
};

// Custom header rendering for RichToolbar
const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);
const getMediaPreview = (mimeType: string, url: string) => {
  switch (true) {
    case mimeType.includes("pdf"):
      return images.pdf;
    case mimeType.includes("text"):
      return images.doc;
    case mimeType.includes("video"):
      return { uri: url };
    default:
      return { uri: getImageUrl(url) };
  }
};
const AddNote = () => {
  const richText = useRef();
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");
  const { id, noteId, noteDetails } = useLocalSearchParams();
  const projectId = parseInt(id as string);
  const clientRepo = ClientRepository.getInstance();
  const navigation = useNavigation();

  const { uploadMultiple } = useUpload()

  const parsedNoteDetails = noteDetails
    ? JSON.parse(noteDetails as string)
    : null;
  const isEditMode = !!parsedNoteDetails;

  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenImages = 16;
  const sidePadding = 16;
  const imageWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

  const uploadMediaMutation = useMutation({
    mutationFn: async (file: {
      uri: string;
      type: string;
      fileName?: string;
    }) => {
      const formData = new FormData();
      const fileToUpload = {
        uri: file.uri,
        type: file.type || "image/jpeg",
        name: file.fileName || "file.jpg",
      } as any;
      formData.append("files", fileToUpload);

      const response = await clientRepo.uploadMedia(formData);
      return {
        url: response.data[0].filename,
        mimeType: file.type || "image/jpeg",
        localUri: file.uri,
      };
    },
  });

  const noteMutation = useMutation({
    mutationFn: async (payload: {
      notes?: string;
      project_id?: number;
      client_note_media?: Omit<MediaItem, "localUri">[];
      media?: MediaUpdatePayload[];
    }) => {
      if (isEditMode) {
        if (payload.notes || payload.project_id) {
          await clientRepo.updateNote(parsedNoteDetails.id, {
            notes: payload.notes,
            project_id: payload.project_id,
          });
        }

        if (payload.media && payload.media.length > 0) {
          await clientRepo.updateClientMedia(Number(id), {
            media: payload.media,
          });
        }
      } else {
        console.log({
          notes: payload.notes,
          project_id: payload.project_id,
          client_note_media: payload.client_note_media,
        });
        return await clientRepo.createNote({
          notes: payload.notes,
          project_id: payload.project_id,
          client_note_media: payload.client_note_media,
        });
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      setUploadedMedia(
        parsedNoteDetails?.media && parsedNoteDetails.media.length > 0
          ? parsedNoteDetails.media.map((media) => ({
            id: media.id,
            url: media.url,
            mimeType: media.mimeType,
            localUri: getImageUrl(media.url),
            clientId: projectId,
            ownerId: media.ownerId,
            ownerType: media.ownerType,
          }))
          : []
      );
    }
  }, [isEditMode, projectId]);

  const formik = useFormik({
    initialValues: {
      notes: isEditMode && parsedNoteDetails?.notes
        ? parsedNoteDetails.notes.replace(/<[^>]*>/g, "")
        : "",
      project_id: projectId,
    },
    onSubmit: async (values) => {
      try {
        const mediaUpdates = [];
        if (isEditMode) {
          mediaUpdates.push(
            ...Array.from(new Set(removedMediaIds)).map((mediaId) => ({
              prev_media_id: mediaId,
              client_id: projectId,
              owner_type: "note",
              owner_id: parsedNoteDetails.id,
              action: "Remove",
            }))
          );

          mediaUpdates.push(
            ...uploadedMedia
              .filter((media) => !media.id)
              .map((media) => ({
                client_id: projectId,
                owner_type: "note",
                owner_id: parsedNoteDetails.id,
                new_url: media.url,
                mimeType: media.mimeType,
                action: "Add",
              }))
          );

          await noteMutation.mutateAsync({
            notes: values.notes,
            project_id: values.project_id,
            media: mediaUpdates.length > 0 ? mediaUpdates : undefined,
          });
        } else {
          await noteMutation.mutateAsync({
            notes: values.notes,
            project_id: values.project_id,
            client_note_media: uploadedMedia.map(({ localUri, ...rest }) => rest),
          });
        }

        Alert.alert(
          "Success",
          isEditMode ? "Note updated successfully" : "Note created successfully"
        );
        router.push(`/clients/${id.toString()}/notes`);
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to save note");
      }
    },
  });

  const pickMedia = async () => {
    try {
      const resp = await pickDocument(true, { type: "*/*" })
      if (!resp.isSuccess) {
        showErrorAlert(resp.error)
        return
      }

      setIsUploading(true);
      uploadMultiple(resp.result, async (urls: string[]) => {
        const newUploadedMediaItems: MediaItem[] = [];
        urls.forEach(url => {
          newUploadedMediaItems.push({
            url: url,
            mimeType: getExtFromUri(url),
            clientId: Number(id),
            localUri: getImageUrl(url),
          })
        })
        setIsUploading(false);
        setUploadedMedia((prevMedia: any) => {
          const updatedMedia = [...prevMedia, ...newUploadedMediaItems];
          return updatedMedia;
        });
      })
    } catch (error: any) {
      showErrorAlert(error?.message)
    }
  };

  const removeMedia = (index: number) => {
    setUploadedMedia((prevMedia) => {
      const updatedMedia = prevMedia.filter((_, i) => i !== index);

      const mediaToRemove = prevMedia[index];
      if (mediaToRemove?.id) {
        setRemovedMediaIds((prevRemovedIds) => [...prevRemovedIds, mediaToRemove.id]);
      }

      return updatedMedia;
    });
  };

  // Upload button component
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
        onPress={pickMedia}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        disabled={isUploading || noteMutation.isPending}>
        <Upload size={18} color="#ffffff" />
      </TouchableOpacity>
    </LinearGradient>
  );

  // Update navigation options
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: isEditMode ? "Edit Note" : "Add Note",
      headerRight: () => <UploadButton />,
    });
  }, [navigation, isUploading, isEditMode]);

  const handleInsertLink = () => {
    if (linkURL.trim() && linkText.trim()) {
      const linkHTML = `<a href="${linkURL}" target="_blank">${linkText}</a>`;
      richText.current?.insertHTML(linkHTML);
      setIsLinkModalVisible(false);
      setLinkURL("");
      setLinkText("");
    } else {
      Alert.alert("Error", "Both URL and text are required");
    }
  };

  // Handle content change in rich text editor
  const handleContentChange = (content) => {
    formik.setFieldValue("notes", content);
  };

  const openLinkModal = () => {
    setIsLinkModalVisible(true);
  };

  const closeLinkModal = () => {
    setIsLinkModalVisible(false);
    setLinkURL("");
    setLinkText("");
  };

  const renderMediaPreview = (media: MediaItem, index: number) => {
    const previewSource = getMediaPreview(media.mimeType, media.localUri || media.url);
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
        <TouchableOpacity
          className="bg-red flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10"
          onPress={() => removeMedia(index)}
          disabled={isUploading}>
          <Trash2 size={12} color="#ffffff" />
        </TouchableOpacity>

        {isImage ? (
          <Image
            source={{ uri: media.localUri }}
            style={{ width: "100%", height: "100%" }}
            className="rounded-[20px]"
            resizeMode="cover"
          />
        ) : isVideo ? (
          <Video
            source={{ uri: media.localUri }}
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
              source={previewSource}
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <RichToolbar
          editor={richText}
          actions={[
            actions.undo,
            actions.redo,
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.heading1,
            actions.insertBulletsList,
            actions.insertOrderedList,
            "customInsertLink",
            actions.checkboxList,
          ]}
          iconMap={{
            [actions.heading1]: handleHead,
            customInsertLink: () => (
              <TouchableOpacity onPress={openLinkModal}>
                <Text style={{ color: "#000", fontSize: 16 }}>🔗</Text>
              </TouchableOpacity>
            ),

          }}
          onPressAction={(action) => {
            if (action === "customInsertLink") {
              openLinkModal();
            }
          }}
          style={{
            backgroundColor: "#ffffff",
            borderTopColor: "#EDEDED",
            borderBottomColor: "#EDEDED",
            borderWidth: 1,
            borderLeftColor: 0,
            borderRightColor: 0,
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <RichEditor
            ref={richText}
            initialHeight={45}
            initialContentHTML={
              isEditMode && parsedNoteDetails ? parsedNoteDetails.notes : ""
            }
            editorStyle={{
              color: "#4A4A4A",
              placeholderColor: "#1C1C1C",
              backgroundColor: "#ffffff",
              cssText: `
                                body {
                                    font-size: 16px;
                                    padding: 3px;
                                }
                            `,
            }}
            placeholder="Start typing here..."
            onChange={handleContentChange}
          />
          {formik.touched.notes && formik.errors.notes && (
            <Text className="text-red-500 px-4 mt-1">
              {formik.errors.notes}
            </Text>
          )}
        </KeyboardAvoidingView>

        <View className="p-4">
          <View className="flex flex-row flex-wrap">
            {uploadedMedia.map(renderMediaPreview)}
          </View>
        </View>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton
          title={isEditMode ? "Update Note" : "Add Note"}
          onPress={formik.handleSubmit}
          disabled={isUploading}
        />
      </View>
      <InsertLinkModal
        visible={isLinkModalVisible}
        onClose={closeLinkModal}
        onInsert={handleInsertLink}
        linkURL={linkURL}
        setLinkURL={setLinkURL}
        linkText={linkText}
        setLinkText={setLinkText}
      />
    </SafeAreaView>
  );
};

export default AddNote;
