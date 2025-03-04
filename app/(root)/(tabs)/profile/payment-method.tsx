import {
  View,
  Text,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@/constants";
import Cards from "@/app/(auth)/Cards";
import { PaymentRepository } from "@/repositories/payment/payment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch } from "@/hooks/redux";
import {  setSubscribed } from "@/store";

type TPlanProps = {
  selectedPlanPrice: any;
};

export default function Paymentmethod() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useAppDispatch();

  const searchParams = useLocalSearchParams<TPlanProps>();
  const selectedPlanPrice = searchParams.selectedPlanPrice;

  const paymentRepo = PaymentRepository.getInstance();
  const queryClient = useQueryClient();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const { data: cards } = useQuery(
    ["cards"],
    () => paymentRepo.getCards(),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const { data: buyerResponse, refetch } = useQuery(
    ["create-buyer"],
    () => paymentRepo.createBuyer(),
    { enabled: false }
  );

  const onConfirmPayment = async () => {
    const payload = {
      id: selectedPlanPrice,
      paymentMethod_id: selectedCard,
      totalClient: 20,
    };
    return paymentRepo.createSubscription(payload);
  };

  const { mutate: confirmPayment } = useMutation(
    onConfirmPayment,
    {
      onSuccess: () => {
        dispatch(setSubscribed(true));
        router.replace("/(root)/(tabs)/profile/plan-details");
      },
      onError: (error) => {
        console.error("Payment failed:", error);
      },
    }
  );

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      console.error("Payment sheet error:", error);
    } else {
      queryClient.invalidateQueries(["cards"]);
    }
  };

  const paymentProcess = async (res: any) => {
    try {
      const { setupIntent, customer, ephemeralKeys } = res?.data;
      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKeys,
        setupIntentClientSecret: setupIntent,
        merchantDisplayName: "Comgari",
      });
      if (error) {
        console.error("Payment sheet initialization error:", error);
      } else {
        openPaymentSheet();
      }
    } catch (e) {
      console.error("Payment process error:", e);
    }
  };

  useEffect(() => {
    if (buyerResponse) {
      paymentProcess(buyerResponse);
    }
  }, [buyerResponse]);

  const onAddCard = () => {
    refetch();
  };

  const handleSelectCard = (cardId: string) => {
    setSelectedCard(cardId);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <StripeProvider
        publishableKey={STRIPE_PUBLIC_KEY}
        merchantIdentifier="Comgari"
        urlScheme="comgari"
      >
        <View className="items-center">
          <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-3">
            Choose a saved card or add a new one below.
          </Text>
        </View>

        <Cards
          cards={cards?.data || []}
          onAddCard={onAddCard}
          handleSelectCard={handleSelectCard}
          onConfirmPayment={confirmPayment}
          selectedCard={selectedCard}
        />
      </StripeProvider>
    </SafeAreaView>
  );
}
