import { Platform, SafeAreaView, ScrollView, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import InputField from "@/components/InputField";
import { useState } from "react";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import { ChevronDown, Search, X } from "lucide-react-native";

const role = [
  { key: "1", value: "Super Admin" },
  { key: "2", value: "Admin" },
  { key: "3", value: "User" },
  { key: "4", value: "Contractor" },
  { key: "5", value: "Dealor" },
];

const AddClient = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <View className="mt-2.5">
          <InputField
            label=""
            value={form.fullName}
            onChangeText={(value) => setForm({ ...form, fullName: value })}
            placeholder="Full name"
          />
        </View>
        <View className="mt-3">
          <InputField
            label=""
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
        <View className="mt-3">
          <InputField
            label=""
            value={form.phoneNumber}
            onChangeText={(value) => setForm({ ...form, phoneNumber: value })}
            placeholder="Contact number"
          />
        </View>
        <View className="mt-3">
          <SelectList
            setSelected={(val) => setSelectedRole(val)}
            data={role}
            save="value"
            fontFamily="Manrope-Medium"
            placeholder="Select Role"
            search={false}
            arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
            placeholderTextColor="#1B78B9"
            boxStyles={{
              backgroundColor: "#fff",
              height: 54,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingTop: Platform.OS === "ios" ? 12 : 10,
              alignItems: "center",
            }}
            inputStyles={{
              color: "#1C1C1C",
              paddingHorizontal: 0,
              fontSize: 15,
            }}
            dropdownStyles={{
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 12,
              backgroundColor: "#fff",
            }}
          />
        </View>
        <View className="mt-3">
          <MultipleSelectList
            setSelected={(val) => setSelectedPermissions(val)}
            data={role}
            save="value"
            fontFamily="Manrope-Medium"
            placeholder="Permissions"
            search={false}
            searchPlaceholder="Search..."
            arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
            searchicon={<Search size={16} color="#1C1C1C" />}
            closeicon={<X size={16} color="#1C1C1C" />}
            placeholderTextColor="#1B78B9"
            onSelect={() => {}}
            label="Permissions"
            boxStyles={{
              backgroundColor: "#fff",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingTop: Platform.OS === "ios" ? 15 : 13,
              paddingBottom: Platform.OS === "ios" ? 16 : 16,
              alignItems: "center",
              marginBottom: 2,
            }}
            inputStyles={{
              color: "#1C1C1C",
              fontSize: 15,
            }}
            dropdownStyles={{
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 12,
              transition: "all 0.1s ease",
            }}
            badgeStyles={{
              backgroundColor: "#1B78B9",
              paddingHorizontal: 12,
              paddingBottom: 6.5,
              borderWidth: 0,
            }}
          />
        </View>
        <View className="mt-2.5">
          <SelectList
            setSelected={(val) => setSelectedStatus(val)}
            data={role}
            save="value"
            fontFamily="Manrope-Medium"
            placeholder="Status"
            search={false}
            arrowicon={<ChevronDown size={16} color="#1C1C1C" />}
            placeholderTextColor="#1B78B9"
            boxStyles={{
              backgroundColor: "#fff",
              height: 54,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingTop: Platform.OS === "ios" ? 12 : 10,
              alignItems: "center",
            }}
            inputStyles={{
              color: "#1C1C1C",
              paddingHorizontal: 0,
              fontSize: 15,
            }}
            dropdownStyles={{
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#EDEDED",
              borderRadius: 12,
              transition: "all 0.1s ease",
            }}
          />
        </View>
      </ScrollView>
      <View className="p-4 bg-white">
        <CustomButton title="Add Client" onPress={() => router.push("/")} />
      </View>
    </SafeAreaView>
  );
};

export default AddClient;
