import React, { useState, useRef, useEffect } from "react";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";

import {
  ScrollView,
  TouchableOpacity,
  Alert,
  View,
  Text,
} from "react-native";
import { CalendarDays } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CustomButton, InputField, DropdownSelect } from "@/common/components";
import { ClientRepository } from "@/repositories/client/client";
import { UNITS } from "@/constants";

import { useAppSelector } from "@/hooks/redux";
import { OptionType } from "@/common/types";


const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};
const ProposalSchema = Yup.object().shape({
  client_id: Yup.number()
    .integer('Client ID must be an integer')
    .required('Client ID is required'),
  date: Yup.date()
    .min(getStartOfToday(), 'Past dates are not allowed')
    .required('Date is required'), address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  zip_code: Yup.number()
    .integer('Zip Code must be an integer')
    .required('Zip Code is required'),
  job_name: Yup.string().required('Job Name is required'),
  job_phone: Yup.string().required('Job Phone is required'),
  project_director: Yup.string().required('Project Director is required'),
  estimated_days: Yup.number()
    .integer('Estimated Days must be an integer')
    .required('Estimated Days is required'),
  estimated_cost: Yup.string()
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Estimated cost must be a valid decimal number (e.g., 100.00)"
    )
    .required("Estimated cost is required"),
  project_id: Yup.number()
    .integer('Project ID must be an integer')
    .required('Project ID is required'),
});
interface JobDetailsFormValues {
  client_id: number;
  project_id: number;
  date: string;
  address: string;
  city: string;
  zip_code: string;
  job_name: string;
  job_phone: string;
  project_director: string;
  specification: string;
  estimated_days: string;
  estimated_cost: string;
}

