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
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const GoPro = () => {
  const [activeTab, setActiveTab] = useState("monthly");

  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePress = (plan) => {
    setSelectedPlan(plan);
  };

  const renderPlan = (plan, price, members, clients) => {
    const isSelected = selectedPlan === plan;

    return (
      <TouchableOpacity
        onPress={() => handlePress(plan)}
        className="mt-4 rounded-[20px]"
      >
        {isSelected ? (
          <LinearGradient
            colors={["#1C78B9", "#4B4C9E"]}
            start={[0, 0]}
            end={[1, 1]}
            className="rounded-[20px] p-4 border border-white"
          >
            {renderCardContent(plan, price, members, clients, isSelected)}
          </LinearGradient>
        ) : (
          <View className="border border-light bg-white rounded-[20px] p-4">
            {renderCardContent(plan, price, members, clients, isSelected)}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCardContent = (plan, price, members, clients, isSelected) => (
    <View>
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-lg sm:text-xl font-ManropeBold ${isSelected ? "text-white" : "text-dark"}`}
        >
          {plan}
        </Text>
        <View
          className={`${isSelected ? "bg-white" : "bg-blue"} h-8 rounded-full px-3`}
        >
          <Text
            className={`text-sm text-center ${isSelected ? "text-blue" : "text-white"} font-ManropeSemibold leading-[30px]`}
          >
            7 days free trial
          </Text>
        </View>
      </View>
      <Text
        className={`text-base sm:text-lg font-ManropeSemibold mt-2.5 ${isSelected ? "text-white" : "text-blue"}`}
      >
        €{price}/m
      </Text>
      <View className="flex-row items-center justify-between mt-4">
        <View className="flex-row items-center w-2/4">
          <View
            className={`flex-row items-center justify-center w-5 h-5 rounded-full ${isSelected ? "bg-white" : "bg-purple"}`}
          >
            <Check color={isSelected ? "#1B78B9" : "#ffffff"} size={14} />
          </View>
          <Text
            className={`text-sm sm:text-base font-ManropeMedium ml-1.5 ${isSelected ? "text-white" : "text-dark"}`}
          >
            {members} Members
          </Text>
        </View>
        <View className="flex-row items-center w-2/4">
          <View
            className={`flex-row items-center justify-center w-5 h-5 rounded-full ${isSelected ? "bg-white" : "bg-purple"}`}
          >
            <Check color={isSelected ? "#1B78B9" : "#ffffff"} size={14} />
          </View>
          <Text
            className={`text-sm sm:text-base font-ManropeMedium ml-1.5 ${isSelected ? "text-white" : "text-dark"}`}
          >
            {clients} Clients
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView>
          <View className="flex-1 px-4 py-4 relative z-10">
            <Text className="text-dark text-2xl sm:text-3xl font-ManropeBold">
              Go Pro today
            </Text>
            <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
              Please select a package to access the full Comgari features. You
              can <Text className="text-red">cancel</Text> at any time.
            </Text>
            <View className="flex flex-row items-center justify-between bg-light-50 p-1.5 rounded-xl mt-5">
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
            <View className="">
              {activeTab === "monthly" ? (
                <View>
                  {renderPlan("Basic Plan", "20", "10", "5")}
                  {renderPlan("Advanced Plan", "50", "30", "15")}
                  {renderPlan("Unlimited Plan", "50", "Unlimited", "Unlimited")}
                </View>
              ) : (
                <View>
                  {renderPlan("Basic Plan", "20", "10", "5")}
                  {renderPlan("Advanced Plan", "50", "30", "15")}
                  {renderPlan("Unlimited Plan", "50", "Unlimited", "Unlimited")}
                </View>
              )}
            </View>
            <View className="mt-4">
              <CustomButton title="Buy Now" onPress={() => router.push("/")} />
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
    </>
  );
};

export default GoPro;
