import { View } from "react-native";

const ProgressBar = ({ progress }) => {
  return (
    <View className="bg-gray-dark w-full h-2 rounded-lg">
      <View
        className="bg-blue h-full rounded-lg"
        style={{ width: `${progress}%` }}
      />
    </View>
  );
};

export default ProgressBar;
