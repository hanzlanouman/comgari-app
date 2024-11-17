// TaskFormModal.tsx
import React, { useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { CalendarDays } from 'lucide-react-native';
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { CustomButton, InputField, Backdrop, DropdownSelect } from '@/common/components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface TaskFormValues {
  title: string;
  description: string;
  assignedTo: string;
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

const assignmentData = [
  { key: "1", value: "1" },
  { key: "2", value: "2" },
  { key: "3", value: "3" },
  { key: "4", value: "4" },
  { key: "5", value: "5" },
];

const priorityData = [
  { key: "high", value: "high" },
  { key: "medium", value: "medium" },
  { key: "low", value: "low" },
];

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

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    const dateString = date.toISOString().split("T")[0].replaceAll("-", "/");
    formikRef.current?.setFieldValue("dueDate", dateString);
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
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ handleChange, handleSubmit, values, setFieldValue }) => (
          <BottomSheetView className="relative flex-grow p-4">
            <Text className="text-xl font-ManropeBold text-dark mb-4">
              {mode === 'add' ? 'Add New Task' : 'Edit Task'}
            </Text>

            <View className="mt-0">
              <InputField
                value={values.title}
                onChangeText={handleChange("title")}
                placeholder="Title"
              />
            </View>

            <View className="mt-2.5">
              <InputField
                value={values.description}
                onChangeText={handleChange("description")}
                placeholder="Description"
                multiline
                numberOfLines={3}
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
                data={assignmentData}
                selectedValue={values.assignedTo}
                setFieldValue={setFieldValue}
                fieldName="assignedTo"
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
              />
            </View>

            <View className="flex-row mt-4">
              <View className={`flex-1 ${mode === 'edit' ? 'mr-2' : ''}`}>
                <CustomButton
                  title={isLoading ? `${mode === 'add' ? 'Adding...' : 'Updating...'}` : `${mode === 'add' ? 'Add Task' : 'Update Task'}`}
                  onPress={handleSubmit}
                  disabled={isLoading}
                />
              </View>
              
              {mode === 'edit' && onDelete && (
                <View className="flex-1 ml-2">
                  <CustomButton
                    title={isLoading ? "Deleting..." : "Delete Task"}
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