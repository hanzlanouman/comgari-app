import {
  View,
  Text,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@/constants";
import Cards from "@/app/(auth)/components/Cards";
import { PaymentRepository } from "@/repositories/payment/payment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch } from "@/hooks/redux";
import { setSubscribed } from "@/store";
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";
import { TCreateSubscriptionPayload } from "@/repositories/payment/schema";

type TPlanProps = {
  selectedPlanPrice: string;
  isNewSubscription?: string;
};

export default function Paymentmethod() {
  useRedirectIfIOS();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useAppDispatch();

  const searchParams = useLocalSearchParams<TPlanProps>();
  const selectedPlanPrice = searchParams.selectedPlanPrice;
  const isNewSubscription = searchParams.isNewSubscription === "false";

  const paymentRepo = PaymentRepository.getInstance();
  const queryClient = useQueryClient();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // First check if user already has a subscription
  const { data: agencySubscription } = useQuery(
    "profileAgencySubscription",
    async () => paymentRepo.getAgencySubscription(),
    {
      enabled: true,
      onSuccess: (data) => {

        if (data?.data?.hasSubscription && !isNewSubscription) {
          router.replace("/(root)/(tabs)/profile/plans");
        }
      }
    }
  );

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

    if (agencySubscription?.data?.hasSubscription) {
      setErrorMessage("You already have a subscription. Please use upgrade option from the plans page.");
      return;
    }

    const payload: Partial<TCreateSubscriptionPayload> & { totalClient: number } = {
      id: selectedPlanPrice,
      paymentMethod_id: selectedCard || "",
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
        setErrorMessage(`Payment failed: ${error}`);
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

  const handleConfirmPayment = () => {
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

        <View className="my-3 px-4">
          {errorMessage && <Text className="text-red text-center">{errorMessage}</Text>}
        </View>

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
