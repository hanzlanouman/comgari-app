import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images, icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";

const Notes = () => {
  const hasData = true;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {hasData ? (
          <View className="pb-4">
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/clients/notes-detail")}
              className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5"
            >
              <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6">
                Construction Schedule: The 7 Types and Their Advantages.
              </Text>
              <View className="flex-row items-center justify-between mt-2.5">
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
                <Text className="text-sm text-dark-100 font-ManropeMedium">
                  14 Oct 2024
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
              <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6">
                Construction Schedule: The 7 Types and Their Advantages.
              </Text>
              <View className="flex-row items-center justify-between mt-2.5">
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
                <Text className="text-sm text-dark-100 font-ManropeMedium">
                  14 Oct 2024
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
              <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6">
                Construction Schedule: The 7 Types and Their Advantages.
              </Text>
              <View className="flex-row items-center justify-between mt-2.5">
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
                <Text className="text-sm text-dark-100 font-ManropeMedium">
                  14 Oct 2024
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
              <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6">
                Construction Schedule: The 7 Types and Their Advantages.
              </Text>
              <View className="flex-row items-center justify-between mt-2.5">
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
                <Text className="text-sm text-dark-100 font-ManropeMedium">
                  14 Oct 2024
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
              <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6">
                Construction Schedule: The 7 Types and Their Advantages.
              </Text>
              <View className="flex-row items-center justify-between mt-2.5">
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
                <Text className="text-sm text-dark-100 font-ManropeMedium">
                  14 Oct 2024
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
              <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6">
                Construction Schedule: The 7 Types and Their Advantages.
              </Text>
              <View className="flex-row items-center justify-between mt-2.5">
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
                <Text className="text-sm text-dark-100 font-ManropeMedium">
                  14 Oct 2024
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-grow flex-col items-center justify-center px-4">
            <Image
              source={icons.noNotes}
              resizeMode="contain"
              style={{ width: scale(80), height: vs(80) }}
              className="mx-auto"
            />
            <View className="mt-8">
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                No Notes found, please
              </Text>
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                create notes
              </Text>
              <View className="w-[180px] mx-auto mt-5">
                <CustomButton
                  title="Create Note"
                  onPress={() =>
                    router.push("/(root)/(tabs)/clients/create-note")
                  }
                  IconLeft={Plus}
                  iconSize={20}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notes;
