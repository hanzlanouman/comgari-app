import { Platform, SafeAreaView, ScrollView, View } from "react-native";

import { router } from "expo-router";
import * as Yup from "yup";

import { useEffect, useState } from "react";
import {
  SelectList,
  MultipleSelectList,
} from "react-native-dropdown-select-list";
import { ChevronDown, Search, X } from "lucide-react-native";
import { AppContainer, CustomButton, InputField } from "@/common/components";
import AddMemberForm from "./components/AddMemberForm";
import { useFormik } from "formik";
import { OptionType } from "@/common/types";
import { memberPayload, memberSchema } from "@/repositories/member/schemas";
import { useMutation, useQuery } from "react-query";
import { MemberRepository } from "@/repositories";

const AddMember = () => {
  const MemberRepo = MemberRepository.getInstance();
  const getRole = () => MemberRepo.getAllRoles();
  const getPermission = () => MemberRepo.getPermissions();
  const { mutate, isError, error } = useMutation({
    mutationFn: (payload: memberPayload) => MemberRepo.createMember(payload),
  });
  const { data: role } = useQuery(["roles"], getRole);
  const { data: permission } = useQuery(["permission"], getPermission);
  const [roles, setRole] = useState<OptionType[]>([]);
  const [permissions, setPermission] = useState<OptionType[]>([]);
  const status: OptionType[] = [
    {
      key: "ACTIVE",
      value: "ACTIVE",
    },
    {
      key: "SUSPENDED",
      value: "SUSPENDED",
    },
    {
      key: "INACTIVE",
      value: "INACTIVE",
    },
  ];
  useEffect(() => {
    if (role) {
      setRole(
        role?.data?.map((item: any) => ({
          value: item?.name,
          key: Number(item?.id),
        }))
      );
      if (permission) {
        const formattedData = permission?.data?.map((item: any) => ({
          key: item?.id,
          value: `${item?.name} ${item?.resource}`,
        }));
        console.log(formattedData, "Formatted Data");
        setPermission(formattedData);
      }
    }
  }, [role, permission]);

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      user_name: "",
      email: "",
      phone: "",
      password: "",
      full_name: "",
      permission_ids: [],
      status: "",
      role_id: 0,
    },
    validationSchema: memberSchema,
    onSubmit: (values) => {
      console.log(values, "Value to be send");
      mutate(values, {
        onSuccess: () => {
          console.log("member Created");
        },
      });
      // Handle form submission
    },
  });
  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer isError={isError} message={error?.message}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
          <AddMemberForm
            formik={formik}
            roleOptions={roles}
            permissionOptions={permissions}
            statusOptions={status}
          />
        </ScrollView>
      </AppContainer>
    </SafeAreaView>
  );
};

export default AddMember;
