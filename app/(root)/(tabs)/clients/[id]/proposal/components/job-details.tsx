import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { router } from "expo-router";

import React, { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { CalendarDays, ChevronDown, Euro } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { InputField, CustomButton } from "@/common/components";

const client = [
  { key: "1", value: "Super Admin" },
  { key: "2", value: "Admin" },
  { key: "3", value: "User" },
  { key: "4", value: "Contractor" },
  { key: "5", value: "Dealor" },
];

const JobDetails = () => {
  const [selectedClient, setSelectedClient] = useState("");
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
    address: "",
    city: "",
    zip: "",
    jobName: "",
    jobPhone: "",
    projectDirector: "",
    estimatedDays: "",
    estimatedCost: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-gray px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full flex-row items-center justify-center bg-blue">
            <Text className="text-sm text-white font-ManropeBold">1</Text>
          </View>
          <Text className="text-sm text-blue font-ManropeSemibold ml-2">
            Job details
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full flex-row items-center justify-center bg-white">
            <Text className="text-sm text-dark font-ManropeBold">2</Text>
          </View>
          <Text className="text-sm text-dark font-ManropeSemibold ml-2">
            Specifications
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full flex-row items-center justify-center bg-white">
            <Text className="text-sm text-dark font-ManropeBold">3</Text>
          </View>
          <Text className="text-sm text-dark font-ManropeSemibold ml-2">
            Review
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-4">
          <View className="mt-4">
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
            className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-2.5 relative">
            <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2px]">
              {selectedDate ? (
                selectedDate
              ) : (
                <Text className="text-[#4A4A4A] pb-[2px]">Date</Text>
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
          <View className="mt-2.5">
            <InputField
              label=""
              value={form.address}
              onChangeText={(value) => setForm({ ...form, address: value })}
              placeholder="Address"
            />
          </View>
          <View className="flex-row items-center -mx-2 mt-2.5">
            <View className="w-3/5 px-2">
              <View className="">
                <InputField
                  label=""
                  value={form.city}
                  onChangeText={(value) => setForm({ ...form, city: value })}
                  placeholder="City"
                />
              </View>
            </View>
            <View className="w-2/5 px-2">
              <View className="">
                <InputField
                  label=""
                  value={form.zip}
                  onChangeText={(value) => setForm({ ...form, zip: value })}
                  placeholder="Zip"
                />
              </View>
            </View>
          </View>
          <View className="mt-2.5">
            <InputField
              label=""
              value={form.jobName}
              onChangeText={(value) => setForm({ ...form, jobName: value })}
              placeholder="Job name"
            />
          </View>
          <View className="mt-2.5">
            <InputField
              label=""
              value={form.jobPhone}
              onChangeText={(value) => setForm({ ...form, jobPhone: value })}
              placeholder="Job phone"
            />
          </View>
          <View className="mt-2.5">
            <InputField
              label=""
              value={form.projectDirector}
              onChangeText={(value) =>
                setForm({ ...form, projectDirector: value })
              }
              placeholder="Project director"
            />
          </View>
          <View className="mt-2.5">
            <InputField
              label=""
              value={form.estimatedDays}
              onChangeText={(value) =>
                setForm({ ...form, estimatedDays: value })
              }
              placeholder="Estimated days"
            />
          </View>
          <View className="mt-2.5 relative">
            <InputField
              label=""
              value={form.estimatedCost}
              onChangeText={(value) =>
                setForm({ ...form, estimatedCost: value })
              }
              placeholder="Estimated cost"
            />
            <Euro
              size={16}
              className="text-dark-100 absolute top-[18px] right-4"
            />
          </View>
        </View>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton
          title="Next"
          onPress={() => router.push("/(root)/(tabs)/proposal/specifications")}
        />
      </View>
    </SafeAreaView>
  );
};

export default JobDetails;
