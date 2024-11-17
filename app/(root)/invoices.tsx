import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 p-4">
          <View className="flex flex-row items-center justify-between bg-light-50 p-1.5 rounded-xl">
            <TouchableOpacity
              onPress={() => setActiveTab("all")}
              className={`${activeTab === "all" ? "bg-white" : "bg-light-50"} w-1/3 rounded-lg p-2 sm:p-3`}
            >
              <Text
                className={`text-center text-sm sm:text-base font-ManropeSemibold ${activeTab === "all" ? "text-blue" : "text-dark"}`}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("paid")}
              className={`${activeTab === "paid" ? "bg-white" : "bg-light-50"} w-1/3 rounded-lg p-2 sm:p-3`}
            >
              <Text
                className={`text-center text-sm sm:text-base font-ManropeSemibold ${activeTab === "paid" ? "text-blue" : "text-dark"}`}
              >
                Paid
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("open")}
              className={`${activeTab === "open" ? "bg-white" : "bg-light-50"} w-1/3 rounded-lg p-2 sm:p-3`}
            >
              <Text
                className={`text-center text-sm sm:text-base font-ManropeSemibold ${activeTab === "open" ? "text-blue" : "text-dark"}`}
              >
                Open
              </Text>
            </TouchableOpacity>
          </View>
          <View className="">
            {activeTab === "all" ? (
              <View className="flex-row items-center justify-between border border-light rounded-xl p-2.5 mt-4">
                <View className="w-11 h-11 rounded-full bg-blue-200 flex-row items-center justify-center">
                  <Image src={images.invoice} />
                </View>
              </View>
            ) : activeTab === "paid" ? (
              <Text>Paid</Text>
            ) : (
              <Text>open</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invoices;
