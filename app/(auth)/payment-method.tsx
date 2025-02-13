import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@/constants";
import Cards from "./Cards";
import { PaymentRepository } from "@/repositories/payment/payment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocalSearchParams } from "expo-router";
import { TLoginResponse } from "@/repositories";
import { useAppDispatch } from "@/hooks/redux";
import { login, setSubscribed } from "@/store";

type TPlanProps = {
  authResponse?: string;
  selectedPlanPrice: any;
};

export default function Paymentmethod() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useAppDispatch();

  const searchParams = useLocalSearchParams<TPlanProps>();
  const authResponse = searchParams.authResponse;
  const selectedPlanPrice = searchParams.selectedPlanPrice;

  const parsedAuthResponse = React.useMemo(
    () => (authResponse ? (JSON.parse(authResponse) as TLoginResponse) : null),
    [authResponse]
  );

  const paymentRepo = PaymentRepository.getInstance();
  const queryClient = useQueryClient();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const { data: cards } = useQuery(
    ["cards"],
    () =>
      parsedAuthResponse
        ? paymentRepo.getCards(parsedAuthResponse)
        : paymentRepo.getCards(),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const { data: buyerResponse, refetch } = useQuery(
    ["create-buyer"],
    () =>
      parsedAuthResponse
        ? paymentRepo.createBuyer(parsedAuthResponse)
        : paymentRepo.createBuyer(),
    { enabled: false }
  );

  const onConfirmPayment = async () => {
    const payload = {
      id: selectedPlanPrice,
      paymentMethod_id: selectedCard,
      totalClient: 20,
    };
    return parsedAuthResponse
      ? await paymentRepo.createSubscription(payload, parsedAuthResponse)
      : await paymentRepo.createSubscription(payload);
  };

  const { mutate: confirmPayment, isLoading, isError } = useMutation(
    onConfirmPayment,
    {
      onSuccess: (data) => {
        if (parsedAuthResponse) {
          dispatch(login(parsedAuthResponse));
        }
        dispatch(setSubscribed(true));
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
