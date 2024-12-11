import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import { CustomButton, InputField } from "@/common/components";
import DropdownSelect from "@/common/components/Select";
import { router, useLocalSearchParams } from "expo-router";
import * as Yup from "yup";
import { Formik } from "formik";
import { CalendarDays, Euro } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ClientRepository } from "@/repositories/client/client";

// Enum for Invoice Status
enum InvoiceStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  SENT = "SENT",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
  DISPUTED = "DISPUTED"
}

// Option Type Definition
export type OptionType = {
  key: string | any | number | boolean;
  value: string;
};

// Convert enum to dropdown options
const statusOptions: OptionType[] = Object.entries(InvoiceStatus).map(([key, value]) => ({
  key: value,
  value: key.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}));

const AddInvoiceScreen = () => {
  const { id: projectId } = useLocalSearchParams();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const clientRepo = ClientRepository.getInstance();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const initialValues = {
    job_name: "",
    total_amount: "",
    status: "",
    date: null,
  };


  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = {
        job_name: values.job_name,
        client_id: Number(projectId),
        date: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
        total_amount: values.total_amount,
        status: values.status as InvoiceStatus,
        project_id: Number(projectId)
      };

      await clientRepo.createInvoice(payload);
      Alert.alert("Success", "Invoice created successfully");
      router.push({
        pathname: "/(root)/(tabs)/clients/[id]/invoices",
        params: { id: projectId }
      });    } catch (error) {
      Alert.alert(
        "Error", 
        error instanceof Error 
          ? error.message 
          : "Failed to create invoice"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}>
        {(formik) => (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="px-4">
              <View className="mt-2.5">
                <InputField
                  // label="Job Name"
                  value={formik.values.job_name}
                  onChangeText={formik.handleChange("job_name")}
                  placeholder="Job name"
                  error={formik.touched.job_name && formik.errors.job_name}
                />
              </View>

              <TouchableOpacity
                activeOpacity={1}
                onPress={showDatePicker}
                className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative">
                <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2px]">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Select Date"}
                </Text>
                <CalendarDays size={16} className="text-dark-100" />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                  handleDateConfirm(date);
                  formik.setFieldValue("date", date);
                }}
                onCancel={hideDatePicker}
              />
              {formik.touched.date && formik.errors.date && (
                <Text className="text-red-500 text-xs mt-1">{formik.errors.date}</Text>
              )}

              <View className="mt-3 relative">
                <InputField
                  // label="Estimated Cost"
                  value={formik.values.total_amount}
                  onChangeText={formik.handleChange("total_amount")}
                  placeholder="Estimated cost"
                  keyboardType="numeric"
                  error={formik.touched.total_amount && formik.errors.total_amount}
                />
                <Euro
                  size={16}
                  className="text-dark-100 absolute top-[18px] right-4"
                />
              </View>

              <View className="mt-3">
                <DropdownSelect
                  placeholder="Status"
                  data={statusOptions}
                  selectedValue={String(formik.values.status || "")}
                  setFieldValue={(field, value) => {
                    formik.setFieldValue(field, value);
                  }}
                  error={
                    typeof formik.errors.status === "string"
                      ? formik.errors.status
                      : undefined
                  }
                  fieldName="status"
                />
              </View>
            </View>
            <View className="p-4 pb-0 bg-white mt-auto">
              <CustomButton title="Add Invoice" onPress={() => formik.handleSubmit()} />
            </View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default AddInvoiceScreen;