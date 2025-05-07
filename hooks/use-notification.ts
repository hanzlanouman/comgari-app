import { useEffect } from "react";

import * as Device from "expo-device";

import { Alert, Platform } from "react-native";

import Constants from "expo-constants";

import * as Notifications from "expo-notifications";

import { useAppSelector } from "./redux";
import { useMutation } from "react-query";
import { AuthRepo } from "@/repositories";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useNotification() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { mutate: saveToken } = useMutation({
    mutationFn: (token: string) => AuthRepo.addToken(token),
    onError: (error) => {
      Alert.alert("Error Updating Notifications token", error?.message);
    }
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        saveToken(token);
      }
    })();
  }, [isAuthenticated]);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("Error", "Failed to get push token for push notification!");

        return;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error("Project ID not found");
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        // eslint-disable-next-line
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Somthing Went Wrong");
      }
    } else {
      Alert.alert("Error", "Must use physical device for Push Notifications");
    }

    return token;
  }
}
