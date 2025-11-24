/* eslint-disable prettier/prettier */
import "../global.css";
import { useFonts } from "expo-font";
import { ErrorBoundaryProps, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { Fragment, useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { useAppSelector } from "@/hooks/redux";
import { SimpleActivityIndicator } from "@/common/components/Loader";
import { AuthorizationProvider } from "@/context/PermissionContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AlertBox, CustomButton, ProgressBox } from "@/common/components";
import { Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          marginBottom: 10,
        }}
      >
        {error.message}
      </Text>
      <View className="flex-row justify-center items-center">
        <CustomButton title="Try Again" onPress={retry} />
      </View>
    </View>
  );
}

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Manrope-ExtraLight": require("../assets/fonts/Manrope-ExtraLight.ttf"),
    "Manrope-Light": require("../assets/fonts/Manrope-Light.ttf"),
    "Manrope-Regular": require("../assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Medium": require("../assets/fonts/Manrope-Medium.ttf"),
    "Manrope-SemiBold": require("../assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-Bold": require("../assets/fonts/Manrope-Bold.ttf"),
    "Manrope-ExtraBold": require("../assets/fonts/Manrope-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LayoutWrapper />
        </GestureHandlerRootView>
      </Provider>
    </QueryClientProvider>
  );
}

function LayoutWrapper() {
  const isLoading = useAppSelector((state) => state.app.isloading);
  return (
    <Fragment>
      {isLoading && <SimpleActivityIndicator />}
      <AlertBox />
      <ProgressBox />
      <AuthorizationProvider>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="index"
              options={{ headerShown: false, headerTitle: "Home" }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false, headerTitle: "Auth" }}
            />
            <Stack.Screen
              name="(root)"
              options={{ headerShown: false, headerTitle: "Home" }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </BottomSheetModalProvider>
      </AuthorizationProvider>
    </Fragment>
  );
}
