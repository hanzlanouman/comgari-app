import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Brief = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-4 pt-2.5"
      >
        <Text>npx expo install @10play/tentap-editor react-native-webview</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Brief;
