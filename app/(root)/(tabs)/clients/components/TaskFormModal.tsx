import React, { useRef, useMemo, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Formik } from "formik";
import { CalendarDays } from "lucide-react-native";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { CustomButton, InputField, Backdrop } from "@/common/components";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MultiSelectDropdown, DropdownSelect } from '@/common/components';
import { MemberRepository } from "@/repositories/member/member";
import { TaskPayload, UpdateTaskPayload, Action, MemberAction } from "@/repositories/client/types";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/repositories/client/constants";
import * as Yup from "yup";

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required."),
  dueDate: Yup.date().required("Due date is required."),
  priority: Yup.string().required("Priority is required."),
  status: Yup.string().required("Status is required."),
});
interface TaskFormModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  initialValues: Partial<TaskPayload>;
  onSubmit: (values: TaskPayload | UpdateTaskPayload) => Promise<void>;
  isLoading: boolean;
  mode: "add" | "edit";
  currentMembers?: number[];
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  bottomSheetRef,
  initialValues,
  onSubmit,
  isLoading,
  mode,
  currentMembers = [],
}) => {
  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const formikRef = useRef<any>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [memberOptions, setMemberOptions] = useState<Array<{ key: number; value: string }>>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const memberRepo = MemberRepository.getInstance();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsMembersLoading(true);
    try {
      const response = await memberRepo.getMember();
      setMemberOptions(
        response.data?.map(({ id, Auth }: { id: number; Auth: { username: string } }) => ({
          key: id,
          value: Auth?.username || "Unknown User",
        })) || []
      );
    } catch (err) {
      Alert.alert("Error", "Failed to fetch members");
    } finally {
      setIsMembersLoading(false);
    }
  };

  const getInitialFormValues = () => {
    const isEditMode = mode === "edit";
    return {
      title: initialValues.title || "",
      selectedMembers: isEditMode ? currentMembers : [],
      assignedTo: !isEditMode ? currentMembers : undefined,
      assingedTo: isEditMode
        ? currentMembers.map((memberId) => ({
          member_id: memberId,
          action: "Add" as Action,
        }))
        : undefined,
      projectId: initialValues.projectId || "",
      dueDate: initialValues.dueDate || new Date().toISOString(),
      priority: initialValues.priority || "medium",
      status: initialValues.status || "TO_DO",
    };
  };


  const handleMemberSelection = (name: string, selectedValues: string[]) => {
    const newMembers = selectedValues.map(Number);

    if (mode === "edit") {
      const memberActions: MemberAction[] = [];

      newMembers.forEach((memberId) => {
        if (!currentMembers.includes(memberId)) {
          memberActions.push({ member_id: memberId, action: "Add" });
        }
      });

      currentMembers.forEach((memberId) => {
        if (!newMembers.includes(memberId)) {
          memberActions.push({ member_id: memberId, action: "Remove" });
        }
      });

      formikRef.current?.setFieldValue("assingedTo", memberActions);
      formikRef.current?.setFieldValue("selectedMembers", newMembers);
    } else {
      formikRef.current?.setFieldValue("assignedTo", newMembers);
      formikRef.current?.setFieldValue("selectedMembers", newMembers);
    }
  };


  const handleFormSubmit = async (values: TaskPayload | UpdateTaskPayload) => {
    try {
      await onSubmit(values);
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      console.error("Form submission error:", error);
      Alert.alert("Error", "Failed to submit the form. Please try again.");
    }
  };


  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    formikRef.current?.setFieldValue("dueDate", date.toISOString());
    hideDatePicker();
  };



  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={Backdrop}
      backgroundStyle={{
        borderRadius: 24,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Formik
          innerRef={formikRef}
          initialValues={getInitialFormValues() as any}
          validationSchema={validationSchema} // Add validation schema
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleSubmit, values, setFieldValue, errors, touched }) => (
            <BottomSheetScrollView
              className="flex-1"
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: Platform.OS === "ios" ? 34 : 24,
              }}
            >
              <View className="space-y-4">
                <View>
                  <InputField
                    value={values.title}
                    onChangeText={handleChange("title")}
                    placeholder="Title"
                    className="bg-white"
                  />
                  {errors.title && touched.title && (
                    <Text className="text-red">{errors.title}</Text>
                  )}
                </View>

                <View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setDatePickerVisible(true)}
                    className="w-full h-12 px-4 border border-gray-200 bg-white rounded-xl flex-row items-center"
                  >
                    <Text className="flex-1 text-black font-ManropeMedium">
                      {values.dueDate ? new Date(values.dueDate).toLocaleDateString() : "Date"}
                    </Text>
                    <CalendarDays size={16} color="#4A4A4A" />
                  </TouchableOpacity>
                  {errors.dueDate && touched.dueDate && (
                    <Text className="text-red">{errors.dueDate as string}</Text>
                  )}
                </View>

                <View>
                  <MultiSelectDropdown
                    placeholder="Assignment"
                    data={memberOptions || []}
                    selectedValues={(values.selectedMembers as number[] || []).map(String)}
                    setFieldValue={handleMemberSelection}
                    fieldName="selectedMembers"
                  />
                </View>

                <View>
                  <DropdownSelect
                    placeholder="Priority"
                    data={PRIORITY_OPTIONS}
                    selectedValue={values.priority}
                    setFieldValue={setFieldValue}
                    fieldName="priority"
                  />
                  {errors.priority && touched.priority && (
                    <Text className="text-red">{errors.priority}</Text>
                  )}
                </View>

                <View>
                  <DropdownSelect
                    placeholder="Status"
                    data={STATUS_OPTIONS}
                    selectedValue={values.status}
                    setFieldValue={setFieldValue}
                    fieldName="status"
                  />
                  {errors.status && touched.status && (
                    <Text className="text-red">{errors.status}</Text>
                  )}
                </View>

                <View className="flex-row pt-4">
                  <View className={`flex-1 ${mode === "edit" ? "mr-2" : ""}`}>
                    <CustomButton
                      title={isLoading ? `${mode === "add" ? "Adding" : "Updating"}` : `${mode === "add" ? "Add Task" : "Update Task"}`}
                      onPress={() => handleSubmit()}
                      disabled={isLoading}
                    />
                  </View>
                </View>
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={values.dueDate ? new Date(values.dueDate) : new Date()}
                minimumDate={getStartOfToday()}
              />
            </BottomSheetScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
};

export default TaskFormModal;
