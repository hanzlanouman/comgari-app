import React from "react";
import {
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  View,
} from "react-native";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const Brief = () => {
  const _editor = React.createRef();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="-ml-px border-0"
      >
        <QuillToolbar
          editor={_editor}
          options="full"
          theme="dark"
          className="border-0"
        />
      </KeyboardAvoidingView>
      <QuillEditor
        ref={_editor}
        initialHtml="<h3>Tell about yourself</h3>"
        className="flex-1"
      />
      <View className="p-4 bg-white">
        <CustomButton title="Update" onPress={() => router.push("/")} />
      </View>
    </SafeAreaView>
  );
};

export default Brief;
