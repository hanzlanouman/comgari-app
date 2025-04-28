import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
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
  const [error, setError] = useState<string | undefined>("");
  const [isError, setIsError] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      setIsError(false);
      const response = await repo.getDashboard();
      const leadConversion = response?.leadConversion?.[0] || {};
      const invoiceConversion = response?.invoiceConversion?.[0] || {};

      // Bar chart data for weekly lead conversion
      const barData = leadConversion.dailyLeads?.map((item: any) => {
        const date = new Date(item.date);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        
        return {
          value: item.leads,
          label: `${month} ${day}`,
          frontColor: item.leads > 0 ? "#63348F" : "lightgray",
          labelTextStyle: {
            color: '#333',
            fontSize: 10,
            width: 60,
            textAlign: 'center',
            marginBottom: 5
          }
        };
      });

      setDashboardData({
        barData,
        conversionRate: leadConversion.conversionRate || "0.00",
        totalLeads: leadConversion?.totalLeads || 0,
        receivedAmount: invoiceConversion.recivedAmount || 0,
        pendingAmount: invoiceConversion.pendingAmount || 0,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e:any) {
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
  );

  if (loading) {
    return <></>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer isError={isError} message={error}>
        <ScrollView>
          {/* Statistics Section */}
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
                  Total Clients
                </Text>
                <Text className="text-xl sm:text-lg text-red font-ManropeBold mt-1">
                  {dashboardData?.totalLeads}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-1/2 px-1.5 mt-3">
              <TouchableOpacity className="bg-[#FFF6E0] rounded-[16px] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Paid Invoices
                </Text>
                <Text className="text-xl sm:text-lg text-yellow font-ManropeBold mt-1">
                  {UNITS.CURRENCY}
                  {dashboardData?.receivedAmount}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-1/2 px-1.5 mt-3">
              <TouchableOpacity className="bg-[#D0ECFF] rounded-[16px] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Unpaid Invoices
                </Text>
                <Text className="text-xl sm:text-lg text-blue font-ManropeBold mt-1">
                  {UNITS.CURRENCY}
                  {dashboardData?.pendingAmount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekly Leads Section */}
          <View className="mt-4 p-4">
            <Text className="text-sm sm:text-base text-dark font-ManropeBold">
              Weekly Leads
            </Text>
          </View>

          {dashboardData?.barData?.some((item: any) => item.value > 0) ? (
            <View className="w-full mt-4 px-2 mb-10">
              <BarChart
                barWidth={18}
                spacing={28}
                noOfSections={5}
                barBorderRadius={4}
                frontColor="lightgray"
                data={dashboardData?.barData}
                yAxisThickness={0}
                xAxisThickness={0}
                width={screenWidth - 20}
                stepValue={1}
                roundToDigits={0}
                yAxisLabelWidth={30}
                formatYLabel={(label: string) => Math.round(Number(label)).toString()}
                xAxisLabelTextStyle={{
                  fontSize: 10,
                  color: "#333",
                  textAlign: "center",
                  width: 60,
                  marginBottom: 10
                }}
              />
            </View>
          ) : (
            <View className="mt-4">
              <View className="flex-col items-center justify-center px-4 py-12">
                <Image
                  source={require("@/assets/icons/no-data.png")}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
                <Text className="text-lg font-ManropeSemibold text-dark text-center px-4 mt-4">
                  No data available for graph
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </AppContainer>
    </SafeAreaView>
  );
};

export default Home;