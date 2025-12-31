import React, { useEffect, useState } from "react";
import { ScrollView, View, Alert, Text, KeyboardAvoidingView } from "react-native";
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from "expo-router";
import { useFormik } from "formik";
import { useAppSelector } from "@/hooks/redux";
import { CustomButton, AppContainer } from "@/common/components";
import AddClientForm from "./components/AddClientForm";
import {
  createClientSchema,
  updateClientSchema,
} from "@/repositories/client/schemas";
import {
  OptionType,
  ClientType,
  CLIENT_TYPES,
  ClientStatus,
  CLIENT_STATUS,
} from "@/common/types";
import { ClientRepository } from "@/repositories/client/client";
import { MemberRepository } from "@/repositories/member/member";
import { useQueryClient } from "@tanstack/react-query";
import { Action } from "@/common/enum";

import {
  CreateClientPayload,
  UpdateClientPayload,
} from "@/repositories/client/schemas";

interface MemberAction {
  staff_id: number;
  action: Action;
}

const AddClient = () => {
  const clientRepo = ClientRepository.getInstance();
  const memberRepo = MemberRepository.getInstance();
  const queryClient = useQueryClient();
  const [memberOptions, setMemberOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingMemberIds, setExistingMemberIds] = useState<number[]>([]);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const params = useLocalSearchParams();
  const parseIds = (ids: string | string[] | undefined): number[] => {
    if (!ids) return [];
    if (Array.isArray(ids)) return ids.map(Number);
    return ids.split(",").map(Number);
  };
  const clientUserIds = parseIds(params.clientUserIds);

  const clientId =
    params.isEditing === "true" ? Number(params.clientId) : undefined;

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch members
        const membersData = await memberRepo.getMemberList();
        const members = membersData || [];
        const options: OptionType[] = members.map((member) => ({
          key: member.Auth.id,
          value: member.Auth.user.full_name || "Unknown",
        }));
        setMemberOptions(options);

        if (params.isEditing === "true" && clientId) {
          setIsEditing(true);
          if (params?.clientUserIds) {
            setExistingMemberIds(clientUserIds);
            formik.setFieldValue("member_ids", clientUserIds);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        Alert.alert("Error", "Failed to load initial data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated, clientId]);

  const clientTypeOptions: OptionType[] = CLIENT_TYPES.map((type) => ({
    key: type,
    value:
      type.charAt(0).toUpperCase() +
      type.slice(1).toLowerCase().replace("_", " "),
  }));

  const statusOptions: OptionType[] = CLIENT_STATUS.map((status) => ({
    key: status,
    value:
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase().replace("_", " "),
  }));

  const initialValues = {
    name: String(params.name || ""),
    description: String(params.description || ""),
    logo: String(params.logo || ""),
    type: (params.type as ClientType) || "Construction",
    status: (params.status as ClientStatus) || ClientStatus.Lead,
    member_ids: clientUserIds
      ? Array.isArray(clientUserIds)
        ? clientUserIds.map(Number)
        : [Number(clientUserIds)]
      : [],
    email: String(params.email || ""),
    phone: String(params.phone || ""),
    address: String(params.address || ""),
    client_Staff: [] as MemberAction[],
  };
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setIsLoading(true);

      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Prepare member actions by comparing with existing members
      const addedMembers = values.member_ids.filter(
        (id) => !existingMemberIds.includes(id)
      );
      const removedMembers = existingMemberIds.filter(
        (id) => !values.member_ids.includes(id)
      );

      const memberActions: MemberAction[] = [
        ...addedMembers.map((id) => ({ staff_id: id, action: Action.ADD })),
        ...removedMembers.map((id) => ({
          staff_id: id,
          action: Action.REMOVE,
        })),
      ];

      const payload = {
        ...values,
        client_Staff: memberActions,
        status: isEditing ? values.status : ClientStatus.Lead,
      };

      if (isEditing && clientId) {
        await clientRepo.updateClient(
          String(clientId),
          payload as UpdateClientPayload
        );
      } else {
        await clientRepo.createClient(
          { user: { id: user.id, auth_id: user.authId } },
          payload as CreateClientPayload
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["leads-clients"] });
      router.replace("/(root)/(tabs)/clients/clients");
    } catch (error) {
      console.error("Error saving client:", error);
      Alert.alert("Error", "Failed to save client. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: isEditing ? updateClientSchema : createClientSchema,
    onSubmit: handleSubmit,
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">

        <AppContainer>
          <Text className="text-sm mb-6 px-4 text-black">
            Add new team clients by filling out their details below to onboard
            them.
          </Text>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
            <AddClientForm
              formik={formik}
              typeOptions={clientTypeOptions}
              statusOptions={statusOptions}
              memberOptions={memberOptions}
              isEditing={isEditing}
              ClientStatus={ClientStatus}
            />
          </ScrollView>
          <View className="p-4 bg-white">
            <CustomButton
              title={isEditing ? "Update Client" : "Add Client"}
              onPress={() => formik.handleSubmit()}
              disabled={isLoading}
            />
          </View>
        </AppContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddClient;
