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
          <View className="w-7 h-7 rounded-full flex-row items-center justify-center bg-green">
            <Text className="text-sm text-white font-ManropeBold">2</Text>
          </View>
          <Text className="text-sm text-green font-ManropeSemibold ml-2">
            Specifications
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full flex-row items-center justify-center bg-blue">
            <Text className="text-sm text-white font-ManropeBold">3</Text>
          </View>
          <Text className="text-sm text-blue font-ManropeSemibold ml-2">
            Review
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-4">
          <View className="flex-row items-start mt-4">
            <View className="w-1 h-1 rounded-full bg-dark relative top-2" />
            <Text className="text-sm sm:text-base text-dark font-ManropeRegular flex-1 pl-3">
              Al material is guaranteed to be as specified. Al work shall be
              completed in a workmanlike manner according to standard practices.{" "}
            </Text>
          </View>
          <View className="flex-row items-start mt-4">
            <View className="w-1 h-1 rounded-full bg-dark relative top-2" />
            <Text className="text-sm sm:text-base text-dark font-ManropeRegular flex-1 pl-3">
              Al material is guaranteed to be as specified. Al work shall be
              completed in a workmanlike manner according to standard practices.{" "}
            </Text>
          </View>
          <Text className="text-sm sm:text-base text-dark font-ManropeRegular mt-4">
            Al material is guaranteed to be as specified. Al work shall be
            completed in a workmanlike manner according to standard practices.{" "}
          </Text>
          <View className="flex-row items-start mt-4">
            <View className="w-1 h-1 rounded-full bg-dark relative top-2" />
            <Text className="text-sm sm:text-base text-dark font-ManropeRegular flex-1 pl-3">
              Al material is guaranteed to be as specified. Al work shall be
              completed in a workmanlike manner according to standard practices.{" "}
            </Text>
          </View>
          <View className="flex-row items-start mt-4">
            <View className="w-1 h-1 rounded-full bg-dark relative top-2" />
            <Text className="text-sm sm:text-base text-dark font-ManropeRegular flex-1 pl-3">
              Al material is guaranteed to be as specified. Al work shall be
              completed in a workmanlike manner according to standard practices.{" "}
            </Text>
          </View>
          <View className="flex-row items-start mt-4">
            <View className="w-1 h-1 rounded-full bg-dark relative top-2" />
            <Text className="text-sm sm:text-base text-dark font-ManropeRegular flex-1 pl-3">
              Al material is guaranteed to be as specified. Al work shall be
              completed in a workmanlike manner according to standard practices.{" "}
            </Text>
          </View>
          <View className="flex-row items-start mt-4">
            <View className="w-1 h-1 rounded-full bg-dark relative top-2" />
            <Text className="text-sm sm:text-base text-dark font-ManropeRegular flex-1 pl-3">
              Al material is guaranteed to be as specified. Al work shall be
              completed in a workmanlike manner according to standard practices.{" "}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton title="Save" onPress={() => router.push("/")} />
      </View>
    </SafeAreaView>
  );
};

export default Specifications;
