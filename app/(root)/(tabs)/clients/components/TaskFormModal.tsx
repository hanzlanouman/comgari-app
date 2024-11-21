import React, { useRef, useMemo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Formik } from 'formik';
import { CalendarDays } from 'lucide-react-native';
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { CustomButton, InputField, Backdrop, DropdownSelect } from '@/common/components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import { MemberRepository } from '@/repositories/member/member';

interface Member {
  id: number;
  Auth: {
    username: string;
  };
}

interface MemberOption {
  key: number;  
  value: string;
}

interface TaskFormValues {
  title: string;
  description: string;
  assignedTo: number;  
  dueDate: string;
  priority: string;
}

interface TaskFormModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  initialValues: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  isLoading: boolean;
  mode: 'add' | 'edit';
  onDelete?: () => Promise<void>;
}

const priorityData = [
  { key: "high", value: "High" },
  { key: "medium", value: "Medium" },
  { key: "low", value: "Low" },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  assignedTo: Yup.number().required("Assignment is required"),
  dueDate: Yup.string().required("Due date is required"),
  priority: Yup.string().required("Priority is required"),
});

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  bottomSheetRef,
  initialValues,
  onSubmit,
  isLoading,
  mode,
  onDelete,
}) => {
  const snapPoints = useMemo(() => ["49%", "80%"], []);
  const formikRef = useRef<any>();
  const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);
  const [memberOptions, setMemberOptions] = useState<MemberOption[]>([]);
  const [membersMap, setMembersMap] = useState<Map<string, number>>(new Map());
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const memberRepo = MemberRepository.getInstance();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsMembersLoading(true);
    try {
      const { data } = await memberRepo.getMember();
      const members = data || [];
      
      // Create options for dropdown
      const options: MemberOption[] = members.map((member) => ({
        key: member.id,
        value: member.Auth.username || 'Unknown',
      }));
      
      const memberMap = new Map(
        members.map((member) => [member.Auth.username, member.id])
      );

      setMemberOptions(options);
      setMembersMap(memberMap);
    } catch (error) {
      console.error('Error fetching members:', error);
      Alert.alert('Error', 'Failed to load members. Please try again.');
    } finally {
      setIsMembersLoading(false);
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    const dateString = date.toISOString().split("T")[0].replaceAll("-", "/");
    formikRef.current?.setFieldValue("dueDate", dateString);
    hideDatePicker();
  };

  const handleFormSubmit = async (values: TaskFormValues) => {
    try {
      const formattedValues = {
        ...values,
        assignedTo: Number(values.assignedTo)
      };
      await onSubmit(formattedValues);
    } catch (error) {
      console.error('Form submission error:', error);
      Alert.alert('Error', 'Failed to submit the form. Please try again.');
    }
  };

  const handleAssignedToChange = (setFieldValue: (field: string, value: any) => void) => {
    return (username: string) => {
      const memberId = membersMap.get(username);
      if (memberId !== undefined) {
        setFieldValue('assignedTo', memberId);
      }
    };
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
      <Formik
        innerRef={formikRef}
        initialValues={{
          ...initialValues,
          assignedTo: initialValues.assignedTo 
            ? Number(initialValues.assignedTo) 
            : 0
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleSubmit, values, setFieldValue, errors, touched }) => (
          <BottomSheetView className="relative flex-grow p-4">
            <Text className="text-xl font-ManropeBold text-dark mb-4">
              {mode === 'add' ? 'Add New Task' : 'Edit Task'}
            </Text>

            <View className="mt-0">
              <InputField
                value={values.title}
                onChangeText={handleChange("title")}
                placeholder="Title"
                error={touched.title && errors.title}
              />
            </View>

            <View className="mt-2.5">
              <InputField
                value={values.description}
                onChangeText={handleChange("description")}
                placeholder="Description"
                multiline
                numberOfLines={3}
                error={touched.description && errors.description}
              />
            </View>
            
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setDatePickerVisible(true)}
              className="w-full h-12 sm:h-[52] px-4 border border-light bg-white rounded-xl sm:rounded-xl flex-row items-center justify-center mt-2.5 relative"
            >
              <Text className="flex-1 text-black font-ManropeMedium text-base pb-[2px]">
                {values.dueDate || <Text className="text-[#4A4A4A] pb-[2px]">Date</Text>}
              </Text>
              <CalendarDays size={16} color="#4A4A4A" />
            </TouchableOpacity>
            {touched.dueDate && errors.dueDate && (
              <Text className="text-red-500 text-sm mt-1">{errors.dueDate}</Text>
            )}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <View className="mt-2.5">
              <DropdownSelect
                label="Assignment"
                placeholder="Select Assignment"
                data={memberOptions}
                selectedValue={
                  // Find the username corresponding to the member ID
                  memberOptions.find(option => option.key === values.assignedTo)?.value || ''
                }
                setFieldValue={handleAssignedToChange(setFieldValue)}
                fieldName="assignedTo"
                isLoading={isMembersLoading}
                error={touched.assignedTo && errors.assignedTo}
              />
            </View>

            <View className="mt-2">
              <DropdownSelect
                label="Priority"
                placeholder="Select Priority"
                data={priorityData}
                selectedValue={values.priority}
                setFieldValue={setFieldValue}
                fieldName="priority"
                error={touched.priority && errors.priority}
              />
            </View>

            <View className="flex-row mt-4">
              <View className={`flex-1 ${mode === 'edit' ? 'mr-2' : ''}`}>
                <CustomButton
                  title={isLoading ? `${mode === 'add' ? 'Adding' : 'Updating'}` : `${mode === 'add' ? 'Add Task' : 'Update Task'}`}
                  onPress={() => handleSubmit()}
                  disabled={isLoading}
                />
              </View>
              
              {mode === 'edit' && onDelete && (
                <View className="flex-1 ml-2">
                  <CustomButton
                    title={isLoading ? "Deleting" : "Delete Task"}
                    onPress={onDelete}
                    disabled={isLoading}
                    variant="destructive"
                  />
                </View>
              )}
            </View>
          </BottomSheetView>
        )}
      </Formik>
    </BottomSheetModal>
  );
};

export default TaskFormModal;