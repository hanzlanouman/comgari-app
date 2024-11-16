import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { vs } from "react-native-size-matters";
import { CalendarDays, NotepadText } from "lucide-react-native";
import { images } from "@/constants";

const Proposal = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <View className="pb-4">
          <View className="bg-white mt-4">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-base sm:text-lg font-ManropeBold text-dark w-full">
                  Project Name
                </Text>
                <View>
                  <View className="flex-row items-center mt-1.5">
                    <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                      <View className="bg-blue w-1.5 h-1.5" />
                    </View>
                    <Text className="text-sm font-ManropeMedium text-blue ml-2">
                      Construction
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              Lorem Ipsum is simply dummy text of the printing.
            </Text>
            <View className="bg-light w-full h-px my-3" />
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(25), height: vs(25) }}
                />
                <Text className="text-sm text-dark font-ManropeMedium ml-1.5">
                  Ammar Hanif
                </Text>
              </View>
              <View className="flex-row items-center">
                <CalendarDays
                  size={16}
                  strokeWidth={1.5}
                  className="text-dark"
                />
                <Text className="text-sm text-dark-100 font-ManropeMedium ml-1">
                  14 Oct 2024
                </Text>
              </View>
            </View>
            <View className="bg-light w-full h-px mt-3" />
            <View className="flex-row items-center justify-between border-b border-light py-3.5">
              <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                Project Director
              </Text>
              <Text className="text-sm sm:text-base text-dark font-ManropeMedium">
                Ali Raza
              </Text>
            </View>
            <View className="flex-row items-center justify-between border-b border-light py-3.5">
              <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                Job Name
              </Text>
              <Text className="text-sm sm:text-base text-dark font-ManropeMedium">
                Job Name
              </Text>
            </View>
            <View className="flex-row items-center justify-between border-b border-light py-3.5">
              <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                Job Phone
              </Text>
              <Text className="text-sm sm:text-base text-dark font-ManropeMedium">
                +92 301 60 86 150
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Proposal;
