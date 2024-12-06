import React, { useState, useEffect } from "react";
import { SafeAreaView, Alert } from "react-native";
import { router } from "expo-router";
import { AddAppointmentForm } from "./components/AddAppointmentForm";
import { ClientRepository } from "@/repositories/client/client";
import { MemberRepository } from "@/repositories/member/member";
import { useAppSelector } from "@/hooks/redux";
import { OptionType } from '@/common/types';

const STATUS_OPTIONS = [
  { key: "Scheduled", value: "Scheduled" },
  { key: "In Progress", value: "In Progress" },
  { key: "Completed", value: "Completed" },
  { key: "Cancelled", value: "Cancelled" },
];

const AddAppointment = () => {
  const clientRepo = ClientRepository.getInstance();
  const memberRepo = MemberRepository.getInstance();

  const user = useAppSelector((state) => state.auth.user);

  const [clientOptions, setClientOptions] = useState<OptionType[]>([]);
  const [memberOptions, setMemberOptions] = useState<OptionType[]>([]);

  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [isMembersLoading, setIsMembersLoading] = useState(false);

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

  const fetchMembers = async () => {
    setIsMembersLoading(true);
    try {
      const response = await memberRepo.getMember();
      const members = response.data;
      const options: OptionType[] = members.map((member) => ({
        key: member.Auth.id,
        value: member.Auth?.username,
      }));
      setMemberOptions(options);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch members");
    } finally {
      setIsMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchMembers();
  }, []);

  const handleSubmitSuccess = () => {
    router.push("/(root)/(tabs)/appointment/appointment");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AddAppointmentForm 
        clientOptions={clientOptions}
        memberOptions={memberOptions}
        statusOptions={STATUS_OPTIONS}
        isClientsLoading={isClientsLoading}
        isMembersLoading={isMembersLoading}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </SafeAreaView>
  );
};

export default AddAppointment;