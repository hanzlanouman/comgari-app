// Libraries
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { router } from "expo-router";

// Components
import { onboarding } from "@/constants";
import CustomButton from "@/common/components/CustomButton";
import { route } from "@/common";
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";

const Onboarding = () => {
  useRedirectIfIOS();
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-6 h-[3px] bg-blue rounded-full mx-2"></View>}
        activeDot={
          <View className="w-6 h-[3px] bg-purple rounded-full mx-2"></View>
        }
        onIndexChanged={(index) => setActiveIndex(index)}>
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center">
            <Image
              source={item.image}
              className="w-full h-[250px] sm:h-[320px] mt-4"
              resizeMode="contain"
            />
            <Text className="text-navy text-2xl sm:text-3xl font-ManropeBold sm:px-8 px-10 text-center mt-5">
              {item.title}
            </Text>
            <Text className="text-dark-100 text-sm sm:text-base font-ManropeMedium px-6 text-center mt-5">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <View className="w-full flex-row items-center justify-between px-4 mt-10">
        <TouchableOpacity onPress={() => router.push(route.auth.register)}>
          <Text className="text-sm sm:text-base text-dark font-ManropeSemibold">
            Skip
          </Text>
        </TouchableOpacity>
        <CustomButton
          title={isLastSlide ? "Finish" : "Next"}
          onPress={() =>
            isLastSlide
              ? router.replace(route.auth.register)
              : swiperRef.current?.scrollBy(1)
          }
          className="w-24"
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
