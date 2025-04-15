import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Keyboard,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { CustomButton, HeaderButton } from "@/common/components";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import { InsertLinkModal } from "../components/InsertLinkModal";
import { Save } from "lucide-react-native";
import { isAndroid } from "@/utils";

const handleHead = ({ tintColor }: { tintColor: string }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const Brief = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const richText = useRef(null);

  const [content, setContent] = useState<string>("");
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");

  const clientRepo = ClientRepository.getInstance();

  useEffect(() => {
    if (isAndroid()) return;
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          onPress={handleSave}
          disabled={isMutating}
          icon={<Save size={18} color="#ffffff" />}
        />
      ),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, isMutating]);

  useEffect(() => {
    const fetchBrief = async () => {
      if (!id) {
        return;
      }

      try {
        const response = await clientRepo.getBrief(Number(id));
        console.log(response, "Brief");

        if (response && (response as any).brief) {
          const briefContent = (response as any).brief;
          setContent(briefContent);
          setIsCreateMode(false);
          
          setTimeout(() => {
            richText.current?.setContentHTML(briefContent);
          }, 100);
        } else {
          setContent("");
          setIsCreateMode(true);
        }
      } catch (error: any) {
        Alert.alert(
          "Error Fetching Brief",
          error?.message || "Unable to fetch brief"
        );
        setContent("");
        setIsCreateMode(true);
      }
    };

    fetchBrief();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } else {
        await clientRepo.createBrief(payload); 
      }

      router.push(`/(root)/(tabs)/clients/${id}`);
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

  return (
    <SafeAreaView className="flex-1 bg-white">
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
        onPressAction={(action : any) => {
          if (action === "customInsertLink") {
            openLinkModal();
          }
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <RichEditor
          ref={richText}
          initialHeight={45}
          editorStyle={{
            color: "#4A4A4A",
            placeholderColor: "#1C1C1C",
            backgroundColor: "#ffffff",
            pasteAsPlainText: true
          }}
          initialContentHTML={content} 
          placeholder="Start typing here..."
          onChange={handleContentChange}
          onBlur={() => Keyboard.dismiss()}
          pasteAsPlainText={true}
          useContainer={true}
        />
      </ScrollView>
      {isAndroid() && (
        <View className="p-4 bg-white">
          <CustomButton
            title={isCreateMode ? "Create" : "Update"}
            onPress={handleSave}
            disabled={isMutating}
          />
        </View>
      )}
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

export default Brief;