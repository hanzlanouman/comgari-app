/* eslint-disable prettier/prettier */
// Libraries
import { TouchableOpacity, Text } from "react-native";
import { ButtonProps } from "@/types/type";
import { LinearGradient } from "expo-linear-gradient";

export const CustomButton = ({
  onPress,
  title,
  className,
  ...props
}: ButtonProps) => {
  return (
    <LinearGradient
      colors={["#1C78B9", "#4B4C9E"]}
      className={`rounded-xl h-[52px] ${className}`}
      start={[0, 0]}
      end={[1, 1]}>
      <TouchableOpacity
        onPress={onPress}
        {...props}
        className="w-full h-full rounded-xl pb-0.5 flex flex-row justify-center items-center">
        <Text className="text-sm sm:text-base font-ManropSemibold text-white text-center">
          {title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CustomButton;
