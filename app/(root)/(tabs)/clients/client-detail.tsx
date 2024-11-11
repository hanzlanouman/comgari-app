import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { images, icons } from "@/constants";
import { vs } from "react-native-size-matters";
import { router } from "expo-router";

const ClientDetail = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-4 pt-2.5"
      >
        <View className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5">
          <View className="flex-row items-center border-b border-light pb-3.5">
            <Image
              source={images.user}
              resizeMode="cover"
              className="rounded-full"
              style={{ width: vs(45), height: vs(45) }}
            />
            <View className="pl-3 flex-grow">
              <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                Ammar Hanif
              </Text>
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-px">
                amhanif@comgari.com
              </Text>
            </View>
          </View>
          <View className="mt-3">
            <Text className="text-base font-ManropeMedium text-dark">
              +92 301 60 86150
            </Text>
            <Text className="text-sm font-ManropeMedium text-dark-100 mt-1.5">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              Lorem Ipsum is simply dummy text of the printing.
            </Text>
            <View className="flex-row items-center justify-between mt-4 border-t border-light pt-3 pb-1">
              <View className="flex-row items-center">
                <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                  <View className="bg-blue w-1.5 h-1.5" />
                </View>
                <Text className="text-sm font-ManropeMedium text-blue ml-2">
                  Construction
                </Text>
              </View>
              <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                <Text className="text-sm font-ManropeMedium text-green text-center">
                  Completed
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-row flex-wrap -mx-1.5">
          <View className="px-1.5 mt-3 w-2/4">
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/clients/brief")}
              className="border border-light rounded-[20px] p-4"
            >
              <View className="bg-blue w-10 h-10 rounded-full flex-row items-center justify-center">
                <Image
                  source={icons.brief}
                  resizeMode="contain"
                  className="w-[23px] h-5"
                />
              </View>
              <Text className="text-lg sm:text-xl font-ManropeSemibold text-dark mt-3">
                Brief
              </Text>
              <Text className="text-sm font-ManropeMedium text-dark mt-0.5">
                Brief your self in detail
              </Text>
            </TouchableOpacity>
          </View>
          <View className="px-1.5 mt-3 w-2/4">
            <TouchableOpacity
              onPress={() => {
                router.push("/(root)/(tabs)/clients/tasks");
              }}
              className="border border-light rounded-[20px] p-4"
            >
              <View className="bg-blue w-10 h-10 rounded-full flex-row items-center justify-center">
                <Image
                  source={icons.tasks}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
              </View>
              <Text className="text-lg sm:text-xl font-ManropeSemibold text-dark mt-3">
                Tasks
              </Text>
              <Text className="text-sm font-ManropeMedium text-dark mt-0.5">
                You can add tasks here
              </Text>
            </TouchableOpacity>
          </View>
          <View className="px-1.5 mt-3 w-2/4">
            <TouchableOpacity
              onPress={() => {
                router.push("/(root)/(tabs)/clients/notes");
              }}
              className="border border-light rounded-[20px] p-4"
            >
              <View className="bg-blue w-10 h-10 rounded-full flex-row items-center justify-center">
                <Image
                  source={icons.notes}
                  resizeMode="contain"
                  className="w-[23px] h-5"
                />
              </View>
              <Text className="text-lg sm:text-xl font-ManropeSemibold text-dark mt-3">
                Notes
              </Text>
              <Text className="text-sm font-ManropeMedium text-dark mt-0.5">
                Add important notes
              </Text>
            </TouchableOpacity>
          </View>
          <View className="px-1.5 mt-3 w-2/4">
            <TouchableOpacity
              onPress={() => {}}
              className="border border-light rounded-[20px] p-4"
            >
              <View className="bg-blue w-10 h-10 rounded-full flex-row items-center justify-center">
                <Image
                  source={icons.media}
                  resizeMode="contain"
                  className="w-[23px] h-5"
                />
              </View>
              <Text className="text-lg sm:text-xl font-ManropeSemibold text-dark mt-3">
                Media
              </Text>
              <Text className="text-sm font-ManropeMedium text-dark mt-0.5">
                Find all media files here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientDetail;
