//app\(root)\(tabs)\clients\[id]\notes\add-note.tsx
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
import {
    actions,
    RichEditor,
    RichToolbar,
} from "react-native-pell-rich-editor";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from "@/common/components";
import { images, getImageUrl } from "@/constants";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Upload, Trash2 } from "lucide-react-native";
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { ClientRepository } from "@/repositories/client/client";

// Types for media handling
type UploadedMedia = {
    url: string;
    mimeType: string;
    localUri: string; // Keep local URI for display
    clientId: number;
    ownerId: number;
    ownerType: string;
};

const handleHead = ({ tintColor }) => (
    <Text style={{ color: tintColor }}>H1</Text>
);

const AddNote = () => {
    const richText = useRef();
    const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const { id, noteId, noteDetails } = useLocalSearchParams();
    const projectId = parseInt(id);
    const clientRepo = ClientRepository.getInstance();
    const navigation = useNavigation();
    // Parse noteDetails if provided
    const parsedNoteDetails = noteDetails ? JSON.parse(noteDetails as string) : null;
    // console.log("parsedNoteDetails", parsedNoteDetails)
    const isEditMode = !!parsedNoteDetails;
    const windowWidth = Dimensions.get("window").width;
    const spacingBetweenImages = 16;
    const sidePadding = 16;
    const imageWidth = (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

    useEffect(() => {
        if (isEditMode && parsedNoteDetails.media && uploadedMedia.length === 0) {
            setUploadedMedia(parsedNoteDetails.media.map(media => ({
                url: media.url,
                mimeType: media.mimeType,
                localUri: getImageUrl(media.url),
                clientId: projectId,
                ownerId: media.ownerId,
                ownerType: media.ownerType,
            })));
        }
    }, [isEditMode, parsedNoteDetails, projectId, uploadedMedia.length]);
    

    const uploadMediaMutation = useMutation({
        mutationFn: async (file: { uri: string; type: string; fileName?: string }) => {
            const formData = new FormData();
            const fileToUpload = {
                uri: file.uri,
                type: file.type || 'image/jpeg',
                name: file.fileName || 'file.jpg',
            } as any;
            formData.append('files', fileToUpload);

            const response = await clientRepo.uploadMedia(formData);
            return {
                url: response.data[0].filename,
                mimeType: file.type || 'image/jpeg',
                localUri: file.uri
            };
        }
    });

    const noteMutation = useMutation({
        mutationFn: async (payload: {
            notes: string;
            project_id: number;
            client_note_media: Omit<UploadedMedia, 'localUri'>[];
        }) => {
            return isEditMode
                ? await clientRepo.updateNote(parsedNoteDetails.id, payload)
                : await clientRepo.createNote(payload);
        }
    });

    const formik = useFormik({
        initialValues: {
            notes: isEditMode ? 
        parsedNoteDetails.notes.replace(/<[^>]*>/g, '') : 
        '',
            project_id: projectId,
        },
        onSubmit: async (values) => {
            try {
                const notePayload = {
                    notes: values.notes,
                    project_id: values.project_id,
                    client_note_media: uploadedMedia.map(({ localUri, ...rest }) => rest)
                };

                await noteMutation.mutateAsync(notePayload);

                Alert.alert(
                    'Success',
                    isEditMode ? 'Note updated successfully' : 'Note created successfully'
                );
                router.push('/');
            } catch (error) {
                Alert.alert('Error', error.message || 'Failed to save note');
            }
        },
    });

    const isLoading = noteMutation.isPending || isUploading;

    const pickMedia = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsMultipleSelection: true,
                quality: 1,
            });

            if (!result.canceled && result.assets) {
                setIsUploading(true);

                // Upload each media file as it's picked
                for (const asset of result.assets) {
                    try {
                        const uploadResult = await uploadMediaMutation.mutateAsync({
                            uri: asset.uri,
                            type: asset.type === 'image' ? 'image/jpeg' : 'video/mp4',
                            fileName: asset.uri.split('/').pop(),
                        });

                        setUploadedMedia(prev => [...prev, {
                            ...uploadResult,
                            clientId: projectId,
                            ownerId: 1,
                            ownerType: 'user'
                        }]);
                    } catch (error) {
                        Alert.alert('Error', `Failed to upload media: ${error.message}`);
                    }
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick media');
        } finally {
            setIsUploading(false);
        }
    };

    const removeMedia = (index: number) => {
        setUploadedMedia(prev => prev.filter((_, i) => i !== index));
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
                onPress={pickMedia}
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                disabled={isLoading}
            >
                <Upload size={18} color="#ffffff" />
            </TouchableOpacity>
        </LinearGradient>
    );

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: isEditMode ? "Edit Note" : "Add Note",
            headerRight: () => <UploadButton />,
        });
    }, [navigation, isLoading]);

    const handleContentChange = (content) => {
        formik.setFieldValue('notes', content);
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
                        initialContents={isEditMode && parsedNoteDetails ? parsedNoteDetails.notes : ''}
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
                        {uploadedMedia.map((media, index) => (
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
                                    disabled={isLoading}
                                >
                                    <Trash2 size={12} color="#ffffff" />
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: media.localUri }}
                                    style={{ width: "100%", height: "100%" }}
                                    className="rounded-[20px]"
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <View className="p-4 bg-white">
                <CustomButton
                    title={isLoading ? "Saving" : (isEditMode ? "Update Note" : "Add Note")}
                    onPress={formik.handleSubmit}
                    disabled={isLoading}
                />
            </View>
        </SafeAreaView>
    );
};

export default AddNote;