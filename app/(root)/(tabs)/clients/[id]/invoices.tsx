import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { images } from "@/constants";
import { ChevronDown, ChevronUp } from "lucide-react-native";

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const toggleDetailVisibility = () => {
    setIsDetailVisible(!isDetailVisible);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 p-4">
          {/* Tabs */}
          <View className="flex flex-row items-center justify-between bg-light-50 p-1.5 rounded-xl">
            <TouchableOpacity
              onPress={() => setActiveTab("all")}
              className={`${
                activeTab === "all" ? "bg-white" : "bg-light-50"
              } w-1/3 rounded-lg p-2 sm:p-3`}>
              <Text
                className={`text-center text-sm sm:text-base font-ManropeSemibold ${
                  activeTab === "all" ? "text-blue" : "text-dark"
                }`}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("paid")}
              className={`${
                activeTab === "paid" ? "bg-white" : "bg-light-50"
              } w-1/3 rounded-lg p-2 sm:p-3`}>
              <Text
                className={`text-center text-sm sm:text-base font-ManropeSemibold ${
                  activeTab === "paid" ? "text-blue" : "text-dark"
                }`}>
                Paid
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("open")}
              className={`${
                activeTab === "open" ? "bg-white" : "bg-light-50"
              } w-1/3 rounded-lg p-2 sm:p-3`}>
              <Text
                className={`text-center text-sm sm:text-base font-ManropeSemibold ${
                  activeTab === "open" ? "text-blue" : "text-dark"
                }`}>
                Open
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            {activeTab === "all" ? (
              <View className="border border-light rounded-xl mt-4">
                {/* Toggle Button */}
                <TouchableOpacity onPress={toggleDetailVisibility}>
                  <View className="flex-row items-center justify-between p-2.5 pr-6">
                    <View className="flex-row items-center">
                      <View className="w-11 h-11 rounded-full bg-blue-200 flex-row items-center justify-center">
                        <Image
                          source={images.invoice}
                          resizeMode="cover"
                          className="w-[24px] h-[28px]"
                        />
                      </View>
                      <View className="pl-2.5 flex-1 pr-4">
                        <Text
                          className="text-base sm:text-base font-ManropeSemibold text-dark"
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          Invoice Name
                        </Text>
                        <Text className="text-sm sm:text-base font-ManropeSemibold text-blue">
                          €500.00
                        </Text>
                      </View>
                    </View>
                    {isDetailVisible ? (
                      <ChevronUp size={18} className="text-dark-100" />
                    ) : (
                      <ChevronDown size={18} className="text-dark-100" />
                    )}
                  </View>
                </TouchableOpacity>
                {isDetailVisible && (
                  <View className="border-t border-light p-2.5">
                    <View>
                      <Text className="text-sm text-dark-100 font-ManropeRegular">
                        Invoice Number
                      </Text>
                      <Text className="text-base text-dark font-ManropeMedium">
                        INV093849-233-09
                      </Text>
                    </View>
                    <View className="mt-2.5">
                      <Text className="text-sm text-dark-100 font-ManropeRegular">
                        Status
                      </Text>
                      <View className="bg-green-100 rounded-full px-3 pt-0.5 pb-1 mt-1.5 self-start">
                        <Text className="text-base text-green font-ManropeMedium">
                          Paid
                        </Text>
                      </View>
                    </View>
                    <View className="mt-2.5">
                      <Text className="text-sm text-dark-100 font-ManropeRegular">
                        Created
                      </Text>
                      <Text className="text-base text-dark font-ManropeMedium">
                        Oct 18 2024
                      </Text>
                    </View>
                    <View className="mt-2.5">
                      <Text className="text-sm text-dark-100 font-ManropeRegular">
                        Due Date
                      </Text>
                      <Text className="text-base text-dark font-ManropeMedium">
                        Oct 18 2024
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : activeTab === "paid" ? (
              <Text>Paid</Text>
            ) : (
              <Text>Open</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invoices;
