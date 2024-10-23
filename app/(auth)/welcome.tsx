import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { scale, vs, verticalScale } from "react-native-size-matters";
import { router } from "expo-router";

const Welcome = () => {
  return (
    <ImageBackground
      source={images.welcome}
      resizeMode="cover"
      className="w-full h-screen"
    >
      <LinearGradient
        colors={["#1D78B9", "#52469A"]}
        className="absolute top-0 left-0 w-full h-full opacity-[.85]"
      />
      <View className="" style={{ paddingTop: verticalScale(80) }}>
        <Image
          source={images.logo}
          resizeMode="contain"
          className="mx-auto"
          style={{ width: scale(70), height: vs(70) }}
        />
        <Text className="text-base sm:text-xl text-white font-ManropBold text-center mt-1.5">
          Comgari
        </Text>
      </View>
      <View className="px-5 absolute bottom-0 left-0 w-full pb-6 sm:pb-6">
        <Text className="text-3xl sm:text-4xl text-white font-ManropBold text-center mb-12 px-2 sm:px-0">
          Here to mend your world with care and a smile, one fix at a time.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-in")}
          className="bg-white w-full h-[52px] rounded-xl pb-0.5 flex flex-row justify-center items-center"
        >
          <Text className="text-sm sm:text-base font-ManropSemibold text-blue">
            I have an account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-up")}
          className="bg-navy w-full h-[52px] rounded-xl pb-0.5 flex flex-row justify-center items-center mt-2.5"
        >
          <Text className="text-sm sm:text-base font-ManropSemibold text-white">
            I’ m new here
          </Text>
        </TouchableOpacity>
        <Text className="text-base sm:text-lg text-white font-ManropMedium text-center px-5 mt-5">
          Let us handle the entire project from start to finish.
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Welcome;
