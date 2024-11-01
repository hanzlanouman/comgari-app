import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";

import { router } from "expo-router";
import { CustomButton } from "@/common/components";

const Clients = () => {
  const hasData = true;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {hasData ? (
          <View className="pb-4">
            <TouchableOpacity className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5">
              <View className="flex-row items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-2xl"
                  style={{ width: vs(60), height: vs(60) }}
                />
                <View className="pl-3 flex-grow">
                  <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                    Guy Hawkins
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                      <View className="bg-blue w-1.5 h-1.5" />
                    </View>
                    <Text className="text-sm font-ManropeMedium text-blue ml-2">
                      Construction
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing.
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-grow flex-col items-center justify-center px-4">
            <Image
              source={images.member}
              resizeMode="contain"
              style={{ width: scale(150), height: vs(150) }}
              className="mx-auto"
            />
            <View>
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                We can’t find any
              </Text>
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                member yet!
              </Text>
              <View className="w-[158px] mx-auto mt-5">
                <CustomButton
                  title="Add Member"
                  onPress={() => {
                    router.push("/(root)/(tabs)/clients/add-clients");
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Clients;
