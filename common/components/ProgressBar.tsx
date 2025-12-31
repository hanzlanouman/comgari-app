import { View } from "react-native";

export const ProgressBar = ({ progress }) => {
  return (
    <View className="bg-gray-dark rounded-lg" style={{ width: "100%", height: 8 }}>
      <View
        className="bg-blue rounded-lg"
        style={{ width: `${progress}%`, height: "100%" }}
      />
    </View>
  );
};

export default ProgressBar;
