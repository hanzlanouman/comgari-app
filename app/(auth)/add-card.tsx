import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useState } from "react";

import { router } from "expo-router";
import { CustomButton, InputField } from "@/common/components";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@/constants";
import AddPaymentcards from "./components/add-cards";

const AddCard = () => {
  const [form, setForm] = useState({
    cardHolderName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StripeProvider
        publishableKey={STRIPE_PUBLIC_KEY}
        merchantIdentifier="Comgari"
        urlScheme="comgari">
        <AddPaymentcards />
      </StripeProvider>
      <View className="px-4 pt-4 bg-white">
        <CustomButton title="Add Card" onPress={() => router.push("/(root)")} />
      </View>
    </SafeAreaView>
  );
};

export default AddCard;
