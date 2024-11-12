import React, { useCallback, useMemo, useRef, useEffect } from "react";
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
import { ChevronRight, Pencil, PencilLine, Trash2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const NotesDetail = () => {
  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenImages = 16;
  const sidePadding = 16;
  const imageWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

  const imageArray = [
    images.user,
    images.user,
    images.user,
    images.user,
    images.user,
    images.user,
  ];

  // Coupon Code Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => {
    return ["22%", "22%"];
  }, []);

  // Coupon Code callbacks
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
          end={[1, 1]}
        >
          <TouchableOpacity
            onPress={handlePresentModalPress}
            className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px"
          >
            <Pencil size={17} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>
      ),
    });
  }, [navigation, handlePresentModalPress]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="px-4 mt-4">
              <View className="flex-row items-center">
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
              </View>
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
              <View className="flex flex-row flex-wrap">
                {imageArray.map((image, index) => (
                  <View
                    key={index}
                    style={{
                      width: imageWidth,
                      height: imageWidth,
                      marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
                      marginBottom: spacingBetweenImages,
                    }}
                  >
                    <Image
                      source={image}
                      style={{ width: "100%", height: "100%" }}
                      className="rounded-[20px]"
                      resizeMode="cover"
                    />
                  </View>
                ))}
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
                          <PencilLine size={16} color="#ffffff" />
                        </TouchableOpacity>
                      </LinearGradient>
                      <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                        Edit
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

export default NotesDetail;
