// import React, { useState } from "react";
// import {
//   ScrollView,
//   Text,
//   TextInput,
//   View,
//   Alert,
// } from "react-native";
// import { format } from "date-fns";

// import { CalendarDays } from "lucide-react-native";
// import { OptionType } from "@/common/types";
// import {
//   CustomButton,
//   InputField,
//   DropdownSelect,
//   DateTimePicker,
//   MutlitSelectWithDefault,
// } from "@/common/components";
// import { ClientRepository } from "@/repositories/client/client";

// enum Action {
//   ADD = "Add",
//   REMOVE = "Remove",
// }

// type InitialData = {
//   clientId: number;
//   appointmentId: number;
//   title: string;
//   status: string;
//   notes: string;
//   startTime: string;
//   endTime: string;
//   members: { id: string; name: string }[];
// } | undefined;

// interface AddAppointmentFormProps {
//   clientOptions: OptionType[];
//   memberOptions: OptionType[];
//   statusOptions: OptionType[];
//   isClientsLoading: boolean;
//   isMembersLoading: boolean;
//   onSubmitSuccess?: () => void;
//   isEditing?: boolean;
//   editingAppointmentId?: string;
//   initialData?: InitialData;
//   isAppointmentAdded: boolean;
//   setAppointmentAdded: (isAppointmentAdded: boolean) => void;
// }

// export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
//   clientOptions,
//   memberOptions,
//   statusOptions,
//   isClientsLoading,
//   isMembersLoading,
//   onSubmitSuccess,
//   isEditing = false,
//   initialData,
//   isAppointmentAdded,
//   setAppointmentAdded,
// }) => {
//   // State for form values
//   const [values, setValues] = useState({
//     titleOfMeeting: initialData?.title || "",
//     notes: initialData?.notes || "",
//     selectedClient: initialData?.clientId || "",
//     selectedMembers:
//       initialData?.members?.map((member) => member.id) || [],
//     status: initialData?.status || "",
//     startTime: initialData?.startTime || null,
//     endTime: initialData?.endTime || null,
//   });

//   const initialSelectedMembers = initialData?.members?.map((member) => member.id) || [];

//   // State for submission
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const clientRepo = ClientRepository.getInstance();
//   const appointmentId = Number(initialData?.appointmentId);

//   // Improved member selection handling
//   const handleMemberSelection = (field: string, value: string[]) => {
//     setValues((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Helper function to check if there are any changes
//   const hasUpdates = () => {
//     const currentMemberIds = [...new Set(values.selectedMembers.map(Number))];
//     const initialMemberIds = [...new Set(initialSelectedMembers.map(Number))];

//     return (
//       values.titleOfMeeting.trim() !==
//       (initialData?.title || "").trim() ||
//       values.notes.trim() !== (initialData?.notes || "").trim() ||
//       values.selectedClient !== initialData?.clientId ||
//       values.status !== initialData?.status ||
//       values.startTime !==
//       initialData?.startTime ||
//       values.endTime !==
//       initialData?.endTime ||
//       currentMemberIds.length !== initialMemberIds.length ||
//       !currentMemberIds.every((id) => initialMemberIds.includes(id))
//     );
//   };

//   // Handle form submission
//   const handleSubmitAppointment = async () => {
//     // Validation checks
//     if (!values.titleOfMeeting.trim()) {
//       Alert.alert("Error", "Please enter a meeting title");
//       return;
//     }
//     if (!values.selectedClient) {
//       Alert.alert("Error", "Please select a client");
//       return;
//     }
//     if (!values.status) {
//       Alert.alert("Error", "Please select a status");
//       return;
//     }
//     if (!values.startTime) {
//       Alert.alert("Error", "Please select a start date and time");
//       return;
//     }
//     if (!values.endTime) {
//       Alert.alert("Error", "Please select an end date and time");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       if (isEditing && appointmentId) {
//         if (!hasUpdates()) {
//           Alert.alert("No Updates", "No changes were made to the appointment.");
//           setIsSubmitting(false);
//           onSubmitSuccess?.();

//           return;
//         }
//         // Convert to numbers and remove invalid IDs
//         const currentMemberIds = [
//           ...new Set(
//             values.selectedMembers
//               .map((id) => Number(id))
//               .filter((id) => !isNaN(id))
//           ),
//         ];
//         const initialMemberIds = [
//           ...new Set(
//             initialSelectedMembers
//               .map((id) => Number(id))
//               .filter((id) => !isNaN(id))
//           ),
//         ];

