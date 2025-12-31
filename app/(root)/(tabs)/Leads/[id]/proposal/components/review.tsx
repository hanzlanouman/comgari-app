import React from "react";
import {
  ScrollView,
  View,
  Text,
} from "react-native";
import { CustomButton } from "@/common/components";
const stripHtmlTags = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, '').replace(/\&nbsp;/g, ' ').trim();
};
const formatToLocalDate = (isoDate: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const Review = ({ formData, onSave }: { formData: any; onSave: () => void }) => {
  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-4">
          <View className="mt-4">
            <Text className="text-lg font-ManropeBold mb-4">Job Details</Text>
            <View className="flex-row mb-2">
              <Text className="font-ManropeSemibold" style={{ width: "33.33%" }}>Date:</Text>
              <Text className="flex-1">{formatToLocalDate(formData.date)}</Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="font-ManropeSemibold" style={{ width: "33.33%" }}>Address:</Text>
              <Text className="flex-1">{formData.address}</Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="font-ManropeSemibold" style={{ width: "33.33%" }}>City:</Text>
              <Text className="flex-1">{formData.city}</Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="font-ManropeSemibold" style={{ width: "33.33%" }}>Zip:</Text>
              <Text className="flex-1">{formData.zip_code}</Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-lg font-ManropeBold mb-4">Specifications</Text>
            <Text className="font-ManropeRegular">
              {stripHtmlTags(formData.specification)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton
          title="Save"
          onPress={onSave}
        />
      </View>
    </>
  );
};

export default Review;