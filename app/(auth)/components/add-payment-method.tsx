import { View, Text } from "react-native";
import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@/constants";
import AddCard from "../add-card";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function Addpaymentmethod() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <StripeProvider
          publishableKey={STRIPE_PUBLIC_KEY}
          merchantIdentifier="Comgari"
          urlScheme="comgari">
          <AddCard />
        </StripeProvider>
      </ScrollView>
      /
    </SafeAreaView>
  );
}
