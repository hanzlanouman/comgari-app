/* eslint-disable prettier/prettier */
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Fragment, useEffect } from "react";
import "react-native-reanimated";
import { Provider, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { store } from "@/store";
import { useAppSelector } from "@/hooks/redux";
import { SimpleActivityIndicator } from "@/common/components/Loader";

SplashScreen.preventAutoHideAsync();

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
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <LayoutWrapper />
      </Provider>
    </QueryClientProvider>
  );
}

function LayoutWrapper() {
  const isLoading = useAppSelector((state) => state.app.isloading);
  return (
    <Fragment>
      {isLoading && <SimpleActivityIndicator />}

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Fragment>
  );
}
