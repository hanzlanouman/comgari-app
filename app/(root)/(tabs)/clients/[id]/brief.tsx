import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { CustomButton } from "@/common/components";
import { router, useLocalSearchParams } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import { InsertLinkModal}  from "../components/InsertLinkModal";

const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const Brief = () => {
  const { id } = useLocalSearchParams();
  const richText = useRef(null);

  const [content, setContent] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");

  const clientRepo = ClientRepository.getInstance();

  useEffect(() => {
    const fetchBrief = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await clientRepo.getBrief(Number(id));

        if (response.brief) {
          const briefText = response.brief;
          const plainText = briefText.replace(/<[^>]+>/g, "");
          console.log("this",plainText)
          setContent(briefText);
          setInitialContent(plainText);

          setIsCreateMode(false);
        } else {
          setContent("");
          setInitialContent(null);
          setIsCreateMode(true);
        }
      } catch (error) {
        Alert.alert(
          "Error Fetching Brief",
          error.message || "Unable to fetch brief"
        );
        setContent("");
        setInitialContent(null);
        setIsCreateMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrief();
  }, [id]);

  const handleSave = async () => {
    const payload = {
      brief: content || "",
      client_id: Number(id),
    };

    try {
      setIsMutating(true);

      if (content.trim() === "") {
        Alert.alert("Error", "Brief cannot be empty");
        return;
      }

      if (isCreateMode) {
        await clientRepo.createBrief(payload);
        router.push(`/(root)/(tabs)/clients/${id}`);
      } else {
        console.log("brief update payload", payload);
        await clientRepo.createBrief(payload);
        router.push(`/(root)/(tabs)/clients/${id}`);
      }

      setInitialContent(content);
      setIsCreateMode(false);
      Alert.alert("Success", "Brief saved successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsMutating(false);
    }
  };

  const handleContentChange = (descriptionText: string) => {
    setContent(descriptionText);
  };

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

  const openLinkModal = () => {
    setIsLinkModalVisible(true);
  };

  const closeLinkModal = () => {
    setIsLinkModalVisible(false);
    setLinkURL("");
    setLinkText("");
  };

  // if (isLoading) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  // if (isMutating) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <Text>Saving brief...</Text>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
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
            }}
            initialContentHTML={content}
            placeholder="Start typing here..."
            onChange={handleContentChange}
            onBlur={() => Keyboard.dismiss()}
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
            <InsertLinkModal
        visible={isLinkModalVisible}
        onClose={closeLinkModal}
        onInsert={handleInsertLink}
        linkURL={linkURL}
        setLinkURL={setLinkURL}
        linkText={linkText}
        setLinkText={setLinkText}
      />
    </SafeAreaView></TouchableWithoutFeedback>

  );
};

export default Brief;
