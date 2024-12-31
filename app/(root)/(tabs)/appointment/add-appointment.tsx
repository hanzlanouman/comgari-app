//app\(root)\(tabs)\appointment\add-appointment.tsx
import React, { useState, useEffect } from "react";
import { SafeAreaView, Alert } from "react-native";
import { router } from "expo-router";
import { AddAppointmentForm } from "./components/AddAppointmentForm";
import { ClientRepository } from "@/repositories/client/client";
import { useLocalSearchParams } from "expo-router";

import { MemberRepository } from "@/repositories/member/member";
import { useAppSelector } from "@/hooks/redux";
import { OptionType } from "@/common/types";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { AppContainer } from "@/common/components";
import { AuthRepository } from "@/repositories";

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
    appointmentId,
    title,
    clientId,
    status,
    date,
    notes,
    members,
  } = useLocalSearchParams();

  const parsedMembers = members ? JSON.parse(members as string) : []; // Parse members JSON string
  const parsedDate = date ? new Date(date as string) : null; // Convert date string to Date object
  const clientRepo = ClientRepository.getInstance();
  const memberRepo = MemberRepository.getInstance();
  const user = useAppSelector((state) => state.auth.user);

  const [clientOptions, setClientOptions] = useState<OptionType[]>([]);
  const [memberOptions, setMemberOptions] = useState<OptionType[]>([]);

  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [appointmentAdded, setAppointmentAdded] = useState(false);
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

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "225796584741-raqg0b198t68dfolltc0osfgejoenvkr.apps.googleusercontent.com",

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
      const isAvailable = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (!isAvailable) return;

      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }

      const response = await GoogleSignin.signIn();

      const token = await GoogleSignin.getTokens();

      const payload = {
        client_id:
          "225796584741-raqg0b198t68dfolltc0osfgejoenvkr.apps.googleusercontent.com",
        token: token.accessToken,
        refresh_token: token?.refreshToken ?? "",

        idToken: response?.data?.idToken,
      };
      console.log(payload, "Response of Google Sign 2");
      const res = await authRepo.verifyGoogleToken(payload);
    } catch (error) {}
  };

  const checkOAuth = async () => {
    const checkOAuth = await authRepo.checkOAuth();
    console.log(checkOAuth, "check");
    return checkOAuth.data;
  };
  const onGoogleAppointment = async () => {
    const exisit = await checkOAuth();
    console.log(exisit, "check");
    if (!exisit) {
      handlePress();
    }
    setAppointmentAdded(true);
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
        />
      </AppContainer>
    </SafeAreaView>
  );
};

export default AddAppointment;
