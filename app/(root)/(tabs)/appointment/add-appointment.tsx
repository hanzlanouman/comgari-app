
import React, { useState, useEffect } from "react";
import { SafeAreaView, Alert } from "react-native";
import { router } from "expo-router";
import { AddAppointmentForm } from "./components/AddAppointmentForm";
import { ClientRepository } from "@/repositories/client/client";
import { useLocalSearchParams } from "expo-router";

import { MemberRepository } from "@/repositories/member/member";
import { OptionType } from "@/common/types";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { AppContainer } from "@/common/components";
import { AuthRepository } from "@/repositories";
import { GoogleWebClientID, GoogleIOSClientID } from "@/common/enviornment"
import { showErrorAlert } from "@/utils";

const STATUS_OPTIONS = [
  { key: "Scheduled", value: "Scheduled" },
  { key: "PendingConfirmation", value: "PendingConfirmation" },
  { key: "Completed", value: "Completed" },
  { key: "Cancelled", value: "Cancelled" },
  { key: "Confirmed", value: "Confirmed" },
  { key: "Rescheduled", value: "Rescheduled" },
  { key: "InProgress", value: "InProgress" },
  { key: "NoShow", value: "NoShow" },
  { key: "Expired", value: "Expired" },
];

const AddAppointment = () => {
  const {
    isEditing,
    clientId,
    startTime,
    endTime,
    notes,
    status,
    title,
    appointmentId,
    members,
  } = useLocalSearchParams();

  const parsedMembers = members ? JSON.parse(members as string) : [];
  const clientRepo = ClientRepository.getInstance();
  const memberRepo = MemberRepository.getInstance();
  const authRepo = AuthRepository.getInstance();

  const [clientOptions, setClientOptions] = useState<OptionType[]>([]);
  const [memberOptions, setMemberOptions] = useState<OptionType[]>([]);

  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [appointmentAdded, setAppointmentAdded] = useState(false);

  const fetchClients = async () => {
    setIsClientsLoading(true);
    try {
      const clients = await clientRepo.getClients(
        { start: 0, limit: 100 },
      );

      const options: OptionType[] = clients?.map((client: any) => ({
        key: client.id,
        value: client.name,
      }));
      setClientOptions(options.length ? options : []); // Default to empty array if no clients
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to fetch clients");
    } finally {
      setIsClientsLoading(false);
    }
  };

  const fetchMembers = async () => {
    setIsMembersLoading(true);
    try {
      const response = await memberRepo.getMember();
      const members = response.data;

      const options: OptionType[] = members.map((member: any) => ({
        key: member.Auth.id,
        value: member.Auth?.username,
      }));
      setMemberOptions(options.length ? options : []);

    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to fetch members");
    } finally {
      setIsMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitSuccess = () => {
    router.push("/(root)/(tabs)/appointment/appointment");
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GoogleWebClientID,
      iosClientId: GoogleIOSClientID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/calendar",
      ],
    });
  }, []);

  const handlePress = async () => {
    try {
      setAppointmentAdded(true);
      const exisit = await authRepo.checkOAuth();

      if (exisit) {
        return;
      }

      const isAvailable = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (!isAvailable) {
        showErrorAlert("Google Play Services is not available");
        return;
      }

      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }

      const response = await GoogleSignin.signIn();

      const token = await GoogleSignin.getTokens();
      const payload = {
        token: token.accessToken,
        server_auth_code: response?.data?.serverAuthCode,
        idToken: response?.data?.idToken,
      };

      await authRepo.verifyGoogleToken(payload);

    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to verify Google Login");
    }
  };

  const onGoogleAppointment = async () => {
    handlePress();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer
        confirmationMessage="Do you want to add the appointment in Google Calendar"
        isConfirm={true}
        onConfirm={onGoogleAppointment}
        title="Add Appointment">
        <AddAppointmentForm
          clientOptions={clientOptions}
          memberOptions={memberOptions}
          statusOptions={STATUS_OPTIONS}
          isClientsLoading={isClientsLoading}
          isMembersLoading={isMembersLoading}
          onSubmitSuccess={handleSubmitSuccess}
          setAppointmentAdded={setAppointmentAdded}
          isAppointmentAdded={appointmentAdded}
          isEditing={isEditing === 'true'}
          initialData={isEditing === 'true' ? {
            clientId: parseInt(clientId as string),
            startTime: startTime as string,
            endTime: endTime as string,
            notes: notes as string,
            status: status as string,
            title: title as string,
            appointmentId: parseInt(appointmentId as string),
            members: parsedMembers,
          } : undefined}
        />
      </AppContainer>
    </SafeAreaView>
  );
};

export default AddAppointment;