import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { MemberRepository } from "@/repositories/member/member";

const Home = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      const repo = MemberRepository.getInstance();
      const response = await repo.getDashboard();

      // Extract and transform the data for bar chart
      const leadConversion = response?.data?.leadConversion || [];
      const barData = leadConversion.map((item: any, index: number) => ({
        value: parseFloat(item.conversionRate) || 0,
        label: `Week ${index + 1}`,
        frontColor: index % 2 === 0 ? "#63348F" : "lightgray",
      }));

      setDashboardData({
        barData,
        conversionRate:
          leadConversion.length > 0
            ? parseFloat(leadConversion[0].conversionRate).toFixed(2)
            : "0.00",
      });
    } catch (error) {
      Alert.alert("Error", error?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#63348F" />
      </SafeAreaView>
    );
  }

  if (!dashboardData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-dark font-ManropeBold">No data available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
        <View className="flex-row flex-wrap -mx-1.5">
          <View className="w-1/2 px-1.5 mt-3">
            <TouchableOpacity className="bg-[#E8FDF5] rounded-[16px] p-3">
              <Text className="text-xs text-dark font-ManropeMedium">
                Lead Conversion Rate
              </Text>
              <Text className="text-xl sm:text-lg text-green font-ManropeBold mt-1">
                {dashboardData.conversionRate}%
              </Text>
              <Text className="text-xs text-dark-100 font-ManropeMedium mt-1">
                Since last week
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-1/2 px-1.5 mt-3">
            <TouchableOpacity className="bg-[#FFF1ED] rounded-[16px] p-3">
              <Text className="text-xs text-dark font-ManropeMedium">
                Revenue Tracking
              </Text>
              <Text className="text-xl sm:text-lg text-red font-ManropeBold mt-1">
                €10,00
              </Text>
              <Text className="text-xs text-dark-100 font-ManropeMedium mt-1">
                Since last week
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-1/2 px-1.5 mt-3">
            <TouchableOpacity className="bg-[#FFF6E0] rounded-[16px] p-3">
              <Text className="text-xs text-dark font-ManropeMedium">
                Sales Performance
              </Text>
              <Text className="text-xl sm:text-lg text-yellow font-ManropeBold mt-1">
                €10,00
              </Text>
              <Text className="text-xs text-dark-100 font-ManropeMedium mt-1">
                Since last week
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-1/2 px-1.5 mt-3">
            <TouchableOpacity className="bg-[#D0ECFF] rounded-[16px] p-3">
              <Text className="text-xs text-dark font-ManropeMedium">
                Payment Collection Rate
              </Text>
              <Text className="text-xl sm:text-lg text-blue font-ManropeBold mt-1">
                €10,00
              </Text>
              <Text className="text-xs text-dark-100 font-ManropeMedium mt-1">
                Since last week
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-4">
          <Text className="text-sm sm:text-base text-dark font-ManropeBold">
            Lead Conversion Rate
          </Text>
          <View className="w-full mt-4">
            <BarChart
              barWidth={12}
              adjustToWidth={true}
              barBorderWidth={0}
              barBorderRadius={4}
              frontColor="lightgray"
              data={dashboardData.barData}
              yAxisThickness={0}
              xAxisThickness={0}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
