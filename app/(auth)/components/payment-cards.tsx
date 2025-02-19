import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

interface CardComponentProps {
  onPress: () => void;
  selected: boolean;
  label: string;
  img: React.ReactNode;
}

const CardComponent: React.FC<CardComponentProps> = ({
  onPress,
  selected,
  label,
  img,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="flex-row items-center justify-between bg-white border border-light rounded-xl py-4 px-5 mt-2.5">
      <View className="flex flex-row items-center">
        {img}
        <Text className="text-sm sm:text-base font-ManropeSemibold text-black ml-3">
          {label}
        </Text>
      </View>
      {selected ? (
        <View className="w-5 h-5 rounded-full border border-blue flex flex-row items-center justify-center">
          <View className="w-3 h-3 bg-blue rounded-full" />
        </View>
      ) : (
        <View className="w-5 h-5 rounded-full border border-light" />
      )}
    </TouchableOpacity>
  );
};

export default CardComponent;
