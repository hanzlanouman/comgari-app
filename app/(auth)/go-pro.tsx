/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { images } from "@/constants";
import { scale, vs } from "react-native-size-matters";
import { router, useLocalSearchParams } from "expo-router";
import { CustomButton } from "@/common/components";
import PlanCard from "./components/PlanCard";
import { useQuery } from "@tanstack/react-query";
import { PaymentRepository } from "@/repositories/payment/payment";
import { IS_IOS } from "@/utils";
import SubscriptionUnavailableMessage from "./components/noSubscriptionScreen";

type TPlanProps = {
  authResponse?: string;
};

const GoPro = () => {
  const { authResponse } = useLocalSearchParams<TPlanProps>();

  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [priceId, setPriceId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const paymentRepo = PaymentRepository.getInstance();

  const {
    data: subscriptions,
    isError,
    error,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      if (authResponse) {
        try {
          let parsedAuthResponse;

          if (typeof authResponse === "string") {
            try {
              parsedAuthResponse = JSON.parse(authResponse);
            } catch (parseError) {
              throw new Error("Invalid auth response format");
            }
          } else {
            parsedAuthResponse = authResponse;
          }

          if (!parsedAuthResponse?.access_token) {
            throw new Error("Invalid auth response: missing token");
          }

          return await paymentRepo.getSubscription(parsedAuthResponse);
        } catch (error) {
          console.error(
            "Error processing authResponse:",
            error,
            "authResponse:",
            typeof authResponse === "string"
              ? authResponse
              : JSON.stringify(authResponse)
          );

          return await paymentRepo.getSubscription();
        }
      } else {
        return await paymentRepo.getSubscription();
      }
    },
    enabled: true,
    retry: 1,
  });

  // Handle error with useEffect
  useEffect(() => {
    if (isError) {
      console.error("Subscription query error:", error);
    }
  }, [isError, error]);

  const handlePress = (plan: string, price: string) => {
    setSelectedPlan(plan);
    setPriceId(price);
    setErrorMessage(null);
  };

  const plans = subscriptions?.data?.filter((subscription: any) =>
    activeTab === "monthly"
      ? subscription.pricing[0].paymentSchedule === "month"
      : subscription.pricing[0].paymentSchedule === "year"
  );

  const handleBuyNow = () => {
    if (!selectedPlan) {
      setErrorMessage("Please select a plan.");
      return;
    }

    router.push({
      pathname: "/(auth)/payment-method",
      params: {
        ...(authResponse && { authResponse }),
        selectedPlanPrice: priceId,
      },
    });
  };

  const openWebAppLink = () => {
    Linking.openURL("https://app.comgari.com/");
  };

  if (IS_IOS) {
    return <SubscriptionUnavailableMessage />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 px-4 py-4 relative z-10">
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
            Choose a plan to unlock all of Comgari's premium features.{"\n"}
            <Text className="text-red">Cancel</Text> at any time.
          </Text>

          {/* Error message display */}
          {errorMessage && (
            <Text className="text-red mt-2">{errorMessage}</Text>
          )}
          <View className="flex flex-row items-center justify-between bg-gray p-1.5 rounded-xl mt-5">
            <TouchableOpacity
              onPress={() => setActiveTab("monthly")}
              className={`${activeTab === "monthly" ? "bg-white" : "bg-light-50"} w-2/4 rounded-lg p-2 sm:p-3`}
            >
              <Text className="text-center text-sm sm:text-base font-ManropeSemibold">
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("yearly")}
              className={`${activeTab === "yearly" ? "bg-white" : "bg-light-50"} w-2/4 rounded-lg p-2 sm:p-3`}
            >
              <Text className="text-center text-sm sm:text-base font-ManropeSemibold">
                Yearly
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-4">
            {plans?.map((plan: any, index: number) => {
              return (
                <PlanCard
                  key={plan?.id}
                  plan={plan?.name}
                  shcedule={plan.pricing?.[0].paymentSchedule}
                  price={plan?.pricing[0]?.price}
                  members={plan?.maxMembers}
                  clients={plan?.maxClients}
                  freetrial={plan?.freeTrialDays}
                  isSelected={selectedPlan === plan?.name}
                  onPress={() =>
                    handlePress(plan?.name, plan?.pricing[0]?.price_id)
                  }
                />
              );
            })}
          </View>

          <View className="mt-4">
            <CustomButton title="Upgrade Now" onPress={handleBuyNow} />
          </View>
        </View>
      </ScrollView>
      <Image
        source={images.donat}
        resizeMode="contain"
        style={{ width: scale(160), height: vs(160) }}
        className="absolute left-0 -bottom-[22px] -z-[1]"
      />
    </SafeAreaView>
  );
};

export default GoPro;
