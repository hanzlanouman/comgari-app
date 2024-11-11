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
            placeholder="Start typing here..."
            // initialContentHTML="I’m so exited for you to be joining us here at Comgari."
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