//         // Calculate member actions
//         const membersToAdd = currentMemberIds.filter(
//           (id) => !initialMemberIds.includes(id)
//         );
//         const membersToRemove = initialMemberIds.filter(
//           (id) => !currentMemberIds.includes(id)
//         );

//         // Generate member actions
//         const memberActions = [
//           ...membersToAdd.map((staff_id) => ({ staff_id, action: Action.ADD })),
//           ...membersToRemove.map((staff_id) => ({
//             staff_id,
//             action: Action.REMOVE,
//           })),
//         ];
//         const updatePayload = {
//           title: values.titleOfMeeting || undefined,
//           clientId: parseInt(values.selectedClient, 10),
//           date: values.startTime,
//           startTime: values.startTime,
//           endTime: values.endTime,
//           notes: values.notes || undefined,
//           status: values.status || "Scheduled",
//           projectId: parseInt(values.selectedClient, 10),
//           appointment_member: memberActions.length > 0 ? memberActions : [],
//           is_add_in_google_calendar: isAppointmentAdded,
//         };
//         await clientRepo.updateAppointment(
//           Number(appointmentId),
//           updatePayload
//         );
//         Alert.alert("Success", "Appointment updated successfully");
//       } else {
//         const createPayload = {
//           title: values.titleOfMeeting,
//           clientId: parseInt(values.selectedClient, 10),
//           memberId: values.selectedMembers.map((id) => parseInt(id, 10)),
//           status: values.status || "Scheduled",
//           date: values.startTime,
//           startTime: values.startTime,
//           endTime: values.endTime,
//           notes: values.notes || "No notes",
//           projectId: parseInt(values.selectedClient, 10),
//           is_add_in_google_calendar: false,
//         };

//         await clientRepo.createAppointment(createPayload);
//         Alert.alert("Success", "Appointment added successfully");
//       }

//       onSubmitSuccess?.();
//     } catch (error) {
//       console.error("Appointment submission error:", error);
//       Alert.alert(
//         "Error",
//         `Failed to ${isEditing ? "update" : "create"} appointment`
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
//       {/* Title */}
//       <View className="mt-5">
//         <InputField
//           label=""
//           value={values.titleOfMeeting}
//           onChangeText={(value) =>
//             setValues((prev) => ({ ...prev, titleOfMeeting: value }))
//           }
//           placeholder="Title of meeting"
//         />
//       </View>

//       {/* Client Selection */}
//       <View className="mt-3">
//         <DropdownSelect
//           placeholder="Select Client"
//           data={clientOptions}
//           selectedValue={values.selectedClient}
//           setFieldValue={(field, value) =>
//             setValues((prev) => ({ ...prev, selectedClient: value }))
//           }
//           fieldName="selectedClient"
//         />
//       </View>

//       {/* Members Selection */}
//       <View className="mt-3">
//         <MutlitSelectWithDefault
//           placeholder="Assign Members"
//           options={memberOptions || []}
//           save="key"
//           onSelect={(val) => handleMemberSelection("selectedMembers", val)}
//           value={values.selectedMembers.map((id) => String(id))}
//           valueTitles={memberOptions?.map((item: any) => values.selectedMembers?.includes(item.key) ? item.value : null).filter((item: any) => item !== null).flat()}
//         />
//       </View>

//       {/* Status */}
//       <View className="mt-3">
//         <DropdownSelect
//           placeholder="Status"
//           data={statusOptions}
//           selectedValue={values.status}
//           setFieldValue={(field, value) =>
//             setValues((prev) => ({ ...prev, status: value }))
//           }
//           fieldName="status"
//         />
//       </View>

//       <DateTimePicker
//         setDate={(date) => date ? setValues((prev) => ({ ...prev, startTime: date })) : {}}
//         date={values?.startTime ? values?.startTime : undefined}
//         minimumTime={new Date()}
//         minimumTimeMessage="Cannot be before current time"
//         tigger={
//           <View className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative">
//             <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2]">
//               {values?.startTime
//                 ? format(values?.startTime, "MMM dd, yyyy hh:mm a")
//                 : "Start Date/Time"}
//             </Text>
//             <CalendarDays size={16} className="text-dark-100" />
//           </View>}
//       />
//       <DateTimePicker
//         setDate={(date) => date ? setValues((prev) => ({ ...prev, endTime: date })) : {}}
//         date={values?.endTime ? values?.endTime : undefined}
//         minimumTime={new Date()}
//         minimumTimeMessage="Cannot be before current time"
//         tigger={
//           <View className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative">
//             <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2]">
//               {values?.endTime
//                 ? format(values?.endTime, "MMM dd, yyyy hh:mm a")
//                 : "End Date/Time"}
//             </Text>
//             <CalendarDays size={16} className="text-dark-100" />
//           </View>}
//       />

