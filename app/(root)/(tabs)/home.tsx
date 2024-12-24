import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

const Home = () => {
  const barData = [
    { value: 50, label: "50" },
    { value: 100, label: "100", frontColor: "#63348F" },
    { value: 150, label: "150", frontColor: "#63348F" },
    { value: 200, label: "200" },
    { value: 250, label: "250", frontColor: "#63348F" },
    { value: 300, label: "300" },
    { value: 350, label: "350" },
  ];

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
                68.95%
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
              data={barData}
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
