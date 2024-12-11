import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { images } from "@/constants";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";

const clientRepo = ClientRepository.getInstance();

type Invoice = {
  id: number;
  invoiceNumber: string;
  job_name: string;
  client_id: number;
  date: string;
  total_amount: string;
  status: string;
  project_id: number;
  createdAt: string;
  updatedAt: string;
  client: {
    id: number;
    name: string;
    description: string;
    logo: string;
    type: string;
    status: string;
    email: string;
    phone: string;
    brief: null | string;
    createdById: number;
    agencyId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
  };
};

const InvoicesScreen = () => {
  const { id: projectId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await clientRepo.getInvoices(Number(projectId));
      setInvoices(response.data || []);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to fetch invoices"
      );
    } finally {
      setIsLoading(false);
    }
  };

useFocusEffect(
  React.useCallback(() => {
    fetchInvoices();
  }, [projectId])
);

  const toggleInvoiceDetails = (invoiceId: number) => {
    setExpandedInvoiceId(expandedInvoiceId === invoiceId ? null : invoiceId);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true;
    if (activeTab === "paid") return invoice.status.toLowerCase() === "paid";
    return invoice.status.toLowerCase() !== "paid";
  });


  const renderInvoiceItem = (invoice: Invoice) => (
    <View key={invoice.id} className="border border-light rounded-xl mt-4">
      <TouchableOpacity onPress={() => toggleInvoiceDetails(invoice.id)}>
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
                className="text-base font-ManropeSemibold text-dark"
                numberOfLines={1}
                ellipsizeMode="tail">
                {invoice.job_name}
              </Text>
              <Text className="text-sm font-ManropeSemibold text-blue">
                €{Number(invoice.total_amount).toFixed(2)}
              </Text>
            </View>
          </View>
          {expandedInvoiceId === invoice.id ? (
            <ChevronUp size={18} className="text-dark-100" />
          ) : (
            <ChevronDown size={18} className="text-dark-100" />
          )}
        </View>
      </TouchableOpacity>
      {expandedInvoiceId === invoice.id && (
        <View className="border-t border-light p-2.5">
          <View>
            <Text className="text-sm text-dark-100 font-ManropeRegular">
              Invoice Number
            </Text>
            <Text className="text-base text-dark font-ManropeMedium">
              {invoice.invoiceNumber}
            </Text>
          </View>
          <View className="mt-2.5">
            <Text className="text-sm text-dark-100 font-ManropeRegular">
              Status
            </Text>
            <View
              className={`rounded-full px-3 pt-0.5 pb-1 mt-1.5 self-start ${invoice.status === "PAID"
                  ? "bg-green-100"
                  : "bg-yellow-100"
                }`}>
              <Text
                className={`text-base font-ManropeMedium ${invoice.status === "PAID"
                    ? "text-green"
                    : "text-yellow-600"
                  }`}>
                {invoice.status}
              </Text>
            </View>
          </View>
          <View className="mt-2.5">
            <Text className="text-sm text-dark-100 font-ManropeRegular">
              Created
            </Text>
            <Text className="text-base text-dark font-ManropeMedium">
              {new Date(invoice.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View className="mt-2.5">
            <Text className="text-sm text-dark-100 font-ManropeRegular">
              Due Date
            </Text>
            <Text className="text-base text-dark font-ManropeMedium">
              {new Date(invoice.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
<SafeAreaView className="flex-1 bg-white">
  <View className="flex-1 p-4">
    {/* Tabs */}
    <View className="flex flex-row bg-gray-100 rounded-full p-1 shadow-sm">
      {["all", "paid", "open"].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          className={`flex-1 items-center justify-center py-2 rounded-full ${
            activeTab === tab ? "bg-white shadow-md" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-sm sm:text-base font-ManropeSemibold ${
              activeTab === tab ? "text-blue" : "text-dark"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Scrollable Content */}
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchInvoices}
        />
      }
      className="mt-4"
    >
      {filteredInvoices.length === 0 ? (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500 text-base font-ManropeRegular">
            No invoices found
          </Text>
        </View>
      ) : (
        filteredInvoices.map(renderInvoiceItem)
      )}
    </ScrollView>
  </View>
</SafeAreaView>

  );
};

export default InvoicesScreen;