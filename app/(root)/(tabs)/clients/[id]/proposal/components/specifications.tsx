import React, { useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { CustomButton, HeaderButton } from "@/common/components";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { isAndroid } from "@/utils";
import { useNavigation } from "expo-router";
import { ArrowRight } from "lucide-react-native";

const handleHead = ({ tintColor }: { tintColor: string }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const Specifications = ({ initialData, onNext, onPrevious, currentStep }) => {
  const navigation = useNavigation();
  const richText = React.useRef<any>(null);
  const descriptionRef = React.useRef<string>(initialData.specification || "");

  const handleSubmit = () => {
    if (
      descriptionRef.current &&
      descriptionRef.current.trim() &&
      descriptionRef.current !== "<p></p>" &&
      descriptionRef.current !== "<br>"
    ) {
      onNext({ specification: descriptionRef.current });
    } else {
      alert("Please enter specifications");
    }
  };

  useEffect(() => {
    if (isAndroid() || currentStep !== 2)
      navigation.setOptions({
        headerRight: () => <></>,
      });
    else
      navigation.setOptions({
        headerRight: () => (
          <HeaderButton
            onPress={handleSubmit}
            disabled={false}
            icon={<ArrowRight size={18} color="#ffffff" />}
          />
        ),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, currentStep]);

  if (currentStep !== 2) return <></>;

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
        <RichEditor
          ref={richText}
          initialHeight={45}
          initialContentHTML={descriptionRef.current}
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
            descriptionRef.current = descriptionText;
          }}
          pasteAsPlainText={true}
          useContainer={true}
        />
      </ScrollView>
      {isAndroid() && (
        <View className="p-4 bg-white">
          <CustomButton title="Next" onPress={handleSubmit} />
        </View>
      )}
    </>
  );
};

export default Specifications;
