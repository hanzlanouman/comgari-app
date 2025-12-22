import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Upload, Save } from "lucide-react-native";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";

import { AssetPreview, CustomButton, HeaderButton } from "@/common/components";
import { getImageUrl } from "@/constants";
import { ClientRepository } from "@/repositories/client/client";
import { InsertLinkModal } from "../../components/InsertLinkModal";
import { isIos, pickDocument, showErrorAlert } from "@/utils";
import { useUpload } from "@/hooks/use-upload";

export type MediaItem = {
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
const handleHead = ({ tintColor }: { tintColor: string }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const AddNote = () => {
  const richText = useRef<RichEditor>(null);
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");
  const { id, noteDetails } = useLocalSearchParams();
  const projectId = parseInt(id as string);
  const clientRepo = ClientRepository.getInstance();
  const navigation = useNavigation();

  const { uploadAsync } = useUpload();

  const parsedNoteDetails = noteDetails
    ? JSON.parse(noteDetails as string)
    : null;
  const isEditMode = !!parsedNoteDetails;

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
            notes: payload.notes!,
            project_id: payload.project_id!,
          });
        }

        if (payload.media && payload.media.length > 0) {
          await clientRepo.updateClientMedia(Number(id), {
            media: payload.media,
          });
        }
      } else {
        return await clientRepo.createNote({
          notes: payload.notes ?? "",
          project_id: payload.project_id ?? 0,
          client_note_media: payload.client_note_media ?? [],
        });
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      setUploadedMedia(
        parsedNoteDetails?.media && parsedNoteDetails.media.length > 0
          ? parsedNoteDetails.media.map((media: any) => ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, projectId]);

  const formik = useFormik({
    initialValues: {
      notes:
        isEditMode && parsedNoteDetails?.notes
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
              action: "Remove" as const,
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
                action: "Add" as const,
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
            client_note_media: uploadedMedia.map(
              ({ localUri, ...rest }) => rest
            ),
          });
        }

        router.replace(`/clients/${id?.toString()}/notes`);
      } catch (error: any) {
        showErrorAlert(error?.message || "Failed to save note");
      }
    },
  });

  const pickMedia = async () => {
    try {
      const resp = await pickDocument(true, { type: "*/*" });
      if (!resp.isSuccess) {
        showErrorAlert(resp.error);
        return;
      }
      setIsUploading(true);
      const newUploadedMediaItems: MediaItem[] = [];
      for (const file of resp.result) {
        const res = await uploadAsync(file);
        if (res.isSuccess && res.result) {
          newUploadedMediaItems.push({
            url: res.result,
            mimeType: file.type,
            clientId: Number(id),
            localUri: getImageUrl(res.result),
          });
        }
      }
      setUploadedMedia((prevMedia: any) => {
        const updatedMedia = [...prevMedia, ...newUploadedMediaItems];
        return updatedMedia;
      });
      setIsUploading(false);
    } catch (error: any) {
      showErrorAlert(error?.message);
    }
  };

  const removeMedia = (index: number) => {
    setUploadedMedia((prevMedia) => {
      const updatedMedia = prevMedia.filter((_, i) => i !== index);

      const mediaToRemove = prevMedia[index];
      if (mediaToRemove?.id !== undefined) {
        setRemovedMediaIds((prevRemovedIds) => [
          ...prevRemovedIds,
          mediaToRemove.id!,
        ]);
      }

      return updatedMedia;
    });
  };

  // Update navigation options
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: isEditMode ? "Edit Note" : "Add Note",
      headerRight: () => (
        <>
          <HeaderButton
            disabled={isUploading || noteMutation?.isPending}
            onPress={pickMedia}
            icon={<Upload size={18} color="#ffffff" />}
          />
          {isIos() && (
            <HeaderButton
              onPress={() => formik.handleSubmit()}
              disabled={isUploading}
              icon={<Save size={18} color="#ffffff" />}
            />
          )}
        </>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleContentChange = (content: any) => {
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
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
          onPressAction={(action: any) => {
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
            {typeof formik?.errors?.notes === "string"
              ? formik?.errors?.notes
              : formik?.errors?.notes?.toString()}
          </Text>
        )}
        <View className="p-4">
          <View className="flex flex-row flex-wrap">
            {uploadedMedia.map((media, index) => (
              <AssetPreview
                disabled={isUploading}
                index={index}
                media={media}
                removeMedia={() => removeMedia(index)}
                key={index}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View
        className="p-4 bg-white border-t border-light"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 30,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        <CustomButton
          title={isEditMode ? "Update Note" : "Add Note"}
          onPress={() => formik.handleSubmit()}
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
