import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { MemberRepository } from "@/repositories/member/member";
import { AppContainer } from "@/common/components";
import { UNITS } from "@/constants";
import { useFocusEffect } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const repo = MemberRepository.getInstance();

const Home = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsError(false);
      const response = await repo.getDashboard();
      const leadConversion = response?.leadConversion?.[0] || {};
      const invoiceConversion = response?.invoiceConversion?.[0] || {};

      // Bar chart data for weekly lead conversion
      const barData = leadConversion.dailyLeads?.map((item: any) => ({
        value: item.leads,
        label: new Date(item.date).toLocaleDateString("en-US", {
          month: screenWidth > 360 ? "short" : "numeric",
          day: "numeric",
        }),
        frontColor: item.leads > 0 ? "#63348F" : "lightgray",
      }));

      setDashboardData({
        barData,
        conversionRate: leadConversion.conversionRate || "0.00",
        totalLeads: leadConversion?.totalLeads || 0,
        receivedAmount: invoiceConversion.recivedAmount || 0,
        pendingAmount: invoiceConversion.pendingAmount || 0,
      });
    } catch (_e:any) {
      setIsError(true);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  )

  if (loading) {
    return <></>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer isError={isError} message={error}>
        <ScrollView>
          <View className="flex-row flex-wrap -mx-1.5 p-4">
            <View className="w-1/2 px-1.5 mt-3">
              <TouchableOpacity className="bg-[#E8FDF5] rounded-[16px] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Lead Conversion Rate
                </Text>
                <Text className="text-xl sm:text-lg text-green font-ManropeBold mt-1">
                  {dashboardData?.conversionRate}%
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-1/2 px-1.5 mt-3">
              <TouchableOpacity className="bg-[#FFF1ED] rounded-[16px] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Total Leads
                </Text>
                <Text className="text-xl sm:text-lg text-red font-ManropeBold mt-1">
                  {dashboardData?.totalLeads}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-1/2 px-1.5 mt-3">
              <TouchableOpacity className="bg-[#FFF6E0] rounded-[16px] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Received Amount
                </Text>
                <Text className="text-xl sm:text-lg text-yellow font-ManropeBold mt-1">
                  {UNITS.CURRENCY}{dashboardData?.receivedAmount}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-1/2 px-1.5 mt-3">
              <TouchableOpacity className="bg-[#D0ECFF] rounded-[16px] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Pending Amount
                </Text>
                <Text className="text-xl sm:text-lg text-blue font-ManropeBold mt-1">
                  {UNITS.CURRENCY}{dashboardData?.pendingAmount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-4 p-4">
            <Text className="text-sm sm:text-base text-dark font-ManropeBold">
              Weekly Leads
            </Text>
          </View>
          <View className="w-full mt-4 flex-row justify-center items-center">
            <BarChart
              barWidth={25}
              adjustToWidth={true}
              barBorderWidth={0}
              barBorderRadius={4}
              frontColor="lightgray"
              data={dashboardData?.barData}
              yAxisThickness={0}
              xAxisThickness={0}
              dashWidth={10}
              width={screenWidth - 40}
            />
          </View>
        </ScrollView>
      </AppContainer>
    </SafeAreaView>
  );
};

export default Home;