//       {/* Notes */}
//       <View className="mt-3">
//         <TextInput
//           className="border border-light rounded-xl h-28 p-4 font-ManropeMedium text-[15] text-left"
//           value={values.notes}
//           editable
//           multiline
//           placeholderTextColor="#1C1C1C"
//           placeholder="Notes"
//           onChangeText={(value) =>
//             setValues((prev) => ({ ...prev, notes: value }))
//           }
//         />
//       </View>

//       {/* Submit Button */}
//       <View className="mt-3">
//         <CustomButton
//           title={isEditing ? "Update Appointment" : "Add Appointment"}
//           onPress={handleSubmitAppointment}
//           disabled={isSubmitting || isClientsLoading || isMembersLoading}
//         />
//       </View>
//     </ScrollView>
//   );
// };

import React, { useState } from "react";
import { ScrollView, Text, TextInput, View, Alert } from "react-native";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react-native";
import { OptionType } from "@/common/types";
import {
  CustomButton,
  InputField,
  DropdownSelect,
  DateTimePicker,
  MutlitSelectWithDefault,
} from "@/common/components";
import { ClientRepository } from "@/repositories/client/client";

enum Action {
  ADD = "Add",
  REMOVE = "Remove",
}

type InitialData =
  | {
      clientId: number;
      appointmentId: number;
      title: string;
      status: string;
      notes: string;
      startTime: string;
      endTime: string;
      members: { id: string; name: string }[];
    }
  | undefined;

interface AddAppointmentFormProps {
  clientOptions: OptionType[];
  memberOptions: OptionType[];
  statusOptions: OptionType[];
  isClientsLoading: boolean;
  isMembersLoading: boolean;
  onSubmitSuccess?: () => void;
  isEditing?: boolean;
  initialData?: InitialData;
  isAppointmentAdded: boolean;
  setAppointmentAdded: (isAppointmentAdded: boolean) => void;
}

