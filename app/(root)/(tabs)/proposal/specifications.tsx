import {
  Platform,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import React from "react";

const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const Specifications = () => {
  const richText = React.useRef();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-gray px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full flex-row items-center justify-center bg-green">
            <Text className="text-sm text-white font-ManropeBold">1</Text>
          </View>
          <Text className="text-sm text-green font-ManropeSemibold ml-2">
            Job details
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full flex-row items-center justify-center bg-blue">
            <Text className="text-sm text-white font-ManropeBold">2</Text>
          </View>
          <Text className="text-sm text-blue font-ManropeSemibold ml-2">
            Specifications
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full flex-row items-center justify-center bg-white">
            <Text className="text-sm text-dark font-ManropeBold">3</Text>
          </View>
          <Text className="text-sm text-dark font-ManropeSemibold ml-2">
            Review
          </Text>
        </View>
      </View>
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
        <CustomButton
          title="Next"
          onPress={() => router.push("/(root)/(tabs)/proposal/review")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Specifications;
