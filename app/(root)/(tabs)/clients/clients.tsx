import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { useState } from "react";
import { CalendarDays } from "lucide-react-native";
import ProgressBar from "@/components/ProgressBar";

const Clients = () => {
  const hasData = true;

  const [progress, setProgress] = useState(50);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {hasData ? (
          <View className="pb-4">
            <TouchableOpacity
              onPress={() => {
                router.push("/(root)/(tabs)/clients/client-detail");
              }}
              className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5"
            >
              <View className="flex-row items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-2xl"
                  style={{ width: vs(50), height: vs(50) }}
                />
                <View className="pl-3.5 flex-grow">
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
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing.
              </Text>
              <View className="flex-row items-center mt-3.5">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full border-2 border-white"
                  style={{ width: vs(35), height: vs(35) }}
                />
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full border-2 border-white relative -ml-3.5"
                  style={{ width: vs(35), height: vs(35) }}
                />
                <Text className="text-base font-ManropeMedium text-dark ml-3.5">
                  Members
                </Text>
              </View>
              <View className="mt-3.5">
                <ProgressBar progress={progress} />
              </View>
              <View className="flex-row items-center justify-between mt-3.5">
                <View className="flex-row items-center">
                  <Text className="text-sm font-ManropeMedium text-dark">
                    Due on:
                  </Text>
                  <View className="flex-row items-center ml-2">
                    <CalendarDays size={18} color="#1C1C1C" />
                    <Text className="text-sm font-ManropeMedium text-dark ml-2">
                      Oct 05 2021
                    </Text>
                  </View>
                </View>
                <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                  <Text className="text-sm font-ManropeMedium text-green text-center">
                    Completed
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(root)/(tabs)/clients/client-detail");
              }}
              className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5"
            >
              <View className="flex-row items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-2xl"
                  style={{ width: vs(50), height: vs(50) }}
                />
                <View className="pl-3.5 flex-grow">
                  <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                    Guy Hawkins
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-green-100 flex-row items-center justify-center w-3.5 h-3.5">
                      <View className="bg-green w-1.5 h-1.5" />
                    </View>
                    <Text className="text-sm font-ManropeMedium text-green ml-2">
                      Building
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing.
              </Text>
              <View className="flex-row items-center mt-3.5">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full border-2 border-white"
                  style={{ width: vs(35), height: vs(35) }}
                />
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full border-2 border-white relative -ml-3.5"
                  style={{ width: vs(35), height: vs(35) }}
                />
                <Text className="text-base font-ManropeMedium text-dark ml-3.5">
                  Members
                </Text>
              </View>
              <View className="mt-3.5">
                <ProgressBar progress={progress} />
              </View>
              <View className="flex-row items-center justify-between mt-3.5">
                <View className="flex-row items-center">
                  <Text className="text-sm font-ManropeMedium text-dark">
                    Due on:
                  </Text>
                  <View className="flex-row items-center ml-2">
                    <CalendarDays size={18} color="#1C1C1C" />
                    <Text className="text-sm font-ManropeMedium text-dark ml-2">
                      Oct 05 2021
                    </Text>
                  </View>
                </View>
                <View className="bg-yellow-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                  <Text className="text-sm font-ManropeMedium text-yellow text-center">
                    Completed
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(root)/(tabs)/clients/client-detail");
              }}
              className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5"
            >
              <View className="flex-row items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-2xl"
                  style={{ width: vs(50), height: vs(50) }}
                />
                <View className="pl-3.5 flex-grow">
                  <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                    Guy Hawkins
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-yellow-100 flex-row items-center justify-center w-3.5 h-3.5">
                      <View className="bg-yellow w-1.5 h-1.5" />
                    </View>
                    <Text className="text-sm font-ManropeMedium text-yellow ml-2">
                      Landmark
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing.
              </Text>
              <View className="flex-row items-center mt-3.5">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full border-2 border-white"
                  style={{ width: vs(35), height: vs(35) }}
                />
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full border-2 border-white relative -ml-3.5"
                  style={{ width: vs(35), height: vs(35) }}
                />
                <Text className="text-base font-ManropeMedium text-dark ml-3.5">
                  Members
                </Text>
              </View>
              <View className="mt-3.5">
                <ProgressBar progress={progress} />
              </View>
              <View className="flex-row items-center justify-between mt-3.5">
                <View className="flex-row items-center">
                  <Text className="text-sm font-ManropeMedium text-dark">
                    Due on:
                  </Text>
                  <View className="flex-row items-center ml-2">
                    <CalendarDays size={18} color="#1C1C1C" />
                    <Text className="text-sm font-ManropeMedium text-dark ml-2">
                      Oct 05 2021
                    </Text>
                  </View>
                </View>
                <View className="bg-blue-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                  <Text className="text-sm font-ManropeMedium text-blue text-center">
                    Completed
                  </Text>
                </View>
              </View>
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
                client yet!
              </Text>
              <View className="w-[158px] mx-auto mt-5">
                <CustomButton
                  title="Add Client"
                  onPress={() =>
                    router.push("/(root)/(tabs)/members/add-client")
                  }
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
