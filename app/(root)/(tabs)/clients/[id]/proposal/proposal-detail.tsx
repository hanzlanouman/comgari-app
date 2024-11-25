import React, { useCallback, useMemo, useRef, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { vs } from "react-native-size-matters";
import {
  ArrowDownToLine,
  CalendarDays,
  ChevronRight,
  Share2,
} from "lucide-react-native";
import { images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Backdrop } from "@/common/components/Backdrop";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

const Proposal = () => {
  // Download/Share Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => {
    return ["22%", "22%"];
  }, []);

  // Download/Share callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <LinearGradient
          colors={["#1B78B9", "#63348F"]}
          className="rounded-full w-8 h-8"
          start={[0, 0]}
          end={[1, 1]}>
          <TouchableOpacity
            onPress={handlePresentModalPress}
            className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px">
            <ArrowDownToLine size={16} className="text-white" />
          </TouchableOpacity>
        </LinearGradient>
      ),
    });
  }, [navigation, handlePresentModalPress]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
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
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting Lorem Ipsum is simply dummy text of the printing.
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
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    Ali Raza
                  </Text>
                </View>
                <View className="flex-row items-center justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Job Name
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    Job Name
                  </Text>
                </View>
                <View className="flex-row items-center justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Job Phone
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    +92 301 60 86 150
                  </Text>
                </View>
                <View className="flex-row items-start justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Address
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    Islamabad
                  </Text>
                </View>
                <View className="flex-row items-start justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    City
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    Islamabad
                  </Text>
                </View>
                <View className="flex-row items-start justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Zip
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    233323
                  </Text>
                </View>
                <View className="flex-row items-start justify-between border-b border-light py-3.5">
                  <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
                    Estimated Days
                  </Text>
                  <Text className="text-sm sm:text-base text-dark font-ManropeMedium flex-1 text-right pl-6">
                    90 days
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* Bottom Sheet */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={Backdrop}
          backgroundStyle={{
            borderRadius: 24,
          }}>
          <BottomSheetView>
            <View className="p-4 pt-2">
              <TouchableOpacity className="flex-row items-center justify-between border border-light rounded-xl p-2.5">
                <View className="flex-row items-center">
                  <LinearGradient
                    colors={["#1B78B9", "#63348F"]}
                    className="rounded-full w-8 h-8"
                    start={[0, 0]}
                    end={[1, 1]}>
                    <TouchableOpacity
                      onPress={() => {}}
                      className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px">
                      <ArrowDownToLine size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </LinearGradient>
                  <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                    Download
                  </Text>
                </View>
                <ChevronRight size={16} color="#1C1C1C" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between border border-light rounded-xl p-2.5 mt-3">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => {}}
                    className="bg-dark rounded-full w-8 h-8 flex flex-row justify-center items-center">
                    <Share2 size={16} className="text-white" />
                  </TouchableOpacity>
                  <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                    Share
                  </Text>
                </View>
                <ChevronRight size={16} color="#1C1C1C" />
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Proposal;
