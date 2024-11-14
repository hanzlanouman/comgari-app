import React, { useCallback, useMemo, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { icons } from "@/constants";
import { ChevronRight, PencilLine, Trash2, Upload } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Backdrop from "@/components/Backdrop";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";

const MediaImages = () => {
  // Edit/Delete Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => {
    return ["22%", "22%"];
  }, []);

  // Edit/Delete callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
            className="px-4"
          >
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.pdfIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.pdfIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.docIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.pdfIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.pdfIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.docIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.pdfIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.pdfIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.docIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.pdfIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.pdfIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
              onPress={handlePresentModalPress}
            >
              <View className="flex-row items-center flex-1">
                <Image source={icons.docIcon} className="w-9 h-9" />
                <View className="pl-2.5">
                  <Text
                    className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Structural_Analysis_Report Structural_Analysis_Report.pdf
                  </Text>
                  <Text className="text-xs text-dark-100 font-ManropeRegular">
                    100 kb
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} className="text-dark" />
            </TouchableOpacity>

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
                  <TouchableOpacity className="flex-row items-center justify-between border border-light rounded-xl p-2.5">
                    <View className="flex-row items-center">
                      <LinearGradient
                        colors={["#1B78B9", "#63348F"]}
                        className="rounded-full w-8 h-8"
                        start={[0, 0]}
                        end={[1, 1]}
                      >
                        <TouchableOpacity
                          onPress={() => {}}
                          className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px"
                        >
                          <Upload size={16} color="#ffffff" />
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
                        className="bg-red rounded-full w-8 h-8 flex flex-row justify-center items-center"
                      >
                        <Trash2 size={16} color="#ffffff" />
                      </TouchableOpacity>
                      <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                        Delete
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#1C1C1C" />
                  </TouchableOpacity>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </ScrollView>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default MediaImages;
