/* eslint-disable prettier/prettier */
// Libraries
import { TouchableOpacity, Text } from "react-native";
import { ButtonProps } from "@/types/type";
import { LinearGradient } from "expo-linear-gradient";

export const CustomButton = ({
  onPress,
  title,
  className,
  IconRight,
  iconSize,
  ...props
}: ButtonProps) => {
  return (
    <LinearGradient
      colors={["#1C78B9", "#4B4C9E"]}
      // Explicit style borderRadius ensures the gradient container is rounded
      style={{ borderRadius: 12, height: 52 }}
      className={`rounded-xl ${className}`}
      start={[0, 0]}
      end={[1, 1]}
    >
      <TouchableOpacity
        onPress={onPress}
        {...props}
        style={{ width: "100%", height: "100%" }}
        className="rounded-xl pb-0.5 flex flex-row justify-center items-center"
      >
        <Text className="text-sm sm:text-base font-ManropSemibold text-white text-center">
          {title}
        </Text>
        {IconRight && (
          <IconRight
            size={iconSize}
            color="#ffffff"
            className="mr-2 relative top-px"
          />
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CustomButton;
