import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { CustomButton } from "@/common/components";
import PlanCard from "@/app/(root)/(tabs)/profile/components/PlanCardPro";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { PaymentRepository } from "@/repositories/payment/payment";
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";
import { TCreateSubscriptionPayload } from "@/repositories/payment/schema";
import { TReponse } from "@/repositories/auth";

interface Subscription {
    id: string;
    name: string;
    maxMembers: number;
    maxClients: number;
    pricing: {
        price: number;
        price_id: string;
        paymentSchedule: string;
    }[];
}

interface AgencySubscriptionResponse {
    data: {
        hasSubscription: boolean;
        defaultPaymentMethod: string;
    };
}

const GoPro = () => {
    useRedirectIfIOS();
    const [activeTab, setActiveTab] = useState("monthly");
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [priceId, setPriceId] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const paymentRepo = PaymentRepository.getInstance();

    const { data: subscriptions } = useQuery<TReponse>(
        "subscription",
        async () => paymentRepo.getSubscription(),
        {
            enabled: true,
        }
    );

    const { data: agencySubscription } = useQuery<AgencySubscriptionResponse>(
        "agencySubscription",
        async () => paymentRepo.getAgencySubscription(),
        {
            enabled: true,
        }
    );

    const { mutate: upgradeSubscription, isLoading: isUpgrading } = useMutation(
        (payload: TCreateSubscriptionPayload) => paymentRepo.updateAgencySubscription(payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["subscription"]);
                
                alert("Subscription upgraded successfully!");
            },
            onError: (error) => {
                setErrorMessage(`Failed to upgrade: ${error}`);
            }
        }
    );

    const handlePress = (plan: string, price: string) => {
        setSelectedPlan(plan);
        setPriceId(price);
        setErrorMessage(null);
    };

    // Filter plans based on active tab
    const plans = subscriptions?.data?.filter((subscription: Subscription) =>
        activeTab === "monthly"
            ? subscription.pricing[0].paymentSchedule === "month"
            : subscription.pricing[0].paymentSchedule === "year"
    );

    const handleBuyNow = () => {
        if (!selectedPlan) {
            setErrorMessage("Please select a plan.");
            return;
        }

       
        if (agencySubscription?.data?.hasSubscription) {
            
            if (!priceId) {
                setErrorMessage("Invalid plan selection.");
                return;
            }
            
            const payload: TCreateSubscriptionPayload = {
                id: priceId,
                paymentMethod_id: agencySubscription.data.defaultPaymentMethod
            };
            
            upgradeSubscription(payload);
        } else {
           
            router.push({
                pathname: "/(root)/(tabs)/profile/payment-method",
                params: {
                    selectedPlanPrice: priceId,
                    isNewSubscription: "true"
                },
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
                <View className="flex-1 px-4 py-4 relative z-10">
                    <Text className="text-dark-100 text-sm sm:text-base font-ManropeRegular mt-1">
                        {agencySubscription?.data?.hasSubscription 
                            ? "Upgrade your plan to unlock more features." 
                            : "Choose a plan to unlock all of Comgari's premium features."}
                        {"\n"}
                        <Text className="text-red">Cancel</Text> at any time.
                    </Text>

                    {/* Error message display */}
                    {errorMessage && (
                        <Text className="text-red mt-2">{errorMessage}</Text>
                    )}
                    <View className="flex flex-row items-center justify-between bg-gray p-1.5 rounded-xl mt-5">
                        <TouchableOpacity
                            onPress={() => setActiveTab("monthly")}
                            className={`${activeTab === "monthly" ? "bg-white" : "bg-light-50"} w-2/4 rounded-lg p-2 sm:p-3`}>
                            <Text className="text-center text-sm sm:text-base font-ManropeSemibold">
                                Monthly
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab("yearly")}
                            className={`${activeTab === "yearly" ? "bg-white" : "bg-light-50"} w-2/4 rounded-lg p-2 sm:p-3`}>
                            <Text className="text-center text-sm sm:text-base font-ManropeSemibold">
                                Yearly
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-4">
                        {plans?.map((plan: Subscription) => {
                            return (
                                <PlanCard
                                    key={plan?.id}
                                    plan={plan?.name}
                                    shcedule={plan.pricing?.[0].paymentSchedule}
                                    price={Number(plan?.pricing[0]?.price)}
                                    members={plan?.maxMembers}
                                    clients={plan?.maxClients}
                                    isSelected={selectedPlan === plan?.name}
                                    onPress={() =>
                                        handlePress(plan?.name, plan?.pricing[0]?.price_id)
                                    }
                                />
                            );
                        })}
                    </View>

                    <View className="mt-4">
                        <CustomButton
                            title={agencySubscription?.data?.hasSubscription ? "Upgrade Plan" : "Get Started"}
                            onPress={handleBuyNow}
                            disabled={isUpgrading}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default GoPro;
