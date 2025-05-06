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
import Cards from "./components/Cards";
import { PaymentRepository } from "@/repositories/payment/payment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocalSearchParams } from "expo-router";
import { TCoupon, TLoginResponse } from "@/repositories";
import { useAppDispatch } from "@/hooks/redux";
import { login, setSubscribed } from "@/store";
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";
import { TCreateSubscriptionPayload } from "@/repositories/payment/schema";
import { TextInput } from "react-native-gesture-handler";
import { showErrorAlert } from "@/utils";
import { CouponDuration, DiscountType } from "@/common";
import { CustomButton, SimpleActivityIndicator } from "@/common/components";

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

  const parsedAuthResponse = React.useMemo(
    () => (authResponse ? (JSON.parse(authResponse) as TLoginResponse) : null),
    [authResponse]
  );

  const paymentRepo = PaymentRepository.getInstance();
  const queryClient = useQueryClient();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isFree, setFree] = useState<boolean>(false);
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [couponData, setCouponData] = useState<TCoupon | null>(null);

  const isFullOffForever = (price: number, coupon: TCoupon) => {
    if (coupon.duration !== CouponDuration.forever) return false;
    if (coupon.type === DiscountType.PERCENTAGE) {
      return coupon.value === 100;
    } else {
      return coupon.value >= price;
    }
  }

  const { mutate: ValidateCoupon } = useMutation({
    mutationFn: (coupon: string) => parsedAuthResponse ?
      paymentRepo.validateCoupon(coupon.trim(), parsedAuthResponse)
      : paymentRepo.validateCoupon(coupon.trim()),
    onSuccess: (data) => {
      if (!data.valid) {
        showErrorAlert("Invalid coupon code.");
        return;
      }
      setIsCouponApplied(true);
      setCouponData(data.coupon);
      setFree(isFullOffForever(totalPrice, data.coupon));
    },
    onError: (error: any) => {
      showErrorAlert(error?.message || "An error occurred while validating the coupon code.");
    },
  })

  const { data: subscriptions } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => paymentRepo.getSubscription()
  });

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
    const payload: TCreateSubscriptionPayload= {
      id: selectedPlanPrice,
    };

    if (selectedCard && !isFree) {
      payload.paymentMethod_id = selectedCard;
    }
    
    return parsedAuthResponse
      ? await paymentRepo.createSubscription(payload, parsedAuthResponse)
      : await paymentRepo.createSubscription(payload);
  };

  const { mutate: confirmPayment } = useMutation(
    onConfirmPayment,
    {
      onSuccess: (data) => {
        if (parsedAuthResponse) {
          dispatch(login(parsedAuthResponse));
        }
        dispatch(setSubscribed(true));
      },
      onError: (error: any) => {
        console.error("Payment failed:", error);
        showErrorAlert(error?.message || "An error occurred during payment processing.");
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

  useEffect(() => {
    if (!subscriptions) return;
    subscriptions?.data?.map((s: any) => {
      if (s?.pricing?.[0]?.price_id === selectedPlanPrice) {
        setTotalPrice(s?.pricing?.[0]?.price);
      }
    })
  }, [subscriptions])

  const onAddCard = () => {
    refetch();
  };

  const handleSelectCard = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const handleConfirmPayment = () => {
    if (!selectedCard && !isFree) {
      showErrorAlert("Please select a card to confirm payment.");
      return;
    }

    if (couponCode && couponCode?.length > 0 && !isCouponApplied) {
      showErrorAlert("You have entered a coupon code but not applied it yet. Please apply it first or remove the coupon code.");
      return;
    }

    confirmPayment();
  };

  if (!cards || !subscriptions) {
    return <SimpleActivityIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <StripeProvider
        publishableKey={STRIPE_PUBLIC_KEY}
        merchantIdentifier="Comgari"
        urlScheme="comgari"
      >
        <View className="items-center">
          <Text className="text-grey-100 text-sm sm:text-base font-ManropeRegular mt-3">
            {isFree ? "This plan is free for you!" : "Choose a saved card or add a new one below."}
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

        <View className="mt-4">
          <Text className="text-dark-100 text-sm font-ManropeMedium mb-1">
            Have a coupon code?
          </Text>
          <View className="flex-row items-center border border-gray-100 rounded-xl p-1 h-14">
            <TextInput
              className="p-3 text-sm flex-1"
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <CustomButton
              title="Apply"
              onPress={() => ValidateCoupon(couponCode)}
              className="mt-2 !w-20 pb-4"
            />
          </View>
          {isCouponApplied && (
            <Text className="text-green-500 text-sm mt-2">
              Coupon applied successfully {isFree ? "(100% discount)" : couponData?.type === DiscountType.PERCENTAGE ? (${couponData.value}% off) : couponData ? ($${couponData.value} off) : ""}
            </Text>
          )}
        </View>

        {!isFree ? (
          <Cards
            cards={cards?.data || []}
            onAddCard={onAddCard}
            handleSelectCard={handleSelectCard}
            onConfirmPayment={handleConfirmPayment}
            selectedCard={selectedCard}
            enabled={Boolean(isFree || selectedCard || (couponCode && isCouponApplied))}
          />
        ) : (
          <View className="flex-1">
            <View className="p-4 pb-0 mt-auto">
              <CustomButton
                title="Confirm Payment"
                onPress={() => handleConfirmPayment()}
                disabled={false}
              />
            </View>
          </View>
        )}
      </StripeProvider>
    </SafeAreaView>
  );
}