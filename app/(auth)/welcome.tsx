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
import { Href, Redirect, router } from "expo-router";
import { route } from "@/common";
import { useAppSelector } from "@/hooks/redux";

const Welcome = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (isAuthenticated) {
    return <Redirect href={route.root.home as unknown as Href} />;
  }
  return (
    <ImageBackground
      source={images.welcome}
      resizeMode="cover"
      className="w-full h-screen">
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
        <Text className="text-base sm:text-xl text-white font-ManropeBold text-center mt-1.5">
          Comgari
        </Text>
      </View>
      <View className="px-5 absolute bottom-0 left-0 w-full pb-6 sm:pb-6">
        <Text className="text-3xl sm:text-4xl text-white font-ManropeBold text-center mb-12 px-2 sm:px-0">
          Simplifying Success, One Client at a Time.{"\n"}
          Manage Your Business Like Never Before!
        </Text>

        <TouchableOpacity
          onPress={() => router.push(route.auth.login)}
          className="bg-white w-full h-[52px] rounded-xl pb-0.5 flex flex-row justify-center items-center">
          <Text className="text-sm sm:text-base font-ManropeSemibold text-blue">
            I have an account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push(route.auth.OnBoarding);
          }}
          className="bg-navy w-full h-[52px] rounded-xl pb-0.5 flex flex-row justify-center items-center mt-2.5">
          <Text className="text-sm sm:text-base font-ManropeSemibold text-white">
            I’ m new here
          </Text>
        </TouchableOpacity>
        <Text className="text-base sm:text-lg text-white font-ManropeMedium text-center px-5 mt-5">
          Let us handle the entire project from start to finish.
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Welcome;
