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
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const Members = () => {
  const hasData = true;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {hasData ? (
          <View className="pb-4">
            <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20px] mt-2.5">
              <View className="relative items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(70), height: vs(70) }}
                />
                <View className="bg-purple rounded-3xl pb-[3px] absolute bottom-0 transform -translate-x-1/2 px-2.5">
                  <Text
                    className="text-white text-sm text-center font-ManropeMedium"
                    style={{ fontSize: Platform.OS === "ios" ? 14 : 11 }}
                  >
                    Admin
                  </Text>
                </View>
              </View>
              <View className="pl-3 flex-grow">
                <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                  Guy Hawkins
                </Text>
                <Text className="text-sm font-ManropeMedium text-dark-100">
                  guy.hawkins@comgari.com
                </Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-sm font-ManropeMedium text-dark-100">
                    +92 341 056 6466
                  </Text>
                  <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                    <Text className="text-sm font-ManropeMedium text-green text-center">
                      Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20px] mt-2.5">
              <View className="relative items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(70), height: vs(70) }}
                />
                <View className="bg-purple rounded-3xl pb-[3px] absolute bottom-0 transform -translate-x-1/2 px-2.5">
                  <Text
                    className="text-white text-center font-ManropeMedium"
                    style={{ fontSize: Platform.OS === "ios" ? 14 : 11 }}
                  >
                    Secretary
                  </Text>
                </View>
              </View>
              <View className="pl-3 flex-grow">
                <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                  Guy Hawkins
                </Text>
                <Text className="text-sm font-ManropeMedium text-dark-100">
                  guy.hawkins@comgari.com
                </Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-sm font-ManropeMedium text-dark-100">
                    +92 341 056 6466
                  </Text>
                  <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                    <Text className="text-sm font-ManropeMedium text-green text-center">
                      Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20px] mt-2.5">
              <View className="relative items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(70), height: vs(70) }}
                />
                <View className="bg-purple rounded-3xl pb-[3px] absolute bottom-0 transform -translate-x-1/2 px-2.5">
                  <Text
                    className="text-white text-center font-ManropeMedium"
                    style={{ fontSize: Platform.OS === "ios" ? 14 : 11 }}
                  >
                    Salesman
                  </Text>
                </View>
              </View>
              <View className="pl-3 flex-grow">
                <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                  Guy Hawkins
                </Text>
                <Text className="text-sm font-ManropeMedium text-dark-100">
                  guy.hawkins@comgari.com
                </Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-sm font-ManropeMedium text-dark-100">
                    +92 341 056 6466
                  </Text>
                  <View className="bg-gray rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                    <Text className="text-sm font-ManropeMedium text-dark-100 text-center">
                      In-Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20px] mt-2.5">
              <View className="relative items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(70), height: vs(70) }}
                />
                <View className="bg-purple rounded-3xl pb-[3px] absolute bottom-0 transform -translate-x-1/2 px-2.5">
                  <Text
                    className="text-white text-center font-ManropeMedium"
                    style={{ fontSize: Platform.OS === "ios" ? 14 : 11 }}
                  >
                    Secretary
                  </Text>
                </View>
              </View>
              <View className="pl-3 flex-grow">
                <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                  Guy Hawkins
                </Text>
                <Text className="text-sm font-ManropeMedium text-dark-100">
                  guy.hawkins@comgari.com
                </Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-sm font-ManropeMedium text-dark-100">
                    +92 341 056 6466
                  </Text>
                  <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                    <Text className="text-sm font-ManropeMedium text-green text-center">
                      Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20px] mt-2.5">
              <View className="relative items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(70), height: vs(70) }}
                />
                <View className="bg-purple rounded-3xl pb-[3px] absolute bottom-0 transform -translate-x-1/2 px-2.5">
                  <Text
                    className="text-white text-center font-ManropeMedium"
                    style={{ fontSize: Platform.OS === "ios" ? 14 : 11 }}
                  >
                    Secretary
                  </Text>
                </View>
              </View>
              <View className="pl-3 flex-grow">
                <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                  Guy Hawkins
                </Text>
                <Text className="text-sm font-ManropeMedium text-dark-100">
                  guy.hawkins@comgari.com
                </Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-sm font-ManropeMedium text-dark-100">
                    +92 341 056 6466
                  </Text>
                  <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                    <Text className="text-sm font-ManropeMedium text-green text-center">
                      Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="bg-white border border-light flex-row items-center p-2.5 rounded-[20px] mt-2.5">
              <View className="relative items-center">
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(70), height: vs(70) }}
                />
                <View className="bg-purple rounded-3xl pb-[3px] absolute bottom-0 transform -translate-x-1/2 px-2.5">
                  <Text
                    className="text-white text-center font-ManropeMedium"
                    style={{ fontSize: Platform.OS === "ios" ? 14 : 11 }}
                  >
                    Secretary
                  </Text>
                </View>
              </View>
              <View className="pl-3 flex-grow">
                <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                  Guy Hawkins
                </Text>
                <Text className="text-sm font-ManropeMedium text-dark-100">
                  guy.hawkins@comgari.com
                </Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-sm font-ManropeMedium text-dark-100">
                    +92 341 056 6466
                  </Text>
                  <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                    <Text className="text-sm font-ManropeMedium text-green text-center">
                      Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
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
                  onPress={() =>
                    router.push("/(root)/(tabs)/members/add-member")
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

export default Members;
