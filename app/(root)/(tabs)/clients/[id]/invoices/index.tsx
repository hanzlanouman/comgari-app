import React, { useState } from "react";
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
import { ChevronDown, ChevronUp, Download } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import { CustomButton } from "@/common/components";
import { images } from "@/constants";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {  Platform } from 'react-native';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

// Create HTML template for the invoice PDF
const createInvoiceTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 40px;
            color: #1C1C1C;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .invoice-number {
            color: #1B78B9;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #E5E5E5;
          }
          .label {
            color: #666;
          }
          .value {
            font-weight: 500;
          }
          .amount {
            font-size: 20px;
            color: #1B78B9;
            font-weight: bold;
          }
          .status-paid {
            color: #22C55E;
          }
          .status-pending {
            color: #EAB308;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="invoice-title">${data.job_name}</div>
          <div class="invoice-number">Invoice #${data.invoiceNumber}</div>
          <div>Date: ${formatDate(data.date)}</div>
        </div>

        <div class="info-row">
          <span class="label">Status:</span>
          <span class="value ${data.status.toLowerCase() === 'paid' ? 'status-paid' : 'status-pending'}">
            ${data.status}
          </span>
        </div>
        
        <div class="info-row">
          <span class="label">Total Amount:</span>
          <span class="value amount">€${Number(data.total_amount).toFixed(2)}</span>
        </div>
      </body>
    </html>
  `;
};
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
};

const InvoicesScreen = () => {
  const { id: projectId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await clientRepo.getInvoices(Number(projectId));
      const fetchedInvoices = response.data || [];
      const sortedInvoices = fetchedInvoices.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setInvoices(sortedInvoices);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to fetch invoices"
      );
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleEditInvoice = (invoice: Invoice) => {
    router.push({
      pathname: "/(root)/clients/[id]/invoices/add-invoice",
      params: {
        mode: "edit",
        job_name: invoice.job_name,
        total_amount: invoice.total_amount,
        status: invoice.status,
        date: invoice.date,
        invoiceId: invoice.id,
        id: projectId,
      },
    });
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    try {
      await clientRepo.deleteInvoice(invoiceId);
      await fetchInvoices();
      Alert.alert("Success", "Invoice deleted successfully");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to delete invoice"
      );
    }
  };
// Generate PDF function
const generateInvoicePDF = async (invoiceData) => {
  try {
    const html = createInvoiceTemplate(invoiceData);
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });
    return uri;
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw new Error('Failed to generate invoice PDF');
  }
};

const handleDownloadInvoice = async (invoice) => {
  try {
    const uri = await generateInvoicePDF(invoice);
    if (!uri) return;

    // For iOS use sharing
    if (Platform.OS === 'ios') {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Proposal',
          UTI: 'com.adobe.pdf'
        });
        return;
      }
    }

    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        
    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, { 
        encoding: FileSystem.EncodingType.Base64 
      });
      
      const fileName = `invoice_${Date.now()}.pdf`;
      const mimeType = 'application/pdf';

      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri, 
        fileName, 
        mimeType
      ).then(async (newUri) => {
        await FileSystem.writeAsStringAsync(newUri, base64, { 
          encoding: FileSystem.EncodingType.Base64 
        });
        Alert.alert('Success', 'Invoice saved successfully!');
      });
    } else {
      await Sharing.shareAsync(uri);
    }

  } catch (error) {
    console.error('Error downloading invoice:', error);
    Alert.alert('Error', 'Failed to download invoice. Please try again.');
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
        <View className="flex-row items-center justify-between p-2.5 pr-6  ">
          <View className="flex-row items-center">
            <View className="w-11 h-11 rounded-full bg-blue-200 flex-row items-center justify-center">
              <Image
                source={images.invoice}
                resizeMode="cover"
                className="w-[24px] h-[28px]"
              />
            </View>
            <View className="pl-4 flex-1 pr-4">
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
          {/* Invoice Details */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-dark-100 font-ManropeRegular">
                Invoice Number
              </Text>
              <Text className="text-base text-dark font-ManropeMedium">
                {invoice.invoiceNumber}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDownloadInvoice(invoice)}
              className="p-2">
              <Download size={23} className="text-blue" />
            </TouchableOpacity>
          </View>
            <View className="mt-2.5">
              <Text className="text-sm text-dark-100 font-ManropeRegular">
                Created
              </Text>
              <Text className="text-base text-dark font-ManropeMedium">
                {formatDate(invoice.createdAt)}
              </Text>
            </View>
            <View className="mt-2.5">
              <Text className="text-sm text-dark-100 font-ManropeRegular">
                Due Date
              </Text>
              <Text className="text-base text-dark font-ManropeMedium">
                {formatDate(invoice.date)}
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

          <View className="flex-row justify-center items-center mt-4 space-x-4">
            <View className="flex-1 ">
              <CustomButton
                title="Edit"
                onPress={() => handleEditInvoice(invoice)}
              />
            </View>
            <View className="flex-1">
              <CustomButton
                title="Delete"
                onPress={() => handleDeleteInvoice(invoice.id)}
                className="bg-red"
              />
            </View>
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
              className={`flex-1 items-center justify-center py-2 rounded-full ${activeTab === tab ? "bg-white shadow-md" : "bg-transparent"
                }`}
            >
              <Text
                className={`text-sm sm:text-base font-ManropeSemibold ${activeTab === tab ? "text-blue" : "text-dark"
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
            <RefreshControl refreshing={isLoading} onRefresh={fetchInvoices} />
          }
          className="mt-4">
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
