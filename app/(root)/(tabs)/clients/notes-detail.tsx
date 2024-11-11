import React, { useCallback, useMemo, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { images } from "@/constants";
import { vs } from "react-native-size-matters";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Backdrop from "@/components/Backdrop";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

const NotesDetail = () => {
  const windowWidth = Dimensions.get("window").width;
  const sidePadding = 32;
  const spacingBetweenImages = 12;
  const imageWidth = (windowWidth - sidePadding - spacingBetweenImages * 2) / 3;

  // Coupon Code Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => {
    return ["49%", "80%"];
  }, []);

  // Coupon Code callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="px-4 mt-4">
              <TouchableOpacity
                onPress={handlePresentModalPress}
                className="flex-row items-center"
              >
                <Image
                  source={images.user}
                  resizeMode="cover"
                  className="rounded-full"
                  style={{ width: vs(50), height: vs(50) }}
                />
                <View className="pl-4">
                  <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                    Guy Hawkins
                  </Text>
                  <Text className="text-base font-ManropeMedium text-dark-100 mt-1">
                    14 Oct 2024
                  </Text>
                </View>
              </TouchableOpacity>
              <Text className="text-sm sm:text-base font-ManropeMedium text-dark-100 mt-4">
                I’m so exited for you to be joining us here at Comgari.
              </Text>
              <Text className="text-sm sm:text-base font-ManropeMedium text-dark-100 mt-3">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                Lorem Ipsum is simply dummy text of the printing. Ipsum is
                simply dummy text of the printing and typesetting Lorem Ipsum is
                simply dummy text of the printing.
              </Text>
            </View>
            <View className="p-4">
              {/* Row 1 */}
              <View className="flex flex-row mb-4">
                <View
                  style={{
                    width: imageWidth,
                    height: imageWidth,
                    marginRight: spacingBetweenImages,
                  }}
                >
                  <Image
                    source={images.user}
                    style={{ width: imageWidth, height: imageWidth }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </View>
                <View
                  style={{
                    width: imageWidth,
                    height: imageWidth,
                    marginRight: spacingBetweenImages,
                  }}
                >
                  <Image
                    source={images.user}
                    style={{ width: imageWidth, height: imageWidth }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </View>
                <View style={{ width: imageWidth, height: imageWidth }}>
                  <Image
                    source={images.user}
                    style={{ width: imageWidth, height: imageWidth }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Row 2 */}
              <View className="flex flex-row mb-4">
                <View
                  style={{
                    width: imageWidth,
                    height: imageWidth,
                    marginRight: spacingBetweenImages,
                  }}
                >
                  <Image
                    source={images.pdf}
                    style={{ width: imageWidth, height: imageWidth }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </View>
                <View
                  style={{
                    width: imageWidth,
                    height: imageWidth,
                    marginRight: spacingBetweenImages,
                  }}
                >
                  <Image
                    source={images.doc}
                    style={{ width: imageWidth, height: imageWidth }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </View>
                <View style={{ width: imageWidth, height: imageWidth }}>
                  <Image
                    source={images.pdf}
                    style={{ width: imageWidth, height: imageWidth }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>

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
                <View className="p-4">
                  <View className="border border-light rounded-xl p-2.5">
                    <Text>sfsdf</Text>
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

export default NotesDetail;
