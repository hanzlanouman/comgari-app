import { useEffect } from "react";
import { useAppSelector } from "./redux";
import { IS_ANDROID } from "@/utils";
import { router } from "expo-router";

export const useRedirectIfIOS = () => {
  const { isAuthenticated, isSubscribed } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (IS_ANDROID) return;

    if (isAuthenticated) {
      if (!isSubscribed) {
       
        router.replace("/(auth)/go-pro");
      } else {
        
        router.replace("/(root)/(tabs)/home");
      }
    } else {
      router.replace("/(auth)/sign-in");
    }
  }, [isAuthenticated, isSubscribed]);
};
