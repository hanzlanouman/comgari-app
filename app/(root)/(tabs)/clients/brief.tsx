import React from "react";
import {
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const Brief = () => {
  const richText = React.useRef();

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          actions.insertImage,
          actions.insertVideo,
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
      />
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <RichEditor
            ref={richText}
            editorStyle={{
              color: "#4A4A4A",
            }}
            initialContentHTML="Hi, Please fill out the brief below to help us understand your project better."
            onChange={(descriptionText) => {
              console.log("descriptionText:", descriptionText);
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton title="Update" onPress={() => router.push("/")} />
      </View>
    </SafeAreaView>
  );
};

export default Brief;