export const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  clientOptions,
  memberOptions,
  statusOptions,
  isClientsLoading,
  isMembersLoading,
  onSubmitSuccess,
  isEditing = false,
  initialData,
  isAppointmentAdded,
  setAppointmentAdded,
}) => {
  const [values, setValues] = useState({
    titleOfMeeting: initialData?.title || "",
    notes: initialData?.notes || "",
    selectedClient: initialData?.clientId || "",
    selectedMembers: initialData?.members?.map((member) => member.id) || [],
    status: initialData?.status || "",
    startTime: initialData?.startTime || null,
    endTime: initialData?.endTime || null,
  });

  const initialSelectedMembers =
    initialData?.members?.map((member) => member.id) || [];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientRepo = ClientRepository.getInstance();
  const appointmentId = Number(initialData?.appointmentId);

  const handleMemberSelection = (field: string, value: string[]) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasUpdates = () => {
    const currentMemberIds = [...new Set(values.selectedMembers.map(Number))];
    const initialMemberIds = [...new Set(initialSelectedMembers.map(Number))];

    return (
      values.titleOfMeeting.trim() !== (initialData?.title || "").trim() ||
      values.notes.trim() !== (initialData?.notes || "").trim() ||
      values.selectedClient !== initialData?.clientId ||
      values.status !== initialData?.status ||
      values.startTime !== initialData?.startTime ||
      values.endTime !== initialData?.endTime ||
      currentMemberIds.length !== initialMemberIds.length ||
      !currentMemberIds.every((id) => initialMemberIds.includes(id))
    );
  };

  const handleSubmitAppointment = async () => {
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
    if (!values.startTime) {
      Alert.alert("Error", "Please select a start date and time");
      return;
    }
    if (!values.endTime) {
      Alert.alert("Error", "Please select an end date and time");
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
        const currentMemberIds = [
          ...new Set(
            values.selectedMembers
              .map((id) => Number(id))
              .filter((id) => !isNaN(id))
          ),
        ];
        const initialMemberIds = [
          ...new Set(
            initialSelectedMembers
              .map((id) => Number(id))
              .filter((id) => !isNaN(id))
          ),
        ];

        const membersToAdd = currentMemberIds.filter(
          (id) => !initialMemberIds.includes(id)
        );
        const membersToRemove = initialMemberIds.filter(
          (id) => !currentMemberIds.includes(id)
        );

        const memberActions = [
          ...membersToAdd.map((staff_id) => ({ staff_id, action: Action.ADD })),
          ...membersToRemove.map((staff_id) => ({
            staff_id,
            action: Action.REMOVE,
          })),
        ];

        const updatePayload = {
          title: values.titleOfMeeting || undefined,
          clientId: Number(values.selectedClient),
          date: values.startTime,
          startTime: values.startTime,
          endTime: values.endTime,
          notes: values.notes || undefined,
          status: values.status || "Scheduled",
          projectId: Number(values.selectedClient),
          appointment_member: memberActions.length > 0 ? memberActions : [],
          is_add_in_google_calendar: isAppointmentAdded,
        };

        await clientRepo.updateAppointment(
          Number(appointmentId),
          updatePayload
        );
        Alert.alert("Success", "Appointment updated successfully");
      } else {
        const createPayload = {
          title: values.titleOfMeeting,
          clientId: Number(values.selectedClient),
          memberId: values.selectedMembers.map((id) => Number(id)),
          status: values.status || "Scheduled",
          date: values.startTime,
          startTime: values.startTime,
          endTime: values.endTime,
          notes: values.notes || "No notes",
          projectId: Number(values.selectedClient),
          is_add_in_google_calendar: isAppointmentAdded,
        };

        await clientRepo.createAppointment(createPayload);
        Alert.alert("Success", "Appointment added successfully");
      }

      onSubmitSuccess?.();
    } catch (error) {
      console.error("Appointment submission error:", error);
      Alert.alert(
        "Error",
        `Failed to ${isEditing ? "update" : "create"} appointment`
      );
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
          onChangeText={(value) =>
            setValues((prev) => ({ ...prev, titleOfMeeting: value }))
          }
          placeholder="Title of meeting"
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Select Client"
          data={clientOptions}
          selectedValue={String(values.selectedClient)}
          setFieldValue={(field, value) =>
            setValues((prev) => ({ ...prev, selectedClient: value }))
          }
          fieldName="selectedClient"
        />
      </View>

      <View className="mt-3">
        <MutlitSelectWithDefault
          placeholder="Assign Members"
          options={memberOptions || []}
          save="key"
          onSelect={(val) => handleMemberSelection("selectedMembers", val)}
          value={values.selectedMembers.map((id) => String(id))}
          valueTitles={memberOptions
            ?.map((item: any) =>
              values.selectedMembers?.includes(item.key) ? item.value : null
            )
            .filter((item: any) => item !== null)
            .flat()}
        />
      </View>

      <View className="mt-3">
        <DropdownSelect
          placeholder="Status"
          data={statusOptions}
          selectedValue={values.status}
          setFieldValue={(field, value) =>
            setValues((prev) => ({ ...prev, status: value }))
          }
          fieldName="status"
        />
      </View>

      <DateTimePicker
        setDate={(date) =>
          date ? setValues((prev) => ({ ...prev, startTime: date })) : {}
        }
        date={values?.startTime ? values?.startTime : undefined}
        minimumTime={new Date()}
        minimumTimeMessage="Cannot be before current time"
        tigger={
          <View
            className="px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative"
            style={{ width: "100%", height: 48 }}
          >
            <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2]">
              {values?.startTime
                ? format(values?.startTime, "MMM dd, yyyy hh:mm a")
                : "Start Date/Time"}
            </Text>
            <CalendarDays size={16} className="text-dark-100" />
          </View>
        }
      />

      <DateTimePicker
        setDate={(date) =>
          date ? setValues((prev) => ({ ...prev, endTime: date })) : {}
        }
        date={values?.endTime ? values?.endTime : undefined}
        minimumTime={new Date()}
        minimumTimeMessage="Cannot be before current time"
        tigger={
          <View
            className="px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-3 relative"
            style={{ width: "100%", height: 48 }}
          >
            <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2]">
              {values?.endTime
                ? format(values?.endTime, "MMM dd, yyyy hh:mm a")
                : "End Date/Time"}
            </Text>
            <CalendarDays size={16} className="text-dark-100" />
          </View>
        }
      />

      <View className="mt-3">
        <TextInput
          className="border border-light rounded-xl p-4 font-ManropeMedium text-[15] text-left"
          style={{ height: 112, color: "#1C1C1C" }}
          value={values.notes}
          editable
          multiline
          placeholderTextColor="#1C1C1C"
          placeholder="Notes"
          onChangeText={(value) =>
            setValues((prev) => ({ ...prev, notes: value }))
          }
        />
      </View>

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
