import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Ensure you have this package installed
import { Check } from "lucide-react-native";

interface PlanCardProps {
  plan: string;
  price: number;
  members: number;
  clients: number;
  isSelected: boolean;
  freetrial: number;
  onPress: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  price,
  members,
  clients,
  isSelected,
  freetrial,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} className="mt-4 rounded-[20px]">
      {isSelected ? (
        <LinearGradient
          colors={["#1C78B9", "#4B4C9E"]}
          start={[0, 0]}
          end={[1, 1]}
          className="rounded-[20px] p-4 border border-white">
          {renderCardContent(plan, price, members, clients, freetrial, true)}
        </LinearGradient>
      ) : (
        <View className="border border-light bg-white rounded-[20px] p-4">
          {renderCardContent(plan, price, members, clients, freetrial, false)}
        </View>
      )}
    </TouchableOpacity>
  );
};

const renderCardContent = (
  plan: string,
  price: number,
  members: number,
  clients: number,
  freetrial: number,
  isSelected: boolean
) => (
  <View>
    <View className="flex-row items-center justify-between">
      <Text
        className={`text-lg sm:text-xl font-ManropeBold ${isSelected ? "text-white" : "text-dark"}`}>
        {plan}
      </Text>
      <View
        className={`${isSelected ? "bg-white" : "bg-blue"} h-8 rounded-full px-3`}>
        <Text
          className={`text-sm text-center ${isSelected ? "text-blue" : "text-white"} font-ManropeSemibold leading-[30px]`}>
          {freetrial} days free trial
        </Text>
      </View>
    </View>
    <Text
      className={`text-base sm:text-lg font-ManropeSemibold mt-2.5 ${isSelected ? "text-white" : "text-blue"}`}>
      €{price}/m
    </Text>
    <View className="flex-row items-center justify-between mt-4">
      <View className="flex-row items-center w-2/4">
        <View
          className={`flex-row items-center justify-center w-5 h-5 rounded-full ${isSelected ? "bg-white" : "bg-purple"}`}>
          <Check color={isSelected ? "#1B78B9" : "#ffffff"} size={14} />
        </View>
        <Text
          className={`text-sm sm:text-base font-ManropeMedium ml-1.5 ${isSelected ? "text-white" : "text-dark"}`}>
          {members} Members
        </Text>
      </View>
      <View className="flex-row items-center w-2/4">
        <View
          className={`flex-row items-center justify-center w-5 h-5 rounded-full ${isSelected ? "bg-white" : "bg-purple"}`}>
          <Check color={isSelected ? "#1B78B9" : "#ffffff"} size={14} />
        </View>
        <Text
          className={`text-sm sm:text-base font-ManropeMedium ml-1.5 ${isSelected ? "text-white" : "text-dark"}`}>
          {clients} Clients
        </Text>
      </View>
    </View>
  </View>
);

export default PlanCard;
