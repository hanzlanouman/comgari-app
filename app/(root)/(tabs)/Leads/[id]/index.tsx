//app\(root)\(tabs)\Leads\[id]\index.tsx
import React from "react";
import { useRouter, useNavigation } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useQuery } from "@tanstack/react-query";
import { vs } from "react-native-size-matters";
import { useLocalSearchParams } from "expo-router";
import { useRef, useEffect } from "react";

import { LinearGradient } from "expo-linear-gradient";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Pencil } from "lucide-react-native";
import { ClientEditModal } from "../components/ClientEditModal";
import { AppContainer } from "@/common/components";
import { ClientRepository } from "@/repositories/client/client";
import { useAppSelector } from "@/hooks/redux";
import { images, icons, getImageUrl } from "@/constants";
import { ClientStatus, ClientType } from "@/common/types";

interface ClientUser {
  id: number;
  client_id: number;
  member_id: number;
  created_at: string;
  updatedAt: string;
}

interface Agency {
  id: number;
  name: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  client_id: number;
  created_by_id: number;
  location: string | null;
  metadata: string | null;
}

interface Client {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  status: ClientStatus;
  type: ClientType;
  createdAt: string;
  updatedAt: string;
  brief?: string | null;
  agencyId: number;
  createdById: number;
  email?: string;
  address?: string;
  phone?: string;
  agency: Agency;
  client_user: ClientUser[];
  project: Project[];
}

const navigationItems = [
  {
    id: 1,
    icon: "brief",
    title: "Brief",
    description: "Brief yourself in detail",
    route: "/(root)/(tabs)/Leads/{projectId}/brief",
  },
  {
    id: 2,
    icon: "tasks",
    title: "Tasks",
    description: "You can add tasks here",
    route: "/(root)/(tabs)/Leads/{projectId}/task",
  },
  {
    id: 3,
    icon: "notes",
    title: "Notes",
    description: "Add important notes",
    route: "/(root)/(tabs)/Leads/{projectId}/notes",
  },
  {
    id: 4,
    icon: "media",
    title: "Media",
    description: "Find and upload media",
    route: "/(root)/(tabs)/Leads/{projectId}/media",
  },
  {
    id: 5,
    icon: "tasks",
    title: "Proposal",
    description: "Create a proposal for the client",
    route: "/(root)/(tabs)/Leads/{projectId}/proposal",
  },
  {
    id: 6,
    icon: "notes",
    title: "Invoice",
    description: "Create a Invoice for the client",
    route: "/(root)/(tabs)/Leads/{projectId}/invoices",
  },
] as const;
export const options = {};

