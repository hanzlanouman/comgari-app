import {
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { CustomButton, InputField } from "@/common/components";
import { router } from "expo-router";

import React, { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { CalendarDays, ChevronDown, Euro } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const client = [
  { key: "1", value: "Super Admin" },
  { key: "2", value: "Admin" },
  { key: "3", value: "User" },
  { key: "4", value: "Contractor" },
  { key: "5", value: "Dealor" },
];

const status = [
  { key: "1", value: "Super Admin" },
  { key: "2", value: "Admin" },
  { key: "3", value: "User" },
  { key: "4", value: "Contractor" },
  { key: "5", value: "Dealor" },
];

const JobDetails = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const dateString = date.toISOString().split("T")[0].replaceAll("-", "/");
    setSelectedDate(dateString);
    hideDatePicker();
  };

  const [form, setForm] = useState({
    jobName: "",
    totalAmount: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-4">
          <View className="mt-2.5">
            <InputField
              label=""
              value={form.jobName}
              onChangeText={(value) => setForm({ ...form, jobName: value })}
              placeholder="Job name"
            />
          </View>
          <View className="mt-3">
            <SelectList
              setSelected={(val) => setSelectedClient(val)}
              data={client}
              save="value"
              fontFamily="Manrope-Medium"
              placeholder="Select client"
              search={false}
              arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
              placeholderTextColor="#1B78B9"
              boxStyles={{
                backgroundColor: "#fff",
                height: 54,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#EDEDED",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingTop: Platform.OS === "ios" ? 12 : 10,
                alignItems: "center",
              }}
              inputStyles={{
                color: "#1C1C1C",
                paddingHorizontal: 0,
                fontSize: 15,
              }}
              dropdownStyles={{
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#EDEDED",
                borderRadius: 12,
                backgroundColor: "#fff",
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={showDatePicker}
            className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative">
            <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2px]">
              {selectedDate ? (
                selectedDate
              ) : (
                <Text className="text-dark-100 pb-[2px] text-base font-ManropeMedium">
                  Date
                </Text>
              )}
            </Text>
            <CalendarDays size={16} className="text-dark-100" />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View className="mt-3 relative">
            <InputField
              label=""
              value={form.totalAmount}
              onChangeText={(value) => setForm({ ...form, totalAmount: value })}
              placeholder="Estimated cost"
            />
            <Euro
              size={16}
              className="text-dark-100 absolute top-[18px] right-4"
            />
          </View>
          <View className="mt-3">
            <SelectList
              setSelected={(val) => setSelectedStatus(val)}
              data={status}
              save="value"
              fontFamily="Manrope-Medium"
              placeholder="Status"
              search={false}
              arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
              placeholderTextColor="#1B78B9"
              boxStyles={{
                backgroundColor: "#fff",
                height: 54,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#EDEDED",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingTop: Platform.OS === "ios" ? 12 : 10,
                alignItems: "center",
              }}
              inputStyles={{
                color: "#1C1C1C",
                paddingHorizontal: 0,
                fontSize: 15,
              }}
              dropdownStyles={{
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#EDEDED",
                borderRadius: 12,
                backgroundColor: "#fff",
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View className="p-4 pb-0 bg-white">
        <CustomButton
          title="Add Invoice"
          onPress={() => router.push("/(root)/(tabs)/clients/[id]/invoices")}
        />
      </View>
    </SafeAreaView>
  );
};

export default JobDetails;
