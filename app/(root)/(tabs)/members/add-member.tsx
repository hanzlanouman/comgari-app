//app\(root)\(tabs)\members\add-member.tsx
import { Platform, SafeAreaView, ScrollView, View } from "react-native";

import { Href, router } from "expo-router";
import * as Yup from "yup";
import { useLocalSearchParams } from 'expo-router';

import { useEffect, useState } from "react";
import { AppContainer, CustomButton, InputField } from "@/common/components";
import AddMemberForm from "./components/AddMemberForm";
import { useFormik } from "formik";
import { OptionType } from "@/common/types";
import { MemberPayload, memberSchema, updateMemberSchema, UpdateMemberPayload } from "@/repositories/member/schemas";
import { useMutation, useQuery } from "react-query";
import { MemberRepository } from "@/repositories";
import { route } from "@/common";

enum Action {
  ADD = 'Add',
  REMOVE = 'Remove'
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

const status = [
  { key: UserStatus.ACTIVE, value: UserStatus.ACTIVE },
  { key: UserStatus.INACTIVE, value: UserStatus.INACTIVE },
  { key: UserStatus.SUSPENDED, value: UserStatus.SUSPENDED },
];

const AddMember = () => {
  const MemberRepo = MemberRepository.getInstance();
  const getRole = () => MemberRepo.getAllRoles();
  const getPermission = () => MemberRepo.getPermissions();
  const { isEditing, memberId, memberData } = useLocalSearchParams();
  const initialMemberData: MemberPayload | null = memberData
    ? JSON.parse(memberData as string)
    : null;

  const { mutate, isError, error } = useMutation({
    mutationFn: (payload: MemberPayload) => MemberRepo.createMember(payload),
  });

  // Create mutation for updating a member
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateMemberPayload) =>
      MemberRepo.updateMember(Number(memberId), payload),
  });

  const { data: role } = useQuery(["roles"], getRole, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data: permission } = useQuery(["permission"], getPermission, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const [roles, setRole] = useState<OptionType[]>([]);
  const [permissions, setPermission] = useState<OptionType[]>([]);
  console.log("roles:", roles)

  useEffect(() => {
    if (role) {
      setRole(
        role?.data?.map((item: any) => ({
          value: item?.name,
          key: Number(item?.id),
        }))
      );
    }
    if (permission) {
      const formattedData = permission?.data?.map((item: any) => ({
        key: item?.id,
        value: `${item?.name} ${item?.resource}`,
      }));
      setPermission(formattedData);
    }
  }, [role, permission]);

  const formik = useFormik({
    initialValues: {
      user_name: initialMemberData?.user_name || '',
      email: initialMemberData?.email || '',
      phone: initialMemberData?.phone || '',
      password: '',
      full_name: initialMemberData?.full_name || '',
      permission_ids: initialMemberData?.permission_ids || [],
      status: initialMemberData?.status || UserStatus.ACTIVE,
      role_id: initialMemberData?.role_id
        ? Number(initialMemberData.role_id)
        : 0,
    },
    enableReinitialize: true,
    validationSchema: isEditing === 'true' ? updateMemberSchema : memberSchema,
    onSubmit: (values) => {
      if (isEditing === 'true' && initialMemberData) {
        const updatePayload: UpdateMemberPayload = {};
        updatePayload.role = [
          ...(initialMemberData.role_id ? [{
            role_id: initialMemberData.role_id,
            action: Action.REMOVE
          }] : []),
          {
            role_id: Number(values.role_id),
            action: Action.ADD
          }
        ];

        const initialPermissionIds = initialMemberData.permission_ids || [];
        const currentPermissionIds = values.permission_ids || [];

        const permissionsToRemove = initialPermissionIds.filter(
          pid => !currentPermissionIds.includes(pid)
        ).map(pid => ({
          permission_id: pid,
          action: Action.REMOVE
        }));

        const permissionsToAdd = currentPermissionIds.filter(
          pid => !initialPermissionIds.includes(pid)
        ).map(pid => ({
          permission_id: pid,
          action: Action.ADD
        }));

        if (permissionsToRemove.length > 0 || permissionsToAdd.length > 0) {
          updatePayload.permission = [
            ...permissionsToRemove,
            ...permissionsToAdd
          ];
        }

        updatePayload.user_name = values.user_name;

        updatePayload.full_name = values.full_name;

        updatePayload.phone = values.phone;

        updatePayload.status = values.status;


        updateMutation.mutate(updatePayload, {

          onSuccess: () => {
            router.push("/(root)/(tabs)/members/members");
          },
        });
      } else {

        mutate(values, {
          onSuccess: () => {
            router.push("/(root)/(tabs)/members/members");
          },
        });
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer
        isError={isError || updateMutation.isError}
        message={error || updateMutation.error}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-4"
        >
          <AddMemberForm
            formik={formik}
            roleOptions={roles}
            permissionOptions={permissions}
            statusOptions={status}
            isEditing={isEditing === 'true'}
          />
        </ScrollView>
      </AppContainer>
    </SafeAreaView>
  );
};

export default AddMember;