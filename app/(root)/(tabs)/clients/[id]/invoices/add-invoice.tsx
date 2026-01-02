import React, { useState } from "react";
import {
  // Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, InputField } from "@/common/components";
import DropdownSelect from "@/common/components/Select";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { CalendarDays } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ClientRepository } from "@/repositories/client/client";
import { UNITS } from "@/constants";

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};
// Enum for Invoice Status

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
}

// Option Type Definition
export type OptionType = {
  key: string | any | number | boolean;
  value: string;
};

// Convert enum to dropdown options
const statusOptions: OptionType[] = Object.entries(InvoiceStatus).map(
  ([key, value]) => ({
    key: value,
    value: key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
  })
);

const AddInvoiceScreen = () => {
  const {
    id: projectIdParam,
    mode,
    invoiceId,
    job_name: editJobName,
    total_amount: editTotalAmount,
    status: editStatus,
    date: editDate,
    clientId: clientIdParam,
  } = useLocalSearchParams();

  // Handle string | string[] | undefined from route params
  const clientIdParamResolved = Array.isArray(clientIdParam)
    ? clientIdParam[0]
    : clientIdParam;

  console.log(clientIdParamResolved, "clientIdParam");

  const projectId = Number(projectIdParam) || 0;
  const clientId = clientIdParamResolved
    ? Number(clientIdParamResolved)
    : undefined;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    editDate ? new Date(editDate as string) : null
  );
  const clientRepo = ClientRepository.getInstance();
  const isEditMode = mode === "edit";

  // if (!clientId) {
  //   return (
  //     <SafeAreaView className="flex-1 bg-white">
  //       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
  //         <View className="flex-1 items-center justify-center px-4">
  //           <Text className="text-base">Missing client information.</Text>
  //         </View>
  //       </ScrollView>
  //     </SafeAreaView>
  //   );
  // }

  const initialValues = {
    job_name: isEditMode ? (editJobName as string) : "",
    total_amount: isEditMode ? (editTotalAmount as string) : "",
    status: isEditMode ? (editStatus as string) : InvoiceStatus.DRAFT,
    date: isEditMode && editDate ? new Date(editDate as string) : null,
  };

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

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const totalAmountStr = Number(values.total_amount || 0).toFixed(2);
      const payload = {
        job_name: values.job_name,
        client_id: clientId,
        date: (selectedDate || new Date()).toISOString(),
        total_amount: totalAmountStr,
        status: (values.status || InvoiceStatus.DRAFT) as InvoiceStatus,
        project_id: projectId,
      } as any;

      if (isEditMode && invoiceId) {
        // Update existing invoice
        await clientRepo.updateInvoice(Number(invoiceId), payload);
        Alert.alert("Success", "Invoice updated successfully");
      } else {
        // Create new invoice
        await clientRepo.createInvoice(payload);
        Alert.alert("Success", "Invoice created successfully");
      }

      // Navigate back to invoices screen
      const backParams: { id: string; clientId?: string } = {
        id: String(projectId),
      };

      if (clientIdParamResolved) {
        backParams.clientId = String(clientIdParamResolved);
      }

      router.replace({
        pathname: "/(root)/(tabs)/clients/[id]/invoices",
        params: backParams,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to " + (isEditMode ? "update" : "create") + " invoice"
      );
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative"
              >
                <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2]">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Select Date"}
                </Text>
                <CalendarDays size={16} className="text-dark-100" />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                minimumDate={getStartOfToday()}
                mode="date"
                onConfirm={(date) => {
                  handleDateConfirm(date);
                  formik.setFieldValue("date", date);
                }}
                onCancel={hideDatePicker}
              />
              {formik.touched.date && formik.errors.date && (
                <Text className="text-red-500 text-xs mt-1">
                  {formik.errors.date}
                </Text>
              )}

              <View className="mt-3 relative">
                <InputField
                  // label="Estimated Cost"
                  value={formik.values.total_amount}
                  onChangeText={formik.handleChange("total_amount")}
                  placeholder="Estimated cost"
                  keyboardType="numeric"
                  error={
                    formik.touched.total_amount && formik.errors.total_amount
                  }
                />
                <Text className="absolute top-[18] right-4 text-black">
                  {UNITS.CURRENCY}
                </Text>
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
              <CustomButton
                title={isEditMode ? "Update Invoice" : "Add Invoice"}
                onPress={() => formik.handleSubmit()}
              />
            </View>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default AddInvoiceScreen;
