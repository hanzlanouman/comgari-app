import React from "react";
import { View, Platform, Text } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { ChevronDown } from "lucide-react-native";
import { OptionType } from "../types";

interface DropdownSelectProps {
  label?: string;
  placeholder: string;
  data: OptionType[];
  selectedValue: string;
  setFieldValue: (field: string, value: any) => void;
  error?: string | boolean;
  fieldName: string;
  search?: boolean;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  label,
  placeholder,
  data,
  selectedValue,
  setFieldValue,
  error,
  fieldName,
  search = false,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text className={`text-sm font-ManropMedium`}>{label}</Text>}
      <SelectList
        setSelected={(value: any) => setFieldValue(fieldName, value)}
        data={data}
        save="key"
        fontFamily="Manrope-Medium"
        placeholder={placeholder}
        search={search}
        arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
        boxStyles={{
          backgroundColor: "#fff",
          height: 54,
          borderWidth: 1,
          borderColor: error ? "red" : "#EDEDED",
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "ios" ? 12 : 10,
          alignItems: "center",
        }}
        inputStyles={{ color: "#1C1C1C", fontSize: 15 }}
        dropdownStyles={{
          borderWidth: 1,
          borderColor: "#EDEDED",
          borderRadius: 12,
          backgroundColor: "#fff",
        }}
      />
      {error && typeof error === "string" && (
        <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default DropdownSelect;
