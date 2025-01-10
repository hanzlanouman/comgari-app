import { View, Text, ScrollView, SafeAreaView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@/constants";
import PaymentMethods from "./Cards";
import Cards from "./Cards";
import CardSection from "./components/CardSection";
import { PaymentRepository } from "@/repositories/payment/payment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocalSearchParams } from "expo-router";
import { TLoginResponse } from "@/repositories";
import { useAppDispatch } from "@/hooks/redux";
import { login } from "@/store";
type TPlanProps = {
  authResponse?: string;
  selectedPlanPrice: any;
};
export default function Paymentmethod() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useAppDispatch();

  const { authResponse, selectedPlanPrice } =
    useLocalSearchParams<TPlanProps>();
  const parsedAuthResponse = JSON.parse(authResponse!) as TLoginResponse;

  const paymentRepo = PaymentRepository.getInstance();
  const queryClient = useQueryClient();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const { data: cards } = useQuery(
    ["cards"],
    async () => {
      return await paymentRepo.getCards(parsedAuthResponse);
    }
    // {
    //   staleTime: Infinity,
    //   cacheTime: Infinity,
    //   refetchOnWindowFocus: false,
    //   refetchOnMount: false,
    //   refetchOnReconnect: false,
    // }
  );

  const onConfirmPayment = async () => {
    const payload = {
      id: selectedPlanPrice,
      paymentMethod_id: selectedCard,
      totalClient: 20,
    };

    await paymentRepo.createSubscription(payload, parsedAuthResponse);
  };

  const { mutate, isLoading, isError, isSuccess } = useMutation(
    onConfirmPayment,
    {
      onSuccess: (data) => {
        console.log("Payment successful!", data);

        dispatch(login(parsedAuthResponse));
      },
      onError: (error) => {
        console.error("Payment failed:", error);
      },
    }
  );

  const handlePaymentConfirmation = () => {
    mutate();
  };
  const handleSelectCard = (cardId: string) => {
    setSelectedCard(cardId);
  };
  const {
    data: res,

    refetch,
  } = useQuery(
    ["create-buyer"],
    async () => {
      return await paymentRepo.createBuyer(parsedAuthResponse);
    },
    {
      enabled: false,
    }
  );
  const { data: card } = useQuery(
    ["cards"],
    async () => {
      return await paymentRepo.getCards(parsedAuthResponse);
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      console.log(error);
    }
    if (!error) {
      console.log("Payment Method added Successfully");
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
        console.log(error, "Error is this");
        return;
      }
      if (!error) {
        openPaymentSheet();
      }
    } catch (e: any) {
      console.log(e, "Error therre");
    }
  };
  useEffect(() => {
    if (res) {
      paymentProcess(res);
    }
  }, [initPaymentSheet, res]);

  useEffect(() => {
    if (card) {
      console.log("Card is this", card);
    }
  }, [card]);
  const onAddCard = async () => {
    refetch();
  };
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <StripeProvider
        publishableKey={STRIPE_PUBLIC_KEY}
        merchantIdentifier="Comgari"
        urlScheme="comgari">
        <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-3">
          Select one of your saved cards or add a new card below.
        </Text>
        <Cards
          cards={cards?.data || []}
          onAddCard={onAddCard}
          handleSelectCard={handleSelectCard}
          onConfirmPayment={handlePaymentConfirmation}
          selectedCard={selectedCard}
        />
      </StripeProvider>
    </SafeAreaView>
  );
}
