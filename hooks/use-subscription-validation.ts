import { useEffect } from "react";
import { AppState } from "react-native";
import { useAppDispatch, useAppSelector } from "./redux";
import { setSubscribed } from "@/store";
import { PaymentRepository } from "@/repositories/payment/payment";
import { IS_IOS } from "@/utils";

export const useSubscriptionValidation = () => {
  const { isAuthenticated, isSubscribed } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated || !IS_IOS) return;

    const checkSubscription = async () => {
      try {
        const paymentRepo = PaymentRepository.getInstance();
        const trialStatus = await paymentRepo.getTrialStatus();
        const hasAccess =
          trialStatus?.has_active_subscription || trialStatus?.is_on_trial;
        if (isSubscribed && !hasAccess) {
          dispatch(setSubscribed(false));
        }
      } catch {
        // Don't revoke access on network failure — fail open
      }
    };

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        checkSubscription();
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated, isSubscribed, dispatch]);
};
