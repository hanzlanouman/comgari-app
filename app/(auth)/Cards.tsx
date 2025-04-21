import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from "react-native";
import { images } from "@/constants";
import { scale, vs } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { CreditCard, ChevronRight } from "lucide-react-native";
import CardComponent from "./components/payment-cards";
import { CustomButton } from "@/common/components";

interface CardData {
  id: string;
  card: {
    brand: string;
    last4: string;
  };
}

interface CardsProps {
  cards: CardData[];
  selectedCard: string | null;
  onAddCard: () => void;
  onConfirmPayment: (coupon?: string) => void;
  handleSelectCard: (cardId: string) => void;
  isNewSubscription?: boolean;
}

const Cards: React.FC<CardsProps> = ({
  cards,
  selectedCard,
  onAddCard,
  onConfirmPayment,
  handleSelectCard,
  isNewSubscription = true,
}) => {
  const [couponCode, setCouponCode] = useState<string>("");

  const handleConfirmPayment = () => {
    if (isNewSubscription && couponCode.trim()) {
      onConfirmPayment(couponCode.trim());
    } else {
      onConfirmPayment();
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {isNewSubscription && (
          <View className="mt-4">
            <Text className="text-dark-100 text-sm font-ManropeMedium mb-1">
              Have a coupon code?
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-sm"
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
            />
          </View>
        )}
        {cards.length > 0 ? (
          <View className="flex-grow flex-col gap-y-4 mt-4">
            {cards.map((card) => (
              <CardComponent
                key={card.id}
                onPress={() => handleSelectCard(card.id)}
                selected={selectedCard === card.id}
                label={`${card.card.brand.toUpperCase()} **** **** **** ${card.card.last4}`}
                img={
                  <Image
                    source={images.masterCard}
                    resizeMode="contain"
                    style={{ width: scale(25), height: vs(20) }}
                    className="mx-auto"
                  />
                }
              />
            ))}
            <LinearGradient
              colors={["#1C78B9", "#4B4C9E"]}
              className="rounded-xl h-[52px] mt-23"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={onAddCard}
                className="flex flex-row items-center justify-between rounded-lg py-4 pl-5 pr-3"
              >
                <View className="flex flex-row items-center">
                  <CreditCard size={20} color="#ffffff" />
                  <Text className="text-sm sm:text-base font-ManropeSemibold text-white ml-3">
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
              source={images.masterCard}
              resizeMode="contain"
              style={{ width: scale(130), height: vs(130) }}
              className="mx-auto"
            />
            <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center mt-6 px-4">
              We can't find any payment method, please add one!
            </Text>
            <View className="w-[158px] mx-auto mt-5">
              <CustomButton title="Add Card" onPress={onAddCard} />
            </View>
          </View>
        )}
      </ScrollView>
      <View className="p-4 pb-0">
        <CustomButton title="Confirm Payment" onPress={handleConfirmPayment} />
      </View>
    </>
  );
};

export default Cards;