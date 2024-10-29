import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { images } from "@/constants";
import { scale, vs } from "react-native-size-matters";
import CustomButton from "@/components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, ChevronRight, CreditCard } from "lucide-react-native";
import { router } from "expo-router";

const RadioButton = ({ onPress, selected, label, img }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="flex-row items-center justify-between bg-white border border-light rounded-xl py-4 px-5 mt-2.5"
    >
      <View className="flex flex-row items-center">
        {img}
        <Text className="text-sm sm:text-base font-ManropeSemibold text-black ml-3">
          {label}
        </Text>
      </View>
      {selected ? (
        <View className="w-5 h-5 rounded-full border border-blue flex flex-row items-center justify-center">
          <View className="w-3 h-3 bg-blue rounded-full"></View>
        </View>
      ) : (
        <View className="w-5 h-5 rounded-full border border-light" />
      )}
    </TouchableOpacity>
  );
};

const PaymentMethod = () => {
  const [selectedOption, setSelectedOption] = useState("option1");

  const hasData = true;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {hasData ? (
          <View>
            <RadioButton
              onPress={() => setSelectedOption("option1")}
              selected={selectedOption === "option1"}
              label="** ** **** **** 4679"
              img={
                <Image
                  source={images.masterCard}
                  resizeMode="contain"
                  style={{ width: scale(25), height: vs(20) }}
                  className="mx-auto"
                />
              }
            />
            <RadioButton
              onPress={() => setSelectedOption("option2")}
              selected={selectedOption === "option2"}
              label="** ** **** **** 4679"
              img={
                <Image
                  source={images.visa}
                  resizeMode="contain"
                  style={{ width: scale(25), height: vs(10) }}
                  className="mx-auto"
                />
              }
            />
            <LinearGradient
              colors={["#1C78B9", "#4B4C9E"]}
              className="rounded-xl h-[52px] mt-4"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={() => router.push("/(root)/add-card")}
                className="flex flex-row items-center justify-between rounded-lg py-4 pl-5 pr-3"
              >
                <View className="flex flex-row items-center">
                  <CreditCard size={20} color="#ffffff" />
                  <Text className="text-sm sm:text-base font-ManropeSemibold text-white ml-3 relative -top-[2.5px]">
                    Add New Card
                  </Text>
                </View>
                <ChevronRight size={18} stroke="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <View className="flex-grow flex-col items-center justify-center px-4">
            <Image
              source={images.card}
              resizeMode="contain"
              style={{ width: scale(130), height: vs(130) }}
              className="mx-auto"
            />
            <View>
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center mt-6 px-4">
                We can’t find any payment method, please add one!
              </Text>
              <View className="w-[158px] mx-auto mt-5">
                <CustomButton
                  title="Add Card"
                  onPress={() => router.push("/(root)/add-card")}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <View className="p-4 pb-0">
        <CustomButton
          title="Confirm Payment"
          onPress={() => router.push("/")}
        />
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethod;
