import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { format } from "date-fns";

import { CalendarDays } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { OptionType } from "@/common/types";
import {
  CustomButton,
  InputField,
  MultiSelectDropdown,
  DropdownSelect,
} from "@/common/components";
import { ClientRepository } from "@/repositories/client/client";
import { useAppSelector } from "@/hooks/redux";

interface AddAppointmentFormProps {
  clientOptions: OptionType[];
  memberOptions: OptionType[];
  statusOptions: OptionType[];
  isClientsLoading: boolean;
  isMembersLoading: boolean;
  onSubmitSuccess?: () => void;
  setAppointmentAdded: (isAppointmentAdded: boolean) => void;
}

export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  clientOptions,
  memberOptions,
  statusOptions,
  isClientsLoading,
  isMembersLoading,
  onSubmitSuccess,
  setAppointmentAdded,
}) => {
  const clientRepo = ClientRepository.getInstance();

  const user = useAppSelector((state) => state.auth.user);

  const [values, setValues] = useState({
    titleOfMeeting: "",
    notes: "",
    selectedClient: "",
    selectedMembers: [],
    status: "",
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValueChange = (field: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle member selection
  const handleMemberSelection = (field: string, selectedMembers: string[]) => {
    setValues((prev) => ({
      ...prev,
      [field]: selectedMembers,
    }));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleSubmitAppointment = async () => {
    if (!values.titleOfMeeting) {
      Alert.alert("Error", "Please enter a meeting title");
      return;
    }
    if (!values.selectedClient) {
      Alert.alert("Error", "Please select a client");
      return;
    }
    if (values.selectedMembers.length === 0) {
      Alert.alert("Error", "Please assign at least one member");
      return;
    }
    if (!values.status) {
      Alert.alert("Error", "Please select a status");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Error", "Please select a date and time");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: values.titleOfMeeting,
        clientId: parseInt(values.selectedClient, 10),
        memberId: values.selectedMembers.map((member) => parseInt(member, 10)),
        status: values.status,
        date: selectedDate.toISOString(),
        startTime: selectedDate.toISOString(),
        endTime: new Date(
          selectedDate.getTime() + 60 * 60 * 1000
        ).toISOString(),
        notes: values.notes || "No notes",
        projectId: parseInt(values.selectedClient, 10),
      };

      await clientRepo.createAppointment(payload);

      Alert.alert("Success", "Appointment added successfully");
      setAppointmentAdded(true);
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      console.error("Appointment creation error:", error);
      Alert.alert("Error", "Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
      <View className="mt-5">
        <InputField
          label=""
          value={values.titleOfMeeting}
          onChangeText={(value) => handleValueChange("titleOfMeeting", value)}
          placeholder="Title of meeting"
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Select Client"
          data={clientOptions}
          selectedValue={values.selectedClient}
          setFieldValue={handleValueChange}
          fieldName="selectedClient"
        />
      </View>

      <View className="mt-3">
        <MultiSelectDropdown
          placeholder="Assign Members"
          data={memberOptions}
          selectedValues={values.selectedMembers}
          setFieldValue={handleMemberSelection}
          fieldName="selectedMembers"
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Status"
          data={statusOptions}
          selectedValue={values.status}
          setFieldValue={handleValueChange}
          fieldName="status"
        />
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={showDatePicker}
        className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative">
        <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2px]">
          {selectedDate ? (
            format(selectedDate, "MMM dd, yyyy hh:mm a")
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
          className="border border-light rounded-xl h-28 p-4 font-ManropeMedium text-[15px] text-left"
          value={values.notes}
          editable
          multiline
          placeholderTextColor="#1C1C1C"
          placeholder="Notes"
          onChangeText={(value) => handleValueChange("notes", value)}
        />
      </View>

      <View className="mt-3">
        <CustomButton
          title="Add Appointment"
          onPress={handleSubmitAppointment}
          disabled={isSubmitting || isClientsLoading || isMembersLoading}
        />
      </View>
    </ScrollView>
  );
};