const ClientDetailPage: React.FC = () => {
  const { id } = useLocalSearchParams();
  const clientIdNum =
    typeof id === "string" ? parseInt(id, 10) : (id as unknown as number);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();
  const clientRepo = ClientRepository.getInstance();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const request = {
    user: {
      id: user?.id,
      auth_id: user?.authId,
    },
  };

  const EditButton = () => (
    <LinearGradient
      colors={["#1B78B9", "#63348F"]}
      style={{
        borderRadius: 999,
        width: 32,
        height: 32,
      }}
      start={[0, 0]}
      end={[1, 1]}
    >
      <TouchableOpacity
        onPressIn={() => {
          bottomSheetRef.current?.present();
        }}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pencil size={18} color="#ffffff" />
      </TouchableOpacity>
    </LinearGradient>
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Client Detail",
      headerRight: () => <EditButton />,
    });
  }, [navigation]);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["client", clientIdNum],
    queryFn: () => clientRepo.getSingleClient(clientIdNum),
    enabled: !!clientIdNum && !!user && isAuthenticated,
  });

  // Handle error with useEffect
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching client:", error);
    }
  }, [isError, error]);

  if (isLoading || !data) {
    return (
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["bottom", "left", "right"]}
      >
        <AppContainer loading={true}>
          <View />
        </AppContainer>
      </SafeAreaView>
    );
  }

  const client = data as unknown as Client;

  if (isError || !client) {
    return (
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["bottom", "left", "right"]}
      >
        <AppContainer isError={true}>
          <View />
        </AppContainer>
      </SafeAreaView>
    );
  }

  const handleNavigationPress = (route: string) => {
    if (route.includes("{projectId}")) {
      const projectId = client?.project?.[0]?.id;
      const resolvedRoute = route.replace(
        "{projectId}",
        String(projectId || "")
      );
      router.push({
        pathname: resolvedRoute,
        params: { clientId: clientIdNum },
      });
    } else {
      router.push({
        pathname: route,
        params: { clientId: clientIdNum },
      });
    }
  };

  const renderNavigationItem = (item: (typeof navigationItems)[number]) => (
    <View key={item.id} className="px-1.5 mt-3" style={{ width: "50%" }}>
      <TouchableOpacity
        onPress={() => handleNavigationPress(item.route)}
        className="border border-light rounded-[20] p-4"
      >
        <View
          className="bg-blue rounded-full flex-row items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          <Image
            source={icons[item.icon]}
            resizeMode="contain"
            className=""
            style={{ width: 23, height: 20 }}
          />
        </View>
        <Text className="text-lg sm:text-xl font-ManropeSemibold text-dark mt-3">
          {item.title}
        </Text>
        <Text className="text-sm font-ManropeMedium text-dark mt-0.5">
          {item.description}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["bottom", "left", "right"]}
      >
        <AppContainer isError={isError} loading={isLoading}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: vs(50) }}
            className="px-4 pt-2.5"
          >
            {client && (
              <View className="bg-white border border-light p-2.5 rounded-[20] mt-2.5">
                <View className="flex-row items-center border-b border-light pb-3.5">
                  <Image
                    source={
                      client?.logo
                        ? { uri: getImageUrl(client.logo) }
                        : images.user
                    }
                    resizeMode="cover"
                    className="rounded-full"
                    style={{ width: vs(45), height: vs(45) }}
                  />
                  <View className="pl-3 flex-grow">
                    <Text className="text-base sm:text-lg font-ManropeBold text-dark">
                      {client?.name || "Unknown"}
                    </Text>
                    {client?.email && (
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(`mailto:${client.email}`)
                        }
                      >
                        <Text className="text-sm font-ManropeMedium text-blue mt-px">
                          {client.email}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View className="mt-3">
                  {client?.phone && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`tel:${client.phone}`)}
                    >
                      <Text className="text-base font-ManropeMedium text-blue">
                        {client.phone}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {client?.description && (
                    <Text className="text-sm font-ManropeMedium text-dark-100 mt-1.5">
                      {client.description}
                    </Text>
                  )}
                  <View className="flex-row items-center justify-between mt-4 border-t border-light pt-3 pb-1">
                    <View className="flex-row items-center">
                      <View
                        className="bg-blue-100 flex-row items-center justify-center"
                        style={{ width: 14, height: 14 }}
                      >
                        <View
                          className="bg-blue"
                          style={{ width: 6, height: 6 }}
                        />
                      </View>
                      <Text className="text-sm font-ManropeMedium text-blue ml-2">
                        {client?.type?.replace("_", " ") || "N/A"}
                      </Text>
                    </View>
                    <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
                      <Text className="text-sm font-ManropeMedium text-green text-center">
                        {client?.status || "Unknown"}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="text-sm font-ManropeMedium text-dark mt-0.5">
                  {client.address}
                </Text>
              </View>
            )}
            <View className="flex-row flex-wrap -mx-1.5 justify-start">
              {navigationItems.map(renderNavigationItem)}
            </View>
          </ScrollView>

          <ClientEditModal
            bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheetModal>}
            clientId={clientIdNum}
            clientData={client}
            request={request as any}
          />
        </AppContainer>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default ClientDetailPage;
