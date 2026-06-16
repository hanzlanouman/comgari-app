import { useEffect } from "react";
import { useAppSelector } from "./redux";
import { IS_ANDROID, logEvent } from "@/utils";
import { router } from "expo-router";

export const useRedirectIfIOS = () => {
  const { isAuthenticated, isSubscribed } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (IS_ANDROID) return;

    logEvent("useRedirectIfIOS: redirect check", {
      isAuthenticated,
      isSubscribed,
    });

    if (isAuthenticated) {
      if (!isSubscribed) {
        logEvent("useRedirectIfIOS: redirecting to no-subscription, screen will not render");
        router.replace("/(auth)/no-subscription");
      } else {
        logEvent("useRedirectIfIOS: redirecting to home, screen will not render");
        router.replace("/(root)/(tabs)/home");
      }
    } else {
      logEvent("useRedirectIfIOS: redirecting to sign-in, screen will not render");
      router.replace("/(auth)/sign-in");
    }
  }, [isAuthenticated, isSubscribed]);
};
