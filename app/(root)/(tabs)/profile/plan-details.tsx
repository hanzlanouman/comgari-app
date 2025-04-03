import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ComfimationModelWithTrigger, ProgressBar } from "@/common/components";
import { OctagonAlert } from "lucide-react-native";
import CustomButton from "@/common/components/CustomButton";
import { router, useFocusEffect } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { PaymentRepository } from "@/repositories/payment/payment";
import { differenceInDays, format } from "date-fns";
import { getDaysSinceStart, getRemainingDaysAndTotal } from "@/utils";
import { useAppDispatch } from "@/hooks/redux";
import { setSubscribed } from "@/store";
import { useRedirectIfIOS } from "@/hooks/use-redirect-if-IOS";
import { useCallback } from "react";
const paymentRepo = PaymentRepository.getInstance()

const SubscribedPlanDetails = () => {
    useRedirectIfIOS();
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()

    const cancelSubscriptionMutation = useMutation({
        mutationFn: async () => {
            return await paymentRepo.cancelSubscription()
        },
        onSuccess: () => {
            refetch();
            queryClient.invalidateQueries(['subscription'])
            dispatch(setSubscribed(false))
        }
    })

    const { data: currentPlan, refetch, isLoading } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const response = await paymentRepo.getAgencySubscription()
            console.log(response,"Agency Subscription Plan")
            return response.data[0]
        }
    })

    useFocusEffect(
        useCallback(() => {
            
            refetch();
            console.log("Refetching subscription data on focus");
        }, [refetch])
    );

    const daysSince = currentPlan?.createdAt ? getDaysSinceStart(currentPlan?.createdAt) : 0
    const totalTrialDays = currentPlan?.avaliableTrails || 7
    const remainingTrialDays = totalTrialDays - daysSince
    const remainingPercent = remainingTrialDays / totalTrialDays * 100
    const isFreeTrial = currentPlan?.is_trial || false
    const expiryDate = currentPlan?.ExpiryDate ? format(currentPlan?.ExpiryDate, 'MMM dd, yyyy') : ''
    const differnceInDays = currentPlan ? differenceInDays(currentPlan?.ExpiryDate, new Date()) : 0
    const totalDays = currentPlan ? getRemainingDaysAndTotal(currentPlan?.createdAt, currentPlan?.ExpiryDate) : 0

    const handleUpgradePlan = () => {
        router.push('/(root)/(tabs)/profile/plans')
    }

    return (
        <ScrollView className="p-6">
            {isFreeTrial && (
                <View>
                    <Text className="mt-4 text-xl sm:text-2xl leading-[1] font-ManropeBold font-bold text-black mb-2">
                        You're on a Free Trial
                    </Text>

                    <Text className="text-sm font-ManropeSemibold text-dark-100 mb-2">
                        Welcome to your {totalTrialDays}-day free trial! Your first payment for the {currentPlan?.subscriptionPlan} will be
                        processed after the trial period.
                    </Text>

                    <View className="mb-6">
                        <Text className="text-sm  font-ManropeSemibold font-semibold text-dark-100 mb-3">
                            {remainingTrialDays}/{totalTrialDays} days
                        </Text>
                        <ProgressBar progress={remainingPercent} />
                        <Text className="text-sm font-ManropeRegular font-normal text-dark-100 mt-3">
                            Your free trial ends in {remainingTrialDays} days!
                        </Text>
                    </View>
                    <View className="mb-4">
                        <CustomButton title="Upgrade Plan" onPress={handleUpgradePlan} />
                    </View>
                    <View className="mb-5">
                        <ComfimationModelWithTrigger
                            Button={({ onPress }) => (
                                <TouchableOpacity onPress={onPress} className="bg-red w-full h-[52px] rounded-xl pb-0.5 flex flex-row justify-center items-center">
                                    <Text className="text-sm sm:text-base font-ManropeSemibold text-white">
                                        Cancel Free Trial
                                    </Text>
                                </TouchableOpacity>
                            )}
                            message="Are you sure you want to cancel your subscription?"
                            onConfirm={() => cancelSubscriptionMutation.mutate()}
                        />

                    </View>
                </View>
            )}
            {!isFreeTrial && currentPlan && (
                <View>
                    <Text className="text-xl sm:text-2xl leading-[1] font-ManropeBold font-bold text-black mb-2">
                        Your Current Plan is {currentPlan?.subscriptionPlan}
                    </Text>
                    <View className="mb-6">
                        <Text className="text-sm  font-ManropeSemibold font-bold text-dark-100 mb-2">
                            Active until {expiryDate}
                        </Text>
                        <Text className="text-sm font-ManropeRegular font-normal text-dark-100">
                            We will send you a notification upon Subscription expiration
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm  font-ManropeSemibold font-semibold text-dark-100 mb-3">
                            {daysSince}/{totalDays} days
                        </Text>
                        <ProgressBar progress={daysSince / totalDays * 100} />
                        <Text className="text-sm font-ManropeRegular font-normal text-dark-100 mt-3">
                            Your subscription renews in {differnceInDays} days!
                        </Text>
                    </View>

                    <View className="mb-6">
                        <View className="flex-row items-center mb-2 gap-2">
                            <Text className="text-sm  font-ManropeSemibold font-bold text-dark-100">
                                ${currentPlan?.subscriptionPrice} Per {currentPlan?.PaymentSchedule}{" "}
                            </Text>
                            <Text className="text-sm rounded-md p-1 bg-[#494E9F]/20 font-ManropeRegular font-normal text-[#494E9F]">
                                Most Popular
                            </Text>
                        </View>
                        <Text className="text-sm font-ManropeRegular font-normal text-dark-100">
                            {currentPlan?.description || ""}
                        </Text>
                    </View>

                    {differnceInDays < 10 && <View className="mb-4">
                        <View className="p-3 bg-orange-100 rounded-md items-center flex-row">
                            <View className="p-2 h-11 w-11 flex items-center justify-center bg-orange-500 rounded-md">
                                <OctagonAlert color="white" />
                            </View>
                            <View className="flex-1 ml-2">
                                <Text className="text-sm font-ManropeRegular font-normal text-orange-500 ">
                                    Your subscription renews soon! Upgrade now.
                                </Text>
                            </View>
                        </View>
                    </View>}
                    <View className="mb-4">
                        <CustomButton title="Upgrade Plan" onPress={handleUpgradePlan} />
                    </View>
                    <View className="mb-5">
                        <ComfimationModelWithTrigger
                            Button={({ onPress }) => (
                                <TouchableOpacity onPress={onPress} className="bg-red w-full h-[52px] rounded-xl pb-0.5 flex flex-row justify-center items-center">
                                    <Text className="text-sm sm:text-base font-ManropeSemibold text-white">
                                        Cancel Plan
                                    </Text>
                                </TouchableOpacity>
                            )}
                            message="Are you sure you want to cancel your subscription?"
                            onConfirm={() => cancelSubscriptionMutation.mutate()}
                        />
                    </View>
                </View>
            )}
            {!currentPlan && !isLoading && (
                <View>
                    <Text className="text-xl sm:text-2xl leading-[1] font-ManropeBold font-bold text-black mb-2">
                        You don't have any active subscription
                    </Text>
                    <Text className="text-sm font-ManropeRegular font-normal text-dark-100 mb-2">
                        Please select a plan to continue using Comgari
                    </Text>
                    <View className="mb-4">
                        <CustomButton title="Select Plan" onPress={handleUpgradePlan} />
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

export default SubscribedPlanDetails;