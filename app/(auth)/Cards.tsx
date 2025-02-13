import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
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
  onConfirmPayment: () => void;
  handleSelectCard: (cardId: string) => void;
}

const Cards: React.FC<CardsProps> = ({
  cards,
  selectedCard,
  onAddCard,
  onConfirmPayment,
  handleSelectCard,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmPayment = () => {
    if (!selectedCard) {
      setErrorMessage("Please select a payment method."); // Set error message if no card is selected
      return;
    }

    setErrorMessage(null);
    onConfirmPayment();
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {cards.length > 0 ? (
          <View>
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
              end={[1, 1]}>
              <TouchableOpacity
                onPress={onAddCard}
                className="flex flex-row items-center justify-between rounded-lg py-4 pl-5 pr-3">
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
              We can’t find any payment method, please add one!
            </Text>
            <View className="w-[158px] mx-auto mt-5">
              <CustomButton title="Add Card" onPress={onAddCard} />
            </View>
          </View>
        )}

        {/* Display error message */}
        {errorMessage && (
          <Text className="text-red mt-2 text-center">{errorMessage}</Text>
        )}
      </ScrollView>

      {/* Conditionally render the Confirm Payment button */}
      {cards.length > 0 && (
        <View className="p-4 pb-0">
          <CustomButton
            title="Confirm Payment"
            onPress={handleConfirmPayment}
          />
        </View>
      )}
    </>
  );
};

export default Cards;
