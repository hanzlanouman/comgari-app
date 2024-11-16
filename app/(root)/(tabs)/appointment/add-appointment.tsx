import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import InputField from "@/components/InputField";
import React, { useState } from "react";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import { ChevronDown, Search, Upload, X } from "lucide-react-native";
import { images } from "@/constants";
import { vs } from "react-native-size-matters";

const role = [
  { key: "1", value: "Super Admin" },
  { key: "2", value: "Admin" },
  { key: "3", value: "User" },
  { key: "4", value: "Contractor" },
  { key: "5", value: "Dealor" },
];

const AddAppointment = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    description: "",
  });

  return (
    <SafeAreaView>
      <Text>AddAppointment</Text>
    </SafeAreaView>
  );
};

export default AddAppointment;
