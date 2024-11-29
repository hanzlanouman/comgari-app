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
import { Video } from 'expo-av';
import {
    actions,
    RichEditor,
    RichToolbar,
} from "react-native-pell-rich-editor";
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Upload, Trash2 } from "lucide-react-native";
import { useFormik } from 'formik';
import { useMutation } from 'react-query';

// Import necessary constants and types
import { CustomButton } from "@/common/components";
import { images, getImageUrl } from "@/constants";
import { ClientRepository } from "@/repositories/client/client";

// Constants for file validation
const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "application/pdf",
    "text/plain",
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.pdf', '.txt'];

// Type definitions
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
    action: 'Add' | 'Remove';
};

// Custom header rendering for RichToolbar
const handleHead = ({ tintColor }) => (
    <Text style={{ color: tintColor }}>H1</Text>
);
const getMediaPreview = (mimeType: string, url: string) => {
    switch (true) {
        case mimeType.includes('pdf'):
            return images.pdf;
        case mimeType.includes('text'):
            return images.doc;
        case mimeType.includes('video'):
            return { uri: url };
        default:
            return { uri: getImageUrl(url) };
    }
};
const AddNote = () => {
    // Refs and state management
    const richText = useRef();
    const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
    const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Route and navigation parameters
    const { id, noteId, noteDetails } = useLocalSearchParams();
    const projectId = parseInt(id as string);
    const clientRepo = ClientRepository.getInstance();
    const navigation = useNavigation();

    // Parse note details for edit mode
    const parsedNoteDetails = noteDetails ? JSON.parse(noteDetails as string) : null;
    const isEditMode = !!parsedNoteDetails;

    // Dimensions for image layout
    const windowWidth = Dimensions.get("window").width;
    const spacingBetweenImages = 16;
    const sidePadding = 16;
    const imageWidth = (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

    // Media upload mutation
    const uploadMediaMutation = useMutation({
        mutationFn: async (file: { uri: string; type: string; fileName?: string }) => {
            const formData = new FormData();
            const fileToUpload = {
                uri: file.uri,
                type: file.type || 'image/jpeg',
                name: file.fileName || 'file.jpg',
            } as any;
            formData.append('files', fileToUpload);
            console.log("form data ", fileToUpload);
            const response = await clientRepo.uploadMedia(formData);
            return {
                url: response.data[0].filename,
                mimeType: file.type || 'image/jpeg',
                localUri: file.uri
            };
        }
    });
    const pickMedia = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                multiple: true,
            });

            if (result.canceled) {
                return;
            }

            const validFiles = result.assets || [];

            const filteredFiles = validFiles.filter((file) => {
                const mimeTypeAllowed = ALLOWED_TYPES.includes(file.mimeType || "");
                const extensionAllowed = ALLOWED_EXTENSIONS.some((ext) =>
                    file.name.toLowerCase().endsWith(ext)
                );
                return mimeTypeAllowed || extensionAllowed;
            });

            if (filteredFiles.length === 0) {
                Alert.alert('Invalid File', 'Only images, videos, PDFs, and text files are allowed.');
                return;
            }

            setIsUploading(true);

            const newUploadedMediaItems: MediaItem[] = [];
            for (const file of filteredFiles) {
                try {
                    const uploadResult = await uploadMediaMutation.mutateAsync({
                        uri: file.name,
                        type: file.mimeType || 'application/octet-stream',
                        fileName: file.name,
                    });

                    const mediaItem: MediaItem = {
                        url: uploadResult.url,
                        mimeType: uploadResult.mimeType,
                        clientId: Number(id),
                        // ownerId: Number(parsedNoteDetails.id),
                        // ownerType: 'note',
                        localUri: file.name
                    };

                    newUploadedMediaItems.push(mediaItem);
                } catch (error: any) {
                    console.log(error)
                    Alert.alert('Error', `Failed to upload media: ${error.message}`);
                }
            }

            console.log('New uploaded media items:', newUploadedMediaItems);

            // Update state with new media items
            setUploadedMedia(prevMedia => {
                const updatedMedia = [...prevMedia, ...newUploadedMediaItems];
                console.log('Updated media state:', updatedMedia);
                return updatedMedia;
            });
        } catch (error: any) {
            Alert.alert('Error', 'Failed to pick media');
        } finally {
            setIsUploading(false);
        }
    };
    // Note and media mutation
    const noteMutation = useMutation({
        mutationFn: async (payload: {
            notes?: string;
            project_id?: number;
            client_note_media?: Omit<MediaItem, 'localUri'>[];
            media?: MediaUpdatePayload[];
        }) => {
            if (isEditMode) {
                console.log("editing payload is", payload)
                // Update notes
                if (payload.notes || payload.project_id) {
                    await clientRepo.updateNote(parsedNoteDetails.id, {
                        notes: payload.notes,
                        project_id: payload.project_id
                    });
                }

                // Update media if payload exists
                if (payload.media && payload.media.length > 0) {
                    await clientRepo.updateClientMedia(Number(id), {
                        media: payload.media
                    });
                }
            } else {
                // Create new note with media
                return await clientRepo.createNote({
                    notes: payload.notes,
                    project_id: payload.project_id,
                    client_note_media: payload.client_note_media
                });
            }
        }
    });

    useEffect(() => {
        if (isEditMode && parsedNoteDetails?.media) {
            const initialMedia = parsedNoteDetails.media.map(media => ({
                id: media.id,
                url: media.url,
                mimeType: media.mimeType,
                localUri: getImageUrl(media.url),
                clientId: projectId,
                ownerId: media.ownerId,
                ownerType: media.ownerType,
            }));

            // Use a functional update with a stable reference
            setUploadedMedia(prevMedia => {
                // Only update if the initial media is different
                const shouldUpdate = initialMedia.length !== prevMedia.filter(media => media.id).length;
                return shouldUpdate
                    ? [
                        ...initialMedia,
                        ...prevMedia.filter(media => !media.id)
                    ]
                    : prevMedia;
            });
        }
    }, [isEditMode, parsedNoteDetails?.media, projectId]);

    // Formik form management
    const formik = useFormik({
        initialValues: {
            notes: isEditMode ?
                parsedNoteDetails.notes.replace(/<[^>]*>/g, '') :
                '',
            project_id: projectId,
        },
        onSubmit: async (values) => {
            try {
                if (isEditMode) {
                    // Prepare media updates
                    const mediaUpdates: MediaUpdatePayload[] = [
                        // Removed media
                        ...Array.from(new Set(removedMediaIds)).map(mediaId => ({
                            prev_media_id: mediaId,
                            client_id: projectId,
                            owner_type: 'note',
                            owner_id: parsedNoteDetails.id,
                            action: 'Remove' as const
                        })),

                        ...uploadedMedia
                            .filter(media => !media.id)
                            .map((media) => ({
                                client_id: projectId,
                                owner_type: 'note',
                                owner_id: parsedNoteDetails.id,
                                new_url: media.url,
                                mimeType: media.mimeType,
                                action: 'Add' as const
                            }))
                    ];

                    // Log the mediaUpdates to verify
                    console.log('Media Updates:', mediaUpdates);

                    // Update notes and media
                    await noteMutation.mutateAsync({
                        notes: values.notes,
                        project_id: values.project_id,
                        media: mediaUpdates.length > 0 ? mediaUpdates : undefined
                    });
                } else {
                    // Create new note with media
                    await noteMutation.mutateAsync({
                        notes: values.notes,
                        project_id: values.project_id,
                        client_note_media: uploadedMedia.map(({ localUri, ...rest }) => rest)
                    });
                }

                Alert.alert(
                    'Success',
                    isEditMode ? 'Note updated successfully' : 'Note created successfully'
                );
                router.push(`/clients/${id.toString()}/notes`);
            } catch (error) {
                Alert.alert('Error', error.message || 'Failed to save note');
            }
        },
    });



    const removeMedia = (index: number) => {
        const mediaToRemove = uploadedMedia[index];

        // If the media has an existing ID, track it for removal
        if (mediaToRemove.id) {
            setRemovedMediaIds(prev => [...prev, mediaToRemove.id]);
        }

        // Remove the media from the uploaded media list
        setUploadedMedia(prev => prev.filter((_, i) => i !== index));
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
            end={[1, 1]}
        >
            <TouchableOpacity
                onPress={pickMedia}
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                disabled={isUploading || noteMutation.isPending}
            >
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
    }, [navigation, isUploading, noteMutation.isPending]);

    // Handle content change in rich text editor
    const handleContentChange = (content) => {
        formik.setFieldValue('notes', content);
    };
    const renderMediaPreview = (media: MediaItem, index: number) => {
        const previewSource = getMediaPreview(media.mimeType, media.url);

        return (
            <View
                key={index}
                style={{
                    width: imageWidth,
                    height: imageWidth,
                    marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
                    marginBottom: spacingBetweenImages,
                }}
                className="relative"
            >
                <TouchableOpacity
                    className="bg-red-500 flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10"
                    onPress={() => removeMedia(index)}
                    disabled={isUploading}
                >
                    <Trash2 size={12} color="#ffffff" />
                </TouchableOpacity>

                {media.mimeType.includes('video') ? (
                    <Video
                        source={{ uri: media.localUri }}
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-[20px]"
                        resizeMode="cover"
                        shouldPlay={false}
                    />
                ) : (
                    <Image
                        source={previewSource}
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-[20px]"
                        resizeMode="cover"
                    />
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
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.heading1,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        actions.insertLink,
                        actions.keyboard,
                        actions.setStrikethrough,
                        actions.removeFormat,
                        actions.checkboxList,
                        actions.undo,
                        actions.redo,
                    ]}
                    iconMap={{
                        [actions.heading1]: handleHead,
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
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <RichEditor
                        ref={richText}
                        initialHeight={45}
                        initialContentHTML={isEditMode && parsedNoteDetails ? parsedNoteDetails.notes : ''}
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
                        <Text className="text-red-500 px-4 mt-1">{formik.errors.notes}</Text>
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
        </SafeAreaView>
    );
};

export default AddNote;