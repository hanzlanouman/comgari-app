import React from "react";
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
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { images } from "@/constants";
import { Trash2 } from "lucide-react-native";

const handleHead = ({ tintColor }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const CreateNote = () => {
  const richText = React.useRef();

  const windowWidth = Dimensions.get("window").width;
  const sidePadding = 32;
  const spacingBetweenImages = 12;
  const imageWidth = (windowWidth - sidePadding - spacingBetweenImages * 2) / 3;

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
            // initialContentHTML="I’m so exited for you to be joining us here at Comgari."
            onChange={(descriptionText) => {
              console.log("descriptionText:", descriptionText);
            }}
          />
        </KeyboardAvoidingView>
        <View className="p-4">
          {/* Row 1 */}
          <View className="flex flex-row mb-4">
            <View
              style={{
                width: imageWidth,
                height: imageWidth,
                marginRight: spacingBetweenImages,
              }}
              className="relative"
            >
              <TouchableOpacity className="bg-red flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10">
                <Trash2 size={12} color="#ffffff" />
              </TouchableOpacity>
              <Image
                source={images.user}
                style={{ width: imageWidth, height: imageWidth }}
                className="rounded-[20px]"
                resizeMode="cover"
              />
            </View>
            <View
              style={{
                width: imageWidth,
                height: imageWidth,
                marginRight: spacingBetweenImages,
              }}
              className="relative"
            >
              <TouchableOpacity className="bg-red flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10">
                <Trash2 size={12} color="#ffffff" />
              </TouchableOpacity>
              <Image
                source={images.user}
                style={{ width: imageWidth, height: imageWidth }}
                className="rounded-[20px]"
                resizeMode="cover"
              />
            </View>
            <View
              style={{ width: imageWidth, height: imageWidth }}
              className="relative"
            >
              <TouchableOpacity className="bg-red flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10">
                <Trash2 size={12} color="#ffffff" />
              </TouchableOpacity>
              <Image
                source={images.user}
                style={{ width: imageWidth, height: imageWidth }}
                className="rounded-[20px]"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Row 2 */}
          <View className="flex flex-row mb-4">
            <View
              style={{
                width: imageWidth,
                height: imageWidth,
                marginRight: spacingBetweenImages,
              }}
              className="relative"
            >
              <TouchableOpacity className="bg-red flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10">
                <Trash2 size={12} color="#ffffff" />
              </TouchableOpacity>
              <Image
                source={images.pdf}
                style={{ width: imageWidth, height: imageWidth }}
                className="rounded-[20px]"
                resizeMode="cover"
              />
            </View>
            <View
              style={{
                width: imageWidth,
                height: imageWidth,
                marginRight: spacingBetweenImages,
              }}
              className="relative"
            >
              <TouchableOpacity className="bg-red flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10">
                <Trash2 size={12} color="#ffffff" />
              </TouchableOpacity>
              <Image
                source={images.doc}
                style={{ width: imageWidth, height: imageWidth }}
                className="rounded-[20px]"
                resizeMode="cover"
              />
            </View>
            <View
              style={{ width: imageWidth, height: imageWidth }}
              className="relative"
            >
              <TouchableOpacity className="bg-red flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10">
                <Trash2 size={12} color="#ffffff" />
              </TouchableOpacity>
              <Image
                source={images.pdf}
                style={{ width: imageWidth, height: imageWidth }}
                className="rounded-[20px]"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton title="Add Note" onPress={() => router.push("/")} />
      </View>
    </SafeAreaView>
  );
};

export default CreateNote;
