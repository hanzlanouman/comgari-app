import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import { sentanceCase } from "@/utils";
import { UNITS } from "@/constants";

interface PlanCardProps {
    plan: string;
    shcedule: string;
    price: number;
    members: number;
    clients: number;
    isSelected: boolean;
    onPress?: () => void;
}

const PlanCardPro: React.FC<PlanCardProps> = ({
    plan,
    shcedule,
    price,
    members,
    clients,
    isSelected,
    onPress
}) => {
    return (
        <TouchableOpacity onPress={onPress} className="mt-4 rounded-[20]">
            {isSelected ? (
                <LinearGradient
                    colors={["#1C78B9", "#4B4C9E"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    className="rounded-[20] p-4 border border-white"
                >
                    {renderCardContent(plan, shcedule, price, members, clients, true)}
                </LinearGradient>
            ) : (
                <View className="border border-light bg-white rounded-[20] p-4">
                    {renderCardContent(plan, shcedule, price, members, clients, false)}
                </View>
            )}
        </TouchableOpacity>
    );
};

const renderCardContent = (
    plan: string,
    shcedule: string,
    price: number,
    members: number,
    clients: number,
    isSelected: boolean
) => (
    <View>
        <View className="flex-row items-center justify-between">
            <Text
                className={`text-lg sm:text-xl font-ManropeBold ${isSelected ? "text-white" : "text-dark"}`}
            >
                {plan}
            </Text>
        </View>
        <Text
            className={`text-base sm:text-lg font-ManropeSemibold mt-2.5 ${isSelected ? "text-white" : "text-blue"}`}
        >
            {UNITS.CURRENCY}{price}/{sentanceCase(shcedule)}
        </Text>
        <View className="flex-row items-center justify-between mt-4 -mx-2">
            <View className="flex-row items-center px-2" style={{ width: "50%" }}>
                <View
                    className={`flex-row items-center justify-center rounded-full ${isSelected ? "bg-white" : "bg-purple"}`}
                    style={{ width: 20, height: 20 }}
                >
                    <Check color={isSelected ? "#1B78B9" : "#ffffff"} size={14} />
                </View>
                <Text
                    className={`text-sm sm:text-base font-ManropeMedium ml-1.5 ${isSelected ? "text-white" : "text-dark"}`}
                >
                    {members === -1 ? "Unlimited" : members} Members
                </Text>
            </View>
            <View className="flex-row items-center px-2" style={{ width: "50%" }}>
                <View
                    className={`flex-row items-center justify-center rounded-full ${isSelected ? "bg-white" : "bg-purple"}`}
                    style={{ width: 20, height: 20 }}
                >
                    <Check color={isSelected ? "#1B78B9" : "#ffffff"} size={14} />
                </View>
                <Text
                    className={`text-sm sm:text-base font-ManropeMedium ml-1.5 ${isSelected ? "text-white" : "text-dark"}`}
                >
                    {clients === -1 ? "Unlimited" : clients} Clients
                </Text>
            </View>
        </View>
    </View>
);

export default PlanCardPro;