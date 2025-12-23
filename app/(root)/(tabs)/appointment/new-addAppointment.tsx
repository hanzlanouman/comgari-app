import React, { useState, useEffect } from "react";
import { Alert, View, Text, Platform } from "react-native";
import { router } from "expo-router";
import { AddAppointmentForm } from "./components/AddAppointmentForm";
import { ClientRepository } from "@/repositories/client/client";
import { useLocalSearchParams } from "expo-router";

import { MemberRepository } from "@/repositories/member/member";
import { OptionType } from "@/common/types";

// GoogleSignin is conditionally imported below to avoid crashes in Expo Go
let GoogleSignin: any = null;
try {
  GoogleSignin =
    require("@react-native-google-signin/google-signin").GoogleSignin;
} catch (e) {
  console.warn("GoogleSignin not available (expected in Expo Go)");
}

import { AppContainer } from "@/common/components";
import { AuthRepository } from "@/repositories";
import { GoogleWebClientID, GoogleIOSClientID } from "@/common/enviornment";
import { showErrorAlert } from "@/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

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

  const [appointmentAdded, setAppointmentAdded] = useState(false);

  const { data: clientsData, isLoading: isClientsLoading } = useQuery({
    queryKey: ["clients", "leads"],
    queryFn: async () => {
      const [leadsResponse, clientsResponse] = await Promise.all([
        clientRepo.getLeadClients({ start: 0, limit: 1000 }),
        clientRepo.getClients({ start: 0, limit: 1000 }),
      ]);

      const leads = leadsResponse?.data || [];
      const clients = clientsResponse?.data || [];

      return { data: [...leads, ...clients] };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });


  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: () => memberRepo.getMember(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const clientOptions: OptionType[] =
    clientsData?.data.map((client: any) => ({
      key: client?.id,
      value: client?.name,
    })) || [];

  const memberOptions: OptionType[] =
    membersData?.data?.map((member: any) => ({
      key: member?.Auth?.id,
      value: member?.Auth?.username,
    })) || [];


  useEffect(() => {
    if (Platform.OS === "web" || !GoogleSignin) {
      return;
    }

    try {
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
    } catch (error) {
      console.warn("Failed to configure GoogleSignin:", error);
    }
  }, []);

  const handleSubmitSuccess = () => {
    router.push("/(root)/(tabs)/appointment/appointment");
  };

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
        title="Add Appointment"
      >
        <AddAppointmentForm
          clientOptions={clientOptions}
          memberOptions={memberOptions}
          statusOptions={STATUS_OPTIONS}
          isClientsLoading={isClientsLoading}
          isMembersLoading={isMembersLoading}
          onSubmitSuccess={handleSubmitSuccess}
          setAppointmentAdded={setAppointmentAdded}
          isAppointmentAdded={appointmentAdded}
          isEditing={isEditing === "true"}
          initialData={
            isEditing === "true"
              ? {
                clientId: parseInt(clientId as string),
                startTime: startTime as string,
                endTime: endTime as string,
                notes: notes as string,
                status: status as string,
                title: title as string,
                appointmentId: parseInt(appointmentId as string),
                members: parsedMembers,
              }
              : undefined
          }
        />
      </AppContainer>
    </SafeAreaView>
  );
};

export default AddAppointment;
