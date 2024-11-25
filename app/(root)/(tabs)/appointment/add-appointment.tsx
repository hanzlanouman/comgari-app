import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import React, { useState } from "react";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import { CalendarDays, ChevronDown, Search, X } from "lucide-react-native";
import { format } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomButton, InputField } from "@/common/components";

const client = [
  { key: "1", value: "Super Admin" },
  { key: "2", value: "Admin" },
  { key: "3", value: "User" },
  { key: "4", value: "Contractor" },
  { key: "5", value: "Dealor" },
];

const member = [
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

const AddAppointment = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedMember, setSelectedMember] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = format(date, "MMM dd, yyyy hh:mm a");
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const [form, setForm] = useState({
    titleOfMeeting: "",
    notes: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <View className="mt-5">
          <InputField
            label=""
            value={form.titleOfMeeting}
            onChangeText={(value) =>
              setForm({ ...form, titleOfMeeting: value })
            }
            placeholder="Title of meeting"
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
        <View className="mt-3">
          <MultipleSelectList
            setSelected={(val) => setSelectedMember(val)}
            data={member}
            save="value"
            fontFamily="Manrope-Medium"
            placeholder="Assign member"
            search={false}
            searchPlaceholder="Search..."
            arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
            searchicon={<Search size={16} color="#1C1C1C" />}
            closeicon={<X size={16} color="#1C1C1C" />}
            placeholderTextColor="#1B78B9"
            onSelect={() => {}}
            label="Member"
            boxStyles={{
              backgroundColor: "#fff",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingTop: Platform.OS === "ios" ? 15 : 13,
              paddingBottom: Platform.OS === "ios" ? 16 : 16,
              alignItems: "center",
              marginBottom: 2,
            }}
            inputStyles={{
              color: "#1C1C1C",
              fontSize: 15,
            }}
            dropdownStyles={{
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 12,
              transition: "all 0.1s ease",
            }}
            badgeStyles={{
              backgroundColor: "#1B78B9",
              paddingHorizontal: 12,
              paddingBottom: 6.5,
              borderWidth: 0,
            }}
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
        <TouchableOpacity
          activeOpacity={1}
          onPress={showDatePicker}
          className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative">
          <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2px]">
            {selectedDate ? (
              selectedDate
            ) : (
              <Text className="text-[#4A4A4A] pb-[2px]">Date/Time</Text>
            )}
          </Text>
          <CalendarDays size={16} className="text-dark-100" />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <View className="mt-3">
          <TextInput
            className="border border-light rounded-xl h-28 p-4 font-ManropeMedium text-[15px] lowercase text-left"
            value={form.notes}
            editable
            multiline
            placeholderTextColor="#1C1C1C"
            placeholder="Notes"
            onChangeText={(value) => setForm({ ...form, notes: value })}
          />
        </View>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton
          title="Add Appointment"
          onPress={() => router.push("/")}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddAppointment;
