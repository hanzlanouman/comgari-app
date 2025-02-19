//app\(root)\(tabs)\members\add-member.tsx
import { SafeAreaView, ScrollView } from "react-native";

import { router } from "expo-router";
import { useLocalSearchParams } from 'expo-router';

import { useEffect, useState } from "react";
import { AppContainer } from "@/common/components";
import AddMemberForm from "./components/AddMemberForm";
import { useFormik } from "formik";
import { OptionType } from "@/common/types";
import { MemberPayload, memberSchema, updateMemberSchema, UpdateMemberPayload } from "@/repositories/member/schemas";
import { useMutation, useQuery } from "react-query";
import { MemberRepository } from "@/repositories";
import { useAppSelector } from "@/hooks/redux";

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
  const user = useAppSelector((state) => state.auth.user);

  const userRole = user?.user_roles[0]?.role.name || "Salesman";
  const [roles, setRole] = useState<OptionType[]>([]);
  const [permissions, setPermission] = useState<OptionType[]>([]);

  const roleVisibilityMap = {
    SuperAdmin: ["Admin", "Secretary", "Salesman"],
    Admin: ["Admin", "Secretary", "Salesman"],
    Secretary: ["Secretary", "Salesman"],
    Salesman: ["Salesman"],
  };

  useEffect(() => {
    if (role) {
      const filteredRoles = role?.data
        ?.filter((item: any) =>
          roleVisibilityMap[userRole]?.includes(item?.name)
        )
        .map((item: any) => ({
          value: item?.name,
          key: Number(item?.id),
        }));
      setRole(filteredRoles);
    }
    if (permission) {
      setPermission(
        permission?.data?.map((item: any) => ({
          key: item?.id,
          value: `${item?.name} ${item?.resource}`,
        }))
      );
    }
  }, [role, permission, userRole]);

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

        if (values.phone?.trim()) {
          updatePayload.phone = values.phone;
        }

        updatePayload.status = values.status;

        updateMutation.mutate(updatePayload, {
          onSuccess: () => {
            router.push("/(root)/(tabs)/members/members");
          },
        });
      } else {
        const createPayload: MemberPayload = {
          user_name: values.user_name,
          email: values.email,
          password: values.password,
          full_name: values.full_name,
          permission_ids: values.permission_ids,
          status: values.status,
          role_id: values.role_id,
        };

        if (values.phone?.trim()) {
          createPayload.phone = values.phone;
        }

        mutate(createPayload, {
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
