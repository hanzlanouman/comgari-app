/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert
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
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";
import { TCreateSubscriptionPayload } from "@/repositories/payment/schema";

type TPlanProps = {
  authResponse?: string;
  selectedPlanPrice: string;
  isNewSubscription?: string;
};

export default function Paymentmethod() {
  useRedirectIfIOS();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useAppDispatch();

  const searchParams = useLocalSearchParams<TPlanProps>();
  const authResponse = searchParams.authResponse;
  const selectedPlanPrice = searchParams.selectedPlanPrice;
  const isNewSubscription = searchParams.isNewSubscription === "true";

  const parsedAuthResponse = React.useMemo(
    () => (authResponse ? (JSON.parse(authResponse) as TLoginResponse) : null),
    [authResponse]
  );

  const paymentRepo = PaymentRepository.getInstance();
  const queryClient = useQueryClient();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");

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

  const { data: buyerResponse, refetch, isLoading: buyerLoading, isError: buyerError } = useQuery(
    ["create-buyer"],
    async () => {
      try {
        const response = parsedAuthResponse
          ? await paymentRepo.createBuyer(parsedAuthResponse)
          : await paymentRepo.createBuyer();

        if (!response?.data?.customer) {
          throw new Error('Buyer creation response is missing customer ID');
        }

        return response;
      } catch (error) {
        console.error('Error creating buyer:', error);
        throw error;
      }
    },
    { enabled: false, retry: 2 }
  );

  const onConfirmPayment = async () => {
    const payload: Partial<TCreateSubscriptionPayload> & { totalClient: number } = {
      id: selectedPlanPrice,
      paymentMethod_id: selectedCard || "",
      totalClient: 20,
    };

    if (isNewSubscription && couponCode.trim()) {
      payload.coupon = couponCode.trim();
    }

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

      if (!res?.data || !res?.data.customer) {
        console.error('Missing customer data in buyerResponse:', res);
        Alert.alert("Payment Error", "Unable to initialize payment. Customer data is missing.");
        return;
      }

      const { setupIntent, customer, ephemeralKeys } = res?.data;

      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKeys,
        setupIntentClientSecret: setupIntent,
        merchantDisplayName: "Comgari",
      });

      if (error) {
        console.error("Payment sheet initialization error:", error);
        Alert.alert("Payment Error", error.message || "Failed to initialize payment system");
      } else {
        openPaymentSheet();
      }
    } catch (e) {
      console.error("Payment process error:", e);
      Alert.alert("Payment Error", "An unexpected error occurred during payment setup");
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

  const handleConfirmPayment = (coupon?: string) => {
    if (coupon) {
      setCouponCode(coupon);
    }
    confirmPayment();
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

        {buyerLoading && (
          <View className="items-center justify-center my-4">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-2">Preparing payment system...</Text>
          </View>
        )}

        {buyerError && (
          <View className="items-center justify-center my-4 p-3 bg-red-50 rounded-md">
            <Text className="text-red-500">Error initializing payment system. Please try again.</Text>
          </View>
        )}

        <Cards
          cards={cards?.data || []}
          onAddCard={onAddCard}
          handleSelectCard={handleSelectCard}
          onConfirmPayment={handleConfirmPayment}
          selectedCard={selectedCard}
        />
      </StripeProvider>
    </SafeAreaView>
  );
}
