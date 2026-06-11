import {
  View,
  Text,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import Cards from "@/app/(auth)/components/Cards";
import { PaymentRepository } from "@/repositories/payment/payment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch } from "@/hooks/redux";
import { setSubscribed } from "@/store";
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";
import { TCreateSubscriptionPayload } from "@/repositories/payment/schema";
import { showErrorAlert } from "@/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { TCoupon } from "@/repositories";
import { CouponDuration, DiscountType } from "@/common";
import { CustomButton, SimpleActivityIndicator } from "@/common/components";

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
  };

  const { mutate: ValidateCoupon } = useMutation({
    mutationFn: (coupon: string) => paymentRepo.validateCoupon(coupon.trim()),
    onSuccess: (data) => {
      if (!data.valid) {
        showErrorAlert("Invalid coupon code.");
        return;
      }
      setIsCouponApplied(true);
      setCouponData(data.coupon);
      setFree(isFullOffForever(totalPrice, data.coupon));
    },
    onError: (error: Error & { message?: string }) => {
      showErrorAlert(
        error?.message || "An error occurred while validating the coupon code.",
      );
    },
  });

  const { data: agencySubscription } = useQuery({
    queryKey: ["profileAgencySubscription"],
    queryFn: async () => paymentRepo.getAgencySubscription(),
    enabled: true,
  });

  const hasActiveAgencySubscription =
    Array.isArray(agencySubscription?.data) &&
    agencySubscription.data.length > 0;

  useEffect(() => {
    if (hasActiveAgencySubscription && !isNewSubscription) {
      router.replace("/(root)/(tabs)/profile/plans");
    }
  }, [agencySubscription, isNewSubscription, hasActiveAgencySubscription]);

  const { data: subscriptions } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => paymentRepo.getSubscription(),
  });

  const { data: cards } = useQuery({
    queryKey: ["cards"],
    queryFn: () => paymentRepo.getCards(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: buyerResponse,
    refetch,
    isLoading: buyerLoading,
    isError: buyerError,
  } = useQuery({
    queryKey: ["create-buyer"],
    queryFn: async () => {
      try {
        const response = await paymentRepo.createBuyer();
        if (!response?.data?.customer) {
          throw new Error("Buyer creation response is missing customer ID");
        }
        return response;
      } catch (error) {
        console.error("Error creating buyer:", error);
        throw error;
      }
    },
    enabled: false,
    retry: 2,
    gcTime: 0,
  });

  useEffect(() => {
    if (!subscriptions) return;
    subscriptions?.data?.forEach((s: { pricing?: { price_id: string; price: number }[] }) => {
      if (s?.pricing?.[0]?.price_id === selectedPlanPrice) {
        setTotalPrice(s?.pricing?.[0]?.price);
      }
    });
  }, [subscriptions, selectedPlanPrice]);

  const onConfirmPayment = async () => {
    if (hasActiveAgencySubscription) {
      setErrorMessage(
        "You already have a subscription. Please use upgrade option from the plans page.",
      );
      return;
    }

    const payload: Partial<TCreateSubscriptionPayload> = {
      id: selectedPlanPrice as string,
    };
    if (selectedCard && !isFree) {
      payload.paymentMethod_id = selectedCard;
    }
    if (isCouponApplied && couponCode.trim()) {
      payload.coupon = couponCode.trim();
    }

    return paymentRepo.createSubscription(payload);
  };

  const {
    mutate: confirmPayment,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: onConfirmPayment,
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setSubscribed(true));
      router.replace("/(root)/(tabs)/profile/plan-details");
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (isError) {
      console.error("Payment failed:", error);
      setErrorMessage(`Payment failed: ${error}`);
    }
  }, [isError, error]);

  const openPaymentSheet = async () => {
    const { error: sheetError } = await presentPaymentSheet();
    if (sheetError) {
      console.error("Payment sheet error:", sheetError);
    } else {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    }
  };

  useEffect(() => {
    const paymentProcess = async (res: {
      data?: {
        setupIntent: string;
        customer: string;
        ephemeralKeys: string;
      };
    }) => {
      try {
        const { setupIntent, customer, ephemeralKeys } = res?.data ?? {};
        if (!setupIntent || !customer || !ephemeralKeys) {
          console.error("Missing customer data in buyerResponse:", res);
          return;
        }
        const { error: initError } = await initPaymentSheet({
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKeys,
          setupIntentClientSecret: setupIntent,
          merchantDisplayName: "Comgari",
        });
        if (initError) {
          console.error("Payment sheet initialization error:", initError);
        } else {
          openPaymentSheet();
        }
      } catch (e) {
        console.error("Payment process error:", e);
      }
    };

    if (buyerResponse) {
      paymentProcess(buyerResponse);
    }
  }, [buyerResponse, initPaymentSheet]);

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
      showErrorAlert(
        "You have entered a coupon code but not applied it yet. Please apply it first or remove the coupon code.",
      );
      return;
    }

    confirmPayment();
  };

  if (!cards || !subscriptions) {
    return <SimpleActivityIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
        <View className="items-center">
          <Text className="text-grey-100 text-sm sm:text-base font-ManropeRegular mt-3 text-center px-2">
            {isFree
              ? "This plan is free for you!"
              : "Choose a saved card or add a new one below."}
          </Text>
        </View>

        <View className="my-3 px-4">
          {errorMessage && (
            <Text className="text-red text-center">{errorMessage}</Text>
          )}
        </View>

        {buyerLoading ? (
          <View className="items-center justify-center my-4">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-2">Preparing payment system...</Text>
          </View>
        ) : null}

        {buyerError ? (
          <View className="items-center justify-center my-4 p-3 bg-red-50 rounded-md">
            <Text className="text-red-500">
              Error initializing payment system. Please try again.
            </Text>
          </View>
        ) : null}

        <View className="mt-4">
          <Text className="text-dark-100 text-sm font-ManropeMedium mb-1">
            Have a coupon code?
          </Text>
          <View
            className="flex-row items-center border border-gray-100 rounded-xl overflow-hidden pl-3 pr-2"
            style={{ minHeight: 52 }}
          >
            <TextInput
              className="flex-1 text-sm text-dark-100"
              placeholder="Enter coupon code"
              placeholderTextColor="#9CA3AF"
              value={couponCode}
              onChangeText={setCouponCode}
              underlineColorAndroid="transparent"
              style={{
                height: 52,
                paddingVertical: Platform.OS === "ios" ? 14 : 12,
                paddingRight: 8,
                marginVertical: 0,
              }}
            />
            <CustomButton
              title="Apply"
              onPress={() => ValidateCoupon(couponCode)}
              gradientStyle={{ height: 48, borderRadius: 10, width: 150 }}
              style={{ width: 72, flexShrink: 0 }}
            />
          </View>
          {isCouponApplied && (
            <Text className="text-green-500 text-sm mt-2">
              Coupon applied successfully{" "}
              {isFree
                ? "(100% discount)"
                : couponData?.type === DiscountType.PERCENTAGE
                  ? `${couponData?.value}% off`
                  : couponData
                    ? `$${couponData.value} off`
                    : ""}
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
            enabled={Boolean(
              isFree || selectedCard || (couponCode && isCouponApplied),
            )}
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
    </SafeAreaView>
  );
}
