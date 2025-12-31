import { CustomButton } from "@/common/components";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store";
import {

  ScrollView,
  View,
  Text,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { scale, vs } from "react-native-size-matters";

const SubscriptionUnavailableMessage = () => {
  const dispatch = useAppDispatch();

  const openWebAppLink = () => {
    Linking.openURL("https://app.comgari.com/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 px-4 py-8 items-center justify-center">
          <Image
            source={images.icon}
            resizeMode="contain"
            style={{ width: scale(200), height: vs(200) }}
            className="mb-6"
          />
          <Text className="text-dark text-center font-ManropeBold text-xl mb-4">
            Subscription Required
          </Text>
          <Text className="text-dark-100 text-center text-sm sm:text-base font-ManropeRegular mb-8">
            Please purchase a subscription plan from our web application to
            continue using Comgari on your IOS device.
          </Text>
          <View className="mb-6 flex-1 w-full justify-end">

          <CustomButton title="Go to Web App" onPress={openWebAppLink} />
          </View>
        <View className="flex-1  justify-end w-full mb-6">
          <CustomButton title="Logout" onPress={() => dispatch(logout())} />
           
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionUnavailableMessage;