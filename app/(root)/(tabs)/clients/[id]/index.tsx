//app\(root)\(tabs)\clients\[id]\index.tsx
import React from "react";
import { useRouter, useNavigation } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  phone?: string;
  agency: Agency;
  client_user: ClientUser[];
  project: Project[];
}

const navigationItems = [
  {
    id: "brief",
    title: "Brief",
    description: "Brief yourself in detail",
    route: "/(root)/(tabs)/clients/{projectId}/brief",
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "You can add tasks here",
    route: "/(root)/(tabs)/clients/{projectId}/task",
  },
  {
    id: "notes",
    title: "Notes",
    description: "Add important notes",
    route: "/(root)/(tabs)/clients/{projectId}/notes",
  },
  {
    id: "media",
    title: "Media",
    description: "Find all media files here",
    route: "/(root)/(tabs)/clients/{projectId}/media",
  },
  {
    id: "proposal",
    title: "Proposal",
    description: "Create a proposal for the client",
    route: "/(root)/(tabs)/clients/{projectId}/proposal",
  },
  {
    id: "invoice",
    title: "Invoice",
    description: "Create a Invoice for the client",
    route: "/(root)/(tabs)/clients/{projectId}/add-invoice",
  },
] as const;
export const options = {};

const ClientDetailPage: React.FC = () => {
  const { id } = useLocalSearchParams();
  const clientIdNum = typeof id === "string" ? parseInt(id, 10) : id;
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();
  const clientRepo = ClientRepository.getInstance();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const request: Request = {
    user: {
      id: user.id,
      auth_id: user.authId,
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
      end={[1, 1]}>
      <TouchableOpacity
        onPress={() => {
          bottomSheetRef.current?.present();
        }}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}>
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
  const {
    data: client,
    isError,
    isLoading,
  } = useQuery<Client>(
    ["client", clientIdNum],
    async () => {
      const clientData = await clientRepo.getSingleClient(clientIdNum);
      return clientData;
    },
    {
      enabled: !!clientIdNum && !!user && isAuthenticated,
      onError: (error) => {
        console.error("Error fetching client:", error);
      },
    }
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AppContainer isLoading={true}>
          <View />
        </AppContainer>
      </SafeAreaView>
    );
  }

  if (isError || !client) {
    return (
      <SafeAreaView className="flex-1 bg-white">
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
    <View key={item.id} className="px-1.5 mt-3 w-1/2">
      <TouchableOpacity
        onPress={() => handleNavigationPress(item.route)}
        className="border border-light rounded-[20px] p-4">
        <View className="bg-blue w-10 h-10 rounded-full flex-row items-center justify-center">
          <Image
            source={icons[item.id]}
            resizeMode="contain"
            className="w-[23px] h-5"
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

  const renderClientInfo = () => {
    if (!client) return null;

    return (
      <View className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5">
        <View className="flex-row items-center border-b border-light pb-3.5">
          <Image
            source={
              client?.logo ? { uri: getImageUrl(client.logo) } : images.user
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
              <Text className="text-sm font-ManropeMedium text-dark-100 mt-px">
                {client.email}
              </Text>
            )}
          </View>
        </View>
        <View className="mt-3">
          {client?.phone && (
            <Text className="text-base font-ManropeMedium text-dark">
              {client.phone}
            </Text>
          )}
          {client?.description && (
            <Text className="text-sm font-ManropeMedium text-dark-100 mt-1.5">
              {client.description}
            </Text>
          )}
          <View className="flex-row items-center justify-between mt-4 border-t border-light pt-3 pb-1">
            <View className="flex-row items-center">
              <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                <View className="bg-blue w-1.5 h-1.5" />
              </View>
              <Text className="text-sm font-ManropeMedium text-blue ml-2">
                {client?.type || "N/A"}
              </Text>
            </View>
            <View className="bg-green-100 rounded-3xl px-3 pt-1 pb-1.5 ml-auto">
              <Text className="text-sm font-ManropeMedium text-green text-center">
                {client?.status || "Unknown"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <AppContainer isError={isError} isLoading={isLoading}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="px-4 pt-2.5">
              {renderClientInfo()}
              <View className="flex-row flex-wrap -mx-1.5 justify-start">
                {navigationItems.map(renderNavigationItem)}
              </View>
            </ScrollView>

            <ClientEditModal
              bottomSheetRef={bottomSheetRef}
              clientId={clientIdNum}
              clientData={client}
              request={request}
            />
          </AppContainer>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ClientDetailPage;
