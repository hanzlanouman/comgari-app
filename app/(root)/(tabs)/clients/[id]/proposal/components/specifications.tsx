import React, { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { CustomButton } from "@/common/components";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const Specifications = ({ initialData, onNext, onPrevious }) => {
  const richText = React.useRef();
  const [description, setDescription] = useState(initialData.specification || "");

  const handleSubmit = () => {
    // Optional: Validate description
    if (description.trim()) {
      onNext({ specification: description });
    } else {
      alert("Please enter specifications");
    }
  };

  return (
    <>
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
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <RichEditor
            ref={richText}
            initialHeight={45}
            initialContentHTML={description}
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
            onChange={(descriptionText) => {
              setDescription(descriptionText);
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton
          title="Next"
          onPress={handleSubmit}
        />
      </View>
    </>
  );
};

export default Specifications;

  