const JobDetails = ({ initialData, onNext }: {
  initialData: Partial<JobDetailsFormValues>;
  onNext: (data: JobDetailsFormValues) => void
}) => {
  const formikRef = useRef<FormikProps<JobDetailsFormValues>>(null);
  const clientRepo = ClientRepository.getInstance();
  const user = useAppSelector((state) => state.auth.user);
  // State variables
  const [clientOptions, setClientOptions] = useState<OptionType[]>([]);
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Fetch clients on mount
  const fetchClients = async () => {
    setIsClientsLoading(true);
    try {
      const clients = await clientRepo.getClients(
        { start: 0, limit: 10 },
        { user }
      );
      const options: OptionType[] = clients.map((client) => ({
        key: client.id,
        value: client.name,
      }));
      setClientOptions(options);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch clients");
    } finally {
      setIsClientsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handlers for Date Picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => setDatePickerVisibility(false);
  const isValidDate = (date: Date): boolean => {
    const today = getStartOfToday();
    return date >= today;
  };
  return (
    <Formik<JobDetailsFormValues>
      innerRef={formikRef}
      validationSchema={ProposalSchema} // Add this line
      enableReinitialize
      initialValues={{
        client_id: Number(initialData.client_id) || 0,
        project_id: Number(initialData.project_id) || 0,
        date: initialData.date || "",
        address: initialData.address || "",
        city: initialData.city || "",
        zip_code: initialData.zip_code?.toString() || "",
        job_name: initialData.job_name || "",
        job_phone: initialData.job_phone || "",
        project_director: initialData.project_director || "",
        specification: initialData.specification || "",
        estimated_days: initialData.estimated_days?.toString() || "",
        estimated_cost: initialData.estimated_cost?.toString() || "",
      }}
      onSubmit={(values) => {

        const estimatedCostNumber = Number(values.estimated_cost);
        const formattedEstimatedCost = parseFloat((estimatedCostNumber).toFixed(2));


        const submitData: JobDetailsFormValues = {
          ...values,
          client_id: Number(values.client_id),
          project_id: Number(values.client_id),
          zip_code: values.zip_code ? Number(values.zip_code) : 0,
          estimated_days: values.estimated_days ? Number(values.estimated_days) : 0,
          estimated_cost: parseFloat(values.estimated_cost).toFixed(2), // Ensure 2 decimal places as a string


          date: values.date instanceof Date
            ? values.date.toISOString()
            : values.date || new Date().toISOString(),

        };

        onNext(submitData);
      }}
    >
      {(formikProps) => (
        <>

          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
            <View className="px-4">
              <View className="mt-4">
                <DropdownSelect
                  placeholder="Select Client"
                  data={clientOptions}
                  selectedValue={formikProps.values.client_id.toString()}
                  setFieldValue={(field, value) =>
                    formikProps.setFieldValue(field, Number(value))
                  }
                  fieldName="client_id"
                  isLoading={isClientsLoading}
                />
                {formikProps.touched.client_id && formikProps.errors.client_id && (
                  <Text className="text-red mt-1">{formikProps.errors.client_id}</Text>
                )}
              </View>

              {/* Date Picker */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={showDatePicker}
                className="w-full h-12 px-4 border border-light bg-white rounded-xl flex-row items-center justify-center mt-2.5 relative"
              >
                <Text className="flex-1 text-black font-ManropeMedium text-base">
                  {formikProps.values.date ? (
                    <Text>
                      {formikProps.values.date instanceof Date
                        ? formikProps.values.date.toLocaleDateString()
                        : new Date(formikProps.values.date).toLocaleDateString()}
                    </Text>
                  ) : (
                    <Text className="text-gray">Date</Text>
                  )}
                </Text>
                <CalendarDays size={16} color="#000000" />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                minimumDate={getStartOfToday()}
                onConfirm={(date) => {
                  if (isValidDate(date)) {
                    formikProps.setFieldValue("date", date);
                    hideDatePicker();
                  } else {
                    Alert.alert("Invalid Date", "Please select today or a future date");
                  }
                }}
                onCancel={hideDatePicker}
              />
              {formikProps.touched.date && formikProps.errors.date && (
                <Text className="text-red mt-1">{formikProps.errors.date}</Text>
              )}

              {/* Input fields with type conversions */}
              <View className="mt-2.5">
                <InputField
                  value={formikProps.values.address}
                  placeholder="Address"
                  onChangeText={formikProps.handleChange("address")}
                  onBlur={formikProps.handleBlur("address")}
                />
                {formikProps.touched.address && formikProps.errors.address && (
                  <Text className="text-red mt-1">{formikProps.errors.address}</Text>
                )}
              </View>

              <View className="flex-row items-center -mx-2 mt-2.5">
                <View className="w-3/5 px-2">
                  <InputField
                    value={formikProps.values.city}
                    placeholder="City"
                    onChangeText={formikProps.handleChange("city")}
                    onBlur={formikProps.handleBlur("city")}
                  />
                  {formikProps.touched.city && formikProps.errors.city && (
                    <Text className="text-red mt-1">{formikProps.errors.city}</Text>
                  )}
                </View>
                <View className="w-2/5 px-2">
                  <InputField
                    value={formikProps.values.zip_code.toString()}
                    placeholder="Zip"
                    onChangeText={(text) => formikProps.setFieldValue("zip_code", text)}
                    onBlur={formikProps.handleBlur("zip_code")}
                    keyboardType="numeric"
                  />
                  {formikProps.touched.zip_code && formikProps.errors.zip_code && (
                    <Text className="text-red mt-1">{formikProps.errors.zip_code}</Text>
                  )}
                </View>
              </View>
              <View className="mt-2.5 relative">

                <InputField
                  value={formikProps.values.job_name}
                  placeholder="Job Name"
                  onChangeText={formikProps.handleChange("job_name")}
                  onBlur={formikProps.handleBlur("job_name")}
                />
                {formikProps.touched.job_name && formikProps.errors.job_name && (
                  <Text className="text-red mt-1">{formikProps.errors.job_name}</Text>
                )}
              </View>
              <View className="mt-2.5 relative">

                <InputField
                  value={formikProps.values.job_phone}
                  placeholder="Job Phone"
                  onChangeText={formikProps.handleChange("job_phone")}
                  onBlur={formikProps.handleBlur("job_phone")}
                />
                {formikProps.touched.job_phone && formikProps.errors.job_phone && (
                  <Text className="text-red mt-1">{formikProps.errors.job_phone}</Text>
                )}
              </View>
              <View className="mt-2.5 relative">
                <InputField
                  value={formikProps.values.project_director}
                  placeholder="Project Director"
                  onChangeText={formikProps.handleChange("project_director")}
                  onBlur={formikProps.handleBlur("project_director")}
                />
                {formikProps.touched.project_director && formikProps.errors.project_director && (
                  <Text className="text-red mt-1">{formikProps.errors.project_director}</Text>
                )}
              </View>

              <View className="mt-2.5 relative">
                <InputField
                  value={formikProps.values.estimated_days.toString()}
                  placeholder="Estimated Days"
                  onChangeText={(text) => formikProps.setFieldValue("estimated_days", text)}
                  onBlur={formikProps.handleBlur("estimated_days")}
                  keyboardType="numeric"
                />
                {formikProps.touched.estimated_days && formikProps.errors.estimated_days && (
                  <Text className="text-red mt-1">{formikProps.errors.estimated_days}</Text>
                )}
              </View>

              <View className="mt-2.5 relative">
                <InputField
                  value={formikProps.values.estimated_cost}
                  placeholder="Estimated Cost"
                  onChangeText={(text) => {
                    let formattedText = text.replace(/[^0-9.]/g, '');

                    const parts = formattedText.split('.');
                    if (parts.length > 2) {
                      formattedText = `${parts[0]}.${parts.slice(1).join('')}`;
                    }

                    if (parts[1] && parts[1].length > 2) {
                      parts[1] = parts[1].slice(0, 2);
                      formattedText = `${parts[0]}.${parts[1]}`;
                    }

                    formikProps.setFieldValue("estimated_cost", formattedText);
                  }}
                  onBlur={formikProps.handleBlur("estimated_cost")}
                  keyboardType="decimal-pad"
                />
                <Text className="absolute top-[18px] right-4 text-black">{UNITS.CURRENCY}</Text>
                {formikProps.touched.estimated_cost && formikProps.errors.estimated_cost && (
                  <Text className="text-red mt-1">{formikProps.errors.estimated_cost}</Text>
                )}
              </View>
            </View>
          </ScrollView>

          <View className="p-4 bg-white">
            <CustomButton title="Next" onPress={formikProps.handleSubmit} />
          </View>
        </>
      )}
    </Formik>
  );
};

export default JobDetails;