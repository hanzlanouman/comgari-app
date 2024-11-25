import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { vs } from "react-native-size-matters";
import { images } from "@/constants";
import { CustomButton } from "@/common/components";
import { router } from "expo-router";
import { CalendarDays, NotepadText } from "lucide-react-native";

const Proposal = () => {
  const hasData = true;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {hasData ? (
          <View className="pb-4">
            <TouchableOpacity
              onPress={() => {
                router.push(
                  "/(root)/(tabs)/clients/[id]/proposal/proposal-detail"
                );
              }}
              className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5">
              <View className="flex-row items-center">
                <View
                  className="bg-[#BAE3FF] rounded-xl flex-row items-center justify-center"
                  style={{ width: vs(55), height: vs(55) }}>
                  <NotepadText
                    size={vs(30)}
                    strokeWidth={1.2}
                    className="text-blue"
                  />
                </View>
                <View className="pl-3.5 flex-1">
                  <Text
                    className="text-base sm:text-lg font-ManropeBold text-dark w-full"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Project Name
                  </Text>
                  <View>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-blue w-1.5 h-1.5" />
                      </View>
                      <Text className="text-sm font-ManropeMedium text-blue ml-2">
                        Construction
                      </Text>
                    </View>
                    <Text
                      className="text-sm font-ManropeMedium text-dark mt-1"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      Islamabad
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing.
              </Text>
              <View className="bg-light w-full h-px my-4" />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={images.user}
                    resizeMode="cover"
                    className="rounded-full border-2 border-white"
                    style={{ width: vs(30), height: vs(30) }}
                  />
                  <Text className="text-sm text-dark-100 font-ManropeMedium ml-1.5">
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(root)/(tabs)/proposal-detail");
              }}
              className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5">
              <View className="flex-row items-center">
                <View
                  className="bg-[#BAE3FF] rounded-xl flex-row items-center justify-center"
                  style={{ width: vs(55), height: vs(55) }}>
                  <NotepadText
                    size={vs(30)}
                    strokeWidth={1.2}
                    className="text-blue"
                  />
                </View>
                <View className="pl-3.5 flex-1">
                  <Text
                    className="text-base sm:text-lg font-ManropeBold text-dark w-full"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Project Name
                  </Text>
                  <View>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-blue w-1.5 h-1.5" />
                      </View>
                      <Text className="text-sm font-ManropeMedium text-blue ml-2">
                        Construction
                      </Text>
                    </View>
                    <Text
                      className="text-sm font-ManropeMedium text-dark mt-1"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      Islamabad
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing.
              </Text>
              <View className="bg-light w-full h-px my-4" />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={images.user}
                    resizeMode="cover"
                    className="rounded-full border-2 border-white"
                    style={{ width: vs(30), height: vs(30) }}
                  />
                  <Text className="text-sm text-dark-100 font-ManropeMedium ml-1.5">
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(root)/(tabs)/proposal-detail");
              }}
              className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5">
              <View className="flex-row items-center">
                <View
                  className="bg-[#BAE3FF] rounded-xl flex-row items-center justify-center"
                  style={{ width: vs(55), height: vs(55) }}>
                  <NotepadText
                    size={vs(30)}
                    strokeWidth={1.2}
                    className="text-blue"
                  />
                </View>
                <View className="pl-3.5 flex-1">
                  <Text
                    className="text-base sm:text-lg font-ManropeBold text-dark w-full"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Project Name
                  </Text>
                  <View>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-blue w-1.5 h-1.5" />
                      </View>
                      <Text className="text-sm font-ManropeMedium text-blue ml-2">
                        Construction
                      </Text>
                    </View>
                    <Text
                      className="text-sm font-ManropeMedium text-dark mt-1"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      Islamabad
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing.
              </Text>
              <View className="bg-light w-full h-px my-4" />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={images.user}
                    resizeMode="cover"
                    className="rounded-full border-2 border-white"
                    style={{ width: vs(30), height: vs(30) }}
                  />
                  <Text className="text-sm text-dark-100 font-ManropeMedium ml-1.5">
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/(root)/(tabs)/proposal-detail");
              }}
              className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5">
              <View className="flex-row items-center">
                <View
                  className="bg-[#BAE3FF] rounded-xl flex-row items-center justify-center"
                  style={{ width: vs(55), height: vs(55) }}>
                  <NotepadText
                    size={vs(30)}
                    strokeWidth={1.2}
                    className="text-blue"
                  />
                </View>
                <View className="pl-3.5 flex-1">
                  <Text
                    className="text-base sm:text-lg font-ManropeBold text-dark w-full"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Project Name
                  </Text>
                  <View>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-blue w-1.5 h-1.5" />
                      </View>
                      <Text className="text-sm font-ManropeMedium text-blue ml-2">
                        Construction
                      </Text>
                    </View>
                    <Text
                      className="text-sm font-ManropeMedium text-dark mt-1"
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      Islamabad
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing.
              </Text>
              <View className="bg-light w-full h-px my-4" />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={images.user}
                    resizeMode="cover"
                    className="rounded-full border-2 border-white"
                    style={{ width: vs(30), height: vs(30) }}
                  />
                  <Text className="text-sm text-dark-100 font-ManropeMedium ml-1.5">
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
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-grow flex-col items-center justify-center px-4">
            <NotepadText size={100} strokeWidth={1} className="text-blue" />
            <View className="mt-4">
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                We can’t find any
              </Text>
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                proposal yet!
              </Text>
              <View className="w-[158px] mx-auto mt-5">
                <CustomButton
                  title="Add Proposal"
                  onPress={() =>
                    router.push("/(root)/(tabs)/proposal/job-details")
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

export default Proposal;
