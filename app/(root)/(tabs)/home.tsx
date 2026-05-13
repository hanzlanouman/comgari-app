import React, { useCallback, useState, useEffect } from "react";
import {
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
import { SafeAreaView } from "react-native-safe-area-context";
import { TrialStartModal } from "@/common/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const repo = MemberRepository.getInstance();

type Period = "today" | "week" | "month" | "year";

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

function getDateRange(period: Period): { startDate: string; endDate: string } {
  const now = new Date();
  const end = now.toISOString();
  let start: Date;
  switch (period) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      start = new Date(now);
      start.setDate(now.getDate() - 6);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
  }
  return { startDate: start.toISOString(), endDate: end };
}

const Home = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>("");
  const [isError, setIsError] = useState(false);
  const [isTrialModalVisible, setIsTrialModalVisible] = useState(false);

  const [period, setPeriod] = useState<Period>("week");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  useEffect(() => {
    const checkTrialModal = async () => {
      try {
        const shouldShow = await AsyncStorage.getItem("showTrialStartModal");
        if (shouldShow === "true") {
          setIsTrialModalVisible(true);
          await AsyncStorage.removeItem("showTrialStartModal");
        }
      } catch {}
    };
    checkTrialModal();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkTrialModal = async () => {
        try {
          const shouldShow = await AsyncStorage.getItem("showTrialStartModal");
          if (shouldShow === "true") {
            setIsTrialModalVisible(true);
            await AsyncStorage.removeItem("showTrialStartModal");
          }
        } catch {}
      };
      checkTrialModal();
    }, [])
  );

  const fetchDashboardData = async (p: Period = period) => {
    try {
      setLoading(true);
      setError("");
      setIsError(false);
      const { startDate, endDate } = getDateRange(p);
      const response = await repo.getDashboard({ startDate, endDate });
      const leadConversion = response?.leadConversion?.[0] || {};
      const invoiceConversion = response?.invoiceConversion?.[0] || {};

      const barData = leadConversion.dailyLeads?.map((item: any) => {
        const date = new Date(item.date);
        const month = date.toLocaleString("default", { month: "short" });
        const day = date.getDate();
        return {
          value: item.leads,
          label: `${month} ${day}`,
          frontColor: item.leads > 0 ? "#63348F" : "lightgray",
          dataPointColor: "#63348F",
          labelTextStyle: {
            color: "#333",
            fontSize: 10,
            width: 60,
            textAlign: "center" as const,
            marginBottom: 5,
          },
        };
      }) ?? [];

      setDashboardData({
        barData,
        conversionRate: leadConversion.conversionRate || "0.00",
        totalLeads: leadConversion?.totalLeads || 0,
        receivedAmount: invoiceConversion.recivedAmount || 0,
        pendingAmount: invoiceConversion.pendingAmount || 0,
      });
    } catch {
      setIsError(true);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData(period);
    }, [period])
  );

  const hasChartData = dashboardData?.barData?.some((item: any) => item.value > 0);

  if (loading && !dashboardData) return <></>;

  const currentPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? "This Week";

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom", "left", "right"]}>
      <AppContainer isError={isError} message={error}>
        <ScrollView>
          {/* Business Overview Section */}
          <View className="px-4 pt-4 pb-1">
            <Text className="text-base font-ManropeBold text-dark">
              Business Overview
            </Text>
          </View>

          {/* KPI Cards: 5 cards in a 2-column wrap */}
          <View className="flex-row flex-wrap -mx-1.5 px-4 pb-2">
            <View className="px-1.5 mt-3" style={{ width: "50%" }}>
              <TouchableOpacity className="bg-[#E8FDF5] rounded-[16] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Lead Conversion Rate
                </Text>
                <Text className="text-xl text-green font-ManropeBold mt-1">
                  {dashboardData?.conversionRate}%
                </Text>
              </TouchableOpacity>
            </View>
            <View className="px-1.5 mt-3" style={{ width: "50%" }}>
              <TouchableOpacity className="bg-[#FFF1ED] rounded-[16] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Total Clients
                </Text>
                <Text className="text-xl text-red font-ManropeBold mt-1">
                  {dashboardData?.totalLeads}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="px-1.5 mt-3" style={{ width: "50%" }}>
              <TouchableOpacity className="bg-[#FFF6E0] rounded-[16] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Paid Invoices
                </Text>
                <Text className="text-xl text-yellow font-ManropeBold mt-1">
                  {UNITS.CURRENCY}{dashboardData?.receivedAmount}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="px-1.5 mt-3" style={{ width: "50%" }}>
              <TouchableOpacity className="bg-[#D0ECFF] rounded-[16] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Unpaid Invoices
                </Text>
                <Text className="text-xl text-blue font-ManropeBold mt-1">
                  {UNITS.CURRENCY}{dashboardData?.pendingAmount}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="px-1.5 mt-3" style={{ width: "50%" }}>
              <TouchableOpacity className="bg-[#EDE7F6] rounded-[16] p-3">
                <Text className="text-xs text-dark font-ManropeMedium">
                  Total Revenue
                </Text>
                <Text className="text-xl text-purple font-ManropeBold mt-1">
                  {UNITS.CURRENCY}{dashboardData?.receivedAmount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Graph Header: Period Dropdown + Bar/Line Toggle */}
          <View className="flex-row items-center justify-between px-4 mt-4">
            <Text className="text-sm font-ManropeBold text-dark">
              Weekly Leads
            </Text>
            <View className="flex-row gap-3 items-center">
              {/* Period Dropdown */}
              <View className="relative">
                <TouchableOpacity
                  className="flex-row items-center border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50"
                  onPress={() => {
                    setShowPeriodDropdown((v) => !v);
                  }}
                >
                  <Text className="text-xs font-ManropeMedium text-dark mr-1">
                    {currentPeriodLabel}
                  </Text>
                  <Text className="text-xs text-gray-400">▼</Text>
                </TouchableOpacity>
                {showPeriodDropdown && (
                  <View className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg z-50 shadow-md min-w-[110px]">
                    {PERIOD_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        className="px-4 py-2"
                        onPress={() => {
                          setPeriod(opt.value);
                          setShowPeriodDropdown(false);
                          fetchDashboardData(opt.value);
                        }}
                      >
                        <Text
                          className={`text-xs font-ManropeMedium ${
                            period === opt.value ? "text-purple" : "text-dark"
                          }`}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

            </View>
          </View>

          {/* Graph */}
          {hasChartData ? (
            <View className="mt-4 px-2 mb-4" style={{ width: "100%", height: 240, overflow: "hidden"}}>
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
                formatYLabel={(label: string) =>
                  Math.round(Number(label)).toString()
                }
                xAxisLabelTextStyle={{
                  fontSize: 10,
                  color: "#333",
                  textAlign: "center",
                  width: 60,
                  marginBottom: 10,
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
      <TrialStartModal
        visible={isTrialModalVisible}
        onClose={() => setIsTrialModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Home;
