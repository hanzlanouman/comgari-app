import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Check } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "@/constants";
import { scale, vs } from "react-native-size-matters";
import { router, useLocalSearchParams } from "expo-router";
import { CustomButton } from "@/common/components";
import PlanCard from "./components/PlanCard";
import { useQuery } from "react-query";
import { PaymentRepository } from "@/repositories/payment/payment";

// Define the plan types
type TPlanProps = {
  authResponse?: string;
};

const GoPro = () => {
  const { authResponse } = useLocalSearchParams<TPlanProps>();
  console.log("authResponse in go pro params:", authResponse);
  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [priceId, setPriceId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

  const paymentRepo = PaymentRepository.getInstance();

  const { data: subscriptions } = useQuery(
    "subscription",
    async () => {
      if (authResponse) {
        return await paymentRepo.getSubscription(authResponse);
      } else {
        return await paymentRepo.getSubscription();
      }
    },
    {
      enabled: true, // Keep the query enabled
    }
  );
  
  console.log("Subscriptions Data:", subscriptions);

  const handlePress = (plan: string, price: string) => {
    setSelectedPlan(plan);
    setPriceId(price);
    setErrorMessage(null); // Clear error message when a plan is selected
  };

  // Filter plans based on active tab
  const plans = subscriptions?.data?.filter((subscription) =>
    activeTab === "monthly"
      ? subscription.pricing[0].paymentSchedule === "month"
      : subscription.pricing[0].paymentSchedule === "year"
  );

  const handleBuyNow = () => {
    if (!selectedPlan) {
      setErrorMessage("Please select a plan."); // Set error message if no plan is selected
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

  console.log("Subscriptions:", subscriptions);
  console.log("Filtered Plans:", plans);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 px-4 py-4 relative z-10">
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
            Choose a plan to unlock all of Comgari’s premium features.{"\n"}
            <Text className="text-red">Cancel</Text> at any time.
          </Text>

          {/* Error message display */}
          {errorMessage && (
            <Text className="text-red mt-2">{errorMessage}</Text>
          )}
          <View className="flex flex-row items-center justify-between bg-gray p-1.5 rounded-xl mt-5">
            <TouchableOpacity
              onPress={() => setActiveTab("monthly")}
              className={`${activeTab === "monthly" ? "bg-white" : "bg-light-50"} w-2/4 rounded-lg p-2 sm:p-3`}>
              <Text className="text-center text-sm sm:text-base font-ManropeSemibold">
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("yearly")}
              className={`${activeTab === "yearly" ? "bg-white" : "bg-light-50"} w-2/4 rounded-lg p-2 sm:p-3`}>
              <Text className="text-center text-sm sm:text-base font-ManropeSemibold">
                Yearly
              </Text>
            </TouchableOpacity>
          </View>
          <View className="mt-4">
            {plans?.map((plan, index) => {
              return (
                <PlanCard
                  key={plan?.id}
                  plan={plan?.name}
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
            <CustomButton
              title="Upgrade Now"
              onPress={handleBuyNow} // Use the new handleBuyNow function
            />
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
