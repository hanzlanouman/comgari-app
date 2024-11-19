import React, { useState } from "react";
import { View, Text, Platform, ScrollView } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { ChevronDown, Search, X } from "lucide-react-native";
import { OptionType } from "../types";

interface MultiSelectDropdownProps {
  label?: string;
  placeholder: string;
  data: OptionType[];
  selectedValues: string[];
  setFieldValue: (field: string, value: any) => void;
  error?: string | boolean;
  fieldName: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  placeholder,
  data,
  selectedValues,
  setFieldValue,
  error,
  fieldName,
}) => {
  const [selectedValue, setSelectedValues] = useState([]);
  const handleSelect = () => {
    setFieldValue(fieldName, selectedValue);
  };
  return (
    <ScrollView>
      <View style={{ marginBottom: 16 }}>
        {label && (
          <Text style={{ fontSize: 16, marginBottom: 4 }}>{label}</Text>
        )}
        <MultipleSelectList
          setSelected={setSelectedValues}
          onSelect={() => handleSelect()}
          data={data}
          save="key"
          fontFamily="Manrope-Medium"
          placeholder={placeholder}
          search={true}
          arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
          searchicon={<Search size={16} color="#1C1C1C" />}
          closeicon={<X size={16} color="#1C1C1C" />}
          boxStyles={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: error ? "red" : "#EDEDED",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingTop: Platform.OS === "ios" ? 15 : 13,
            paddingBottom: Platform.OS === "ios" ? 16 : 16,
            alignItems: "center",
          }}
          inputStyles={{ color: "#1C1C1C", fontSize: 15 }}
          dropdownStyles={{
            borderWidth: 1,
            borderColor: "#EDEDED",
            borderRadius: 12,
            overflow: "scroll",
          }}
          badgeStyles={{
            backgroundColor: "#1B78B9",
            paddingHorizontal: 12,
            borderWidth: 0,
          }}
        />
        {error && typeof error === "string" && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {error}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default MultiSelectDropdown;
