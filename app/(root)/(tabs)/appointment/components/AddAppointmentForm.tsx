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

enum Action {
  ADD = "Add",
  REMOVE = "Remove",
}

interface InitialData {
  titleOfMeeting?: string;
  selectedClient?: string;
  status?: string;
  selectedDate?: Date | null;
  notes?: string;
  selectedMembers?: { id: string; name: string }[];
}

interface AddAppointmentFormProps {
  clientOptions: OptionType[];
  memberOptions: OptionType[];
  statusOptions: OptionType[];
  isClientsLoading: boolean;
  isMembersLoading: boolean;
  onSubmitSuccess?: () => void;
  isEditing?: boolean;
  editingAppointmentId?: string;
  initialData?: InitialData;
}

export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  clientOptions,
  memberOptions,
  statusOptions,
  isClientsLoading,
  isMembersLoading,
  onSubmitSuccess,
  isEditing = false,
  editingAppointmentId,
  initialData,
}) => {
  // State for form values
  const [values, setValues] = useState({
    titleOfMeeting: initialData?.titleOfMeeting || "",
    notes: initialData?.notes || "",
    selectedClient: initialData?.selectedClient || "",
    selectedMembers: initialData?.selectedMembers?.map((member) => member.id) || [],
    status: initialData?.status || "",
  });
  // State for handling date
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialData?.selectedDate || null);

  // Track initial selected members for comparison
  const [initialSelectedMembers] = useState(
    initialData?.selectedMembers?.map((member) => member.id) || []
  );

  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const clientRepo = ClientRepository.getInstance();
  const appointmentId = Number(editingAppointmentId);

  // Improved member selection handling
  const handleMemberSelection = (field: string, value: string[]) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper function to check if there are any changes
  const hasUpdates = () => {
    const currentMemberIds = [...new Set(values.selectedMembers.map(Number))];
    const initialMemberIds = [...new Set(initialSelectedMembers.map(Number))];

    return (
      values.titleOfMeeting.trim() !== (initialData?.titleOfMeeting || "").trim() ||
      values.notes.trim() !== (initialData?.notes || "").trim() ||
      values.selectedClient !== initialData?.selectedClient ||
      values.status !== initialData?.status ||
      selectedDate?.toISOString() !== initialData?.selectedDate?.toISOString() ||
      currentMemberIds.length !== initialMemberIds.length ||
      !currentMemberIds.every((id) => initialMemberIds.includes(id))
    );
  };

  // Handle form submission
  const handleSubmitAppointment = async () => {
    // Validation checks
    if (!values.titleOfMeeting.trim()) {
      Alert.alert("Error", "Please enter a meeting title");
      return;
    }
    if (!values.selectedClient) {
      Alert.alert("Error", "Please select a client");
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
      if (isEditing && appointmentId) {
        if (!hasUpdates()) {
          Alert.alert("No Updates", "No changes were made to the appointment.");
          setIsSubmitting(false);
          onSubmitSuccess?.();

          return;

        }
        // Convert to numbers and remove invalid IDs
        const currentMemberIds = [...new Set(
          values.selectedMembers.map(id => Number(id)).filter(id => !isNaN(id))
        )];
        const initialMemberIds = [...new Set(
          initialSelectedMembers.map(id => Number(id)).filter(id => !isNaN(id))
        )];

        // Calculate member actions
        const membersToAdd = currentMemberIds.filter(id => !initialMemberIds.includes(id));
        const membersToRemove = initialMemberIds.filter(id => !currentMemberIds.includes(id));

        // Generate member actions
        const memberActions = [
          ...membersToAdd.map(staff_id => ({ staff_id, action: Action.ADD })),
          ...membersToRemove.map(staff_id => ({ staff_id, action: Action.REMOVE })),
        ];


        const updatePayload = {
          title: values.titleOfMeeting || undefined,
          clientId: parseInt(values.selectedClient, 10),
          date: selectedDate?.toISOString(),
          startTime: selectedDate?.toISOString(),
          endTime: new Date(selectedDate?.getTime() + 60 * 60 * 1000).toISOString(),
          notes: values.notes || undefined,
          status: values.status || "Scheduled",
          projectId: parseInt(values.selectedClient, 10),
          ...(memberActions.length > 0 && {
            appointment_member: memberActions
          }),
        };

        await clientRepo.updateAppointment(Number(appointmentId), updatePayload);
        Alert.alert("Success", "Appointment updated successfully");
      } else {
        const createPayload = {
          title: values.titleOfMeeting,
          clientId: parseInt(values.selectedClient, 10),
          memberId: values.selectedMembers.map((id) => parseInt(id, 10)),
          date: selectedDate.toISOString(),
          status: values.status || "Scheduled",
          startTime: selectedDate.toISOString(),
          endTime: new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString(),
          notes: values.notes || "No notes",
          projectId: parseInt(values.selectedClient, 10),
        };

        await clientRepo.createAppointment(createPayload);
        Alert.alert("Success", "Appointment added successfully");
      }

      onSubmitSuccess?.();
    } catch (error) {
      console.error("Appointment submission error:", error);
      Alert.alert("Error", `Failed to ${isEditing ? "update" : "create"} appointment`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle date picker confirmation
  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
      {/* Title */}
      <View className="mt-5">
        <InputField
          label=""
          value={values.titleOfMeeting}
          onChangeText={(value) => setValues((prev) => ({ ...prev, titleOfMeeting: value }))}
          placeholder="Title of meeting"
        />
      </View>

      {/* Client Selection */}
      <View className="mt-3">
        <DropdownSelect
          placeholder="Select Client"
          data={clientOptions}
          selectedValue={values.selectedClient}
          setFieldValue={(field, value) => setValues((prev) => ({ ...prev, selectedClient: value }))}
          fieldName="selectedClient"
        />
      </View>

      {/* Members Selection */}
      <View className="mt-3">
        <MultiSelectDropdown
          placeholder="Assign Members"
          data={memberOptions}
          selectedValues={values.selectedMembers}
          setFieldValue={handleMemberSelection}
          fieldName="selectedMembers"
        />
      </View>

      {/* Status */}
      <View className="mt-3">
        <DropdownSelect
          placeholder="Status"
          data={statusOptions}
          selectedValue={values.status}
          setFieldValue={(field, value) => setValues((prev) => ({ ...prev, status: value }))}
          fieldName="status"
        />
      </View>

      {/* Date Picker */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setDatePickerVisibility(true)}
        className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative">
        <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2px]">
          {selectedDate ? format(selectedDate, "MMM dd, yyyy hh:mm a") : "Date/Time"}
        </Text>
        <CalendarDays size={16} className="text-dark-100" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      {/* Notes */}
      <View className="mt-3">
        <TextInput
          className="border border-light rounded-xl h-28 p-4 font-ManropeMedium text-[15px] text-left"
          value={values.notes}
          editable
          multiline
          placeholderTextColor="#1C1C1C"
          placeholder="Notes"
          onChangeText={(value) => setValues((prev) => ({ ...prev, notes: value }))}
        />
      </View>

      {/* Submit Button */}
      <View className="mt-3">
        <CustomButton
          title={isEditing ? "Update Appointment" : "Add Appointment"}
          onPress={handleSubmitAppointment}
          disabled={isSubmitting || isClientsLoading || isMembersLoading}
        />
      </View>
    </ScrollView>
  );
};
