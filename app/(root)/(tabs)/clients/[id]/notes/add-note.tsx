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
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Upload, Trash2 } from "lucide-react-native";
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { ClientRepository } from "@/repositories/client/client";
import { createNoteSchema, mediaSchema } from '@/repositories/client/schemas';

// Types based on the schema definitions
type MediaDTO = {
    url: string;
    mimeType: string;
    clientId: number;
    ownerId: number;
    ownerType: string;
};

type CreateNoteDTO = {
    notes: string;
    project_id: number;
    client_note_media: MediaDTO[];
};

type MediaFile = {
    uri: string;
    type: string;
    fileName?: string;
    mimeType?: string;
};

const handleHead = ({ tintColor }) => (
    <Text style={{ color: tintColor }}>H1</Text>
);

const AddNote = () => {
    const richText = useRef();
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const { id, clientId } = useLocalSearchParams();
    const projectId = parseInt(id);
    const parsedClientId = parseInt(clientId as string);
    const clientRepo = ClientRepository.getInstance();
    const navigation = useNavigation();

    const windowWidth = Dimensions.get("window").width;
    const spacingBetweenImages = 16;
    const sidePadding = 16;
    const imageWidth = (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

    // React Query mutations
    const uploadMediaMutation = useMutation({
        mutationFn: async (file: MediaFile) => {
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
                mimeType: file.type || 'image/jpeg'
            };
        }
    });

    const createNoteMutation = useMutation({
        mutationFn: async (payload: CreateNoteDTO) => {
            return await clientRepo.createNote(payload);
        }
    });

    const formik = useFormik({
        initialValues: {
            notes: '',
            project_id: projectId,
            client_note_media: [] as MediaDTO[],
        },
        validationSchema: createNoteSchema,
        onSubmit: async (values) => {
            try {
                // First upload all media files if any
                if (mediaFiles.length > 0) {
                    const uploadPromises = mediaFiles.map(file => 
                        uploadMediaMutation.mutateAsync(file)
                    );
                    
                    const uploadedFiles = await Promise.all(uploadPromises);
                    
                    // Create note with the uploaded media
                    const noteResponse = await createNoteMutation.mutateAsync({
                        notes: values.notes,
                        project_id: values.project_id,
                        client_note_media: uploadedFiles.map(file => ({
                            url: file.url,
                            mimeType: file.mimeType,
                            clientId: parsedClientId,
                            ownerId: projectId,
                            ownerType: 'note'
                        }))
                    });

                    Alert.alert('Success', 'Note created successfully');
                    router.push('/');
                } else {
                    // Create note without media
                    await createNoteMutation.mutateAsync({
                        notes: values.notes,
                        project_id: values.project_id,
                        client_note_media: [] // Empty array for no media
                    });

                    Alert.alert('Success', 'Note created successfully');
                    router.push('/');
                }
            } catch (error) {
                Alert.alert('Error', error.message || 'Failed to create note');
            }
        },
    });

    const isLoading =
        createNoteMutation.isPending ||
        uploadMediaMutation.isPending;

    const pickMedia = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsMultipleSelection: true,
                quality: 1,
            });

            if (!result.canceled && result.assets) {
                const newMediaFiles = result.assets.map(asset => ({
                    uri: asset.uri,
                    type: asset.type === 'image' ? 'image/jpeg' : 'video/mp4',
                    fileName: asset.uri.split('/').pop(),
                    mimeType: asset.mimeType
                }));

                setMediaFiles(prev => [...prev, ...newMediaFiles]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick media');
        }
    };

    const removeMedia = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
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
            title: "Add Note",
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
                        {mediaFiles.map((file, index) => (
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
                                    source={{ uri: file.uri }}
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
                    title={isLoading ? "Creating" : "Add Note"}
                    onPress={formik.handleSubmit}
                    disabled={isLoading}
                />
            </View>
        </SafeAreaView>
    );
};

export default AddNote;