import React, { useCallback, useMemo, useRef } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { images, icons } from "@/constants";
import { vs } from "react-native-size-matters";
import { router } from "expo-router";
import Backdrop from "@/components/Backdrop";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Clapperboard,
  FileText,
  Image as LucideImg,
} from "lucide-react-native";

const ClientDetail = () => {
  // Media Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => {
    return ["22%"];
  }, []);

  // Media callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
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
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting Lorem Ipsum is simply dummy text of the printing.
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
                  onPress={handlePresentModalPress}
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

            {/* Bottom Sheet */}
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              backdropComponent={Backdrop}
              backgroundStyle={{
                borderRadius: 24,
              }}
            >
              <BottomSheetView>
                <View className="p-4 pt-2">
                  <Text className="text-sm sm:text-base font-ManropeMedium text-dark text-center">
                    Media Files
                  </Text>
                  <View className="flex-row justify-around -mx-1.5 mt-5">
                    <TouchableOpacity
                      className="w-2/6 px-1.5"
                      onPress={() =>
                        router.push("/(root)/(tabs)/clients/media-images")
                      }
                    >
                      <View
                        className="bg-green-50 rounded-2xl flex-row items-center justify-center mx-auto"
                        style={{ width: vs(78), height: vs(78) }}
                      >
                        <LucideImg size={vs(40)} color="#1C1C1C" />
                      </View>
                      <Text className="text-sm font-ManropeSemibold text-dark mt-2 text-center">
                        Images
                      </Text>
                      <Text className="text-xs font-ManropeMedium text-dark-100 mt-0.5 text-center">
                        10 items
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="w-2/6 px-1.5"
                      onPress={() =>
                        router.push("/(root)/(tabs)/clients/media-videos")
                      }
                    >
                      <View
                        className="bg-red-50 rounded-2xl flex-row items-center justify-center mx-auto"
                        style={{ width: vs(78), height: vs(78) }}
                      >
                        <Clapperboard size={vs(40)} color="#1C1C1C" />
                      </View>
                      <Text className="text-sm font-ManropeSemibold text-dark mt-2 text-center">
                        Videos
                      </Text>
                      <Text className="text-xs font-ManropeMedium text-dark-100 mt-0.5 text-center">
                        5 items
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="w-2/6 px-1.5"
                      onPress={() =>
                        router.push("/(root)/(tabs)/clients/documents")
                      }
                    >
                      <View
                        className="bg-green-50 rounded-2xl flex-row items-center justify-center mx-auto"
                        style={{ width: vs(78), height: vs(78) }}
                      >
                        <FileText size={vs(40)} color="#1C1C1C" />
                      </View>
                      <Text className="text-sm font-ManropeSemibold text-dark mt-2 text-center">
                        Documents
                      </Text>
                      <Text className="text-xs font-ManropeMedium text-dark-100 mt-0.5 text-center">
                        2 items
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </ScrollView>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ClientDetail;
