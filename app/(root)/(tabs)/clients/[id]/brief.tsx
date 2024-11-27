import React, { useState, useRef, useEffect } from "react";
import {
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
    Alert,
    ActivityIndicator,
} from "react-native";
import {
    actions,
    RichEditor,
    RichToolbar,
} from "react-native-pell-rich-editor";
import { CustomButton } from "@/common/components";
import { router, useLocalSearchParams } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";

const handleHead = ({ tintColor }) => (
    <Text style={{ color: tintColor }}>H1</Text>
);

const Brief = () => {
    const { id } = useLocalSearchParams(); // Get client ID from route
    const richText = useRef(null);

    // State management
    const [content, setContent] = useState<string>('');
    const [initialContent, setInitialContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMutating, setIsMutating] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
    const clientRepo = ClientRepository.getInstance();

    // Fetch brief on component mount
    useEffect(() => {
        const fetchBrief = async () => {
            if (!id) {
                // No client ID provided, cannot fetch brief
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);

                const response = await clientRepo.getBrief(Number(id));
                console.log("brief respnose", response)
                // Check if brief exists and is not empty
                if (response.brief) {
                    // Strip HTML tags to get plain text, but preserve HTML content
                    const briefText = response.brief;
                    const plainText = briefText.replace(/<[^>]+>/g, '');
                    
                    // Set content to full HTML content
                    setContent(briefText);
                    setInitialContent(plainText);
                    
                    // Switch to update mode when brief exists
                    setIsCreateMode(false);
                } else {
                    // No existing brief, remain in create mode
                    setContent('');
                    setInitialContent(null);
                    setIsCreateMode(true);
                }
            } catch (error) {
                // Handle error - potentially log or show a specific error message
                Alert.alert('Error Fetching Brief', error.message || 'Unable to fetch brief');
                setContent('');
                setInitialContent(null);
                setIsCreateMode(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBrief();
    }, [id]);

    // Handle Save Action
    const handleSave = async () => {
        // Prepare payload
        const payload = {
            brief: content || '',
            client_id: Number(id)
        };

        try {
            setIsMutating(true);

            // Validate content
            if (content.trim() === '') {
                Alert.alert('Error', 'Brief cannot be empty');
                return;
            }

            // Perform create or update based on mode
            if (isCreateMode) {
                await clientRepo.createBrief(payload);
            } else {
                console.log("brief update payload", payload)
                await clientRepo.updateBrief(Number(id), payload);
            }

            // Update state and show success
            setInitialContent(content);
            setIsCreateMode(false);
            Alert.alert('Success', 'Brief saved successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsMutating(false);
        }
    };

    // Handle Content Change
    const handleContentChange = (descriptionText: string) => {
        setContent(descriptionText);
    };

    // Loading state
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Mutating state
    if (isMutating) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Saving brief...</Text>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
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
                        initialContentHTML={content}
                        placeholder="Start typing here..."
                        onChange={handleContentChange}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
            <View className="p-4 bg-white flex-row gap-2">
                <View className="flex-1">
                    <CustomButton
                        title={isCreateMode ? "Create" : "Update"}
                        onPress={handleSave}
                        disabled={isMutating}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Brief;