import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "react-query";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";
import { router } from "expo-router";
import { CustomButton, AppContainer } from "@/common/components";
import ClientCard from "./components/ClientCard";
import { ClientRepository } from "@/repositories/client/client";
import { ClientListingPayload } from "@/repositories/client/schemas";
import { useAppSelector } from "@/hooks/redux";
import { ClientType, ClientStatus } from '@/common/types';

import WithRole from "@/common/components/withRole";

interface Client {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  status: ClientStatus;
  type: ClientType;
  createdAt: string;
  updatedAt: string;
  brief: string;
  agencyId: number;
  createdById: number;
  client_user: Array<{
    id: number;
    member_id: number;
    client_id: number;
  }>;
}

const Clients: React.FC = () => {
  const clientRepo = ClientRepository.getInstance();
  const [clients, setClients] = useState<Client[]>([]);
  const [start, setStart] = useState(0);
  const [limit] = useState(10);

  const user = useAppSelector((state) => state.auth.user);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data, isError, isLoading, isFetching, refetch } = useQuery<Client[]>(
    ["clients", start],
    async () => {

      const clientListingPayload: ClientListingPayload = {
        start,
        limit,
      };

      const response = await clientRepo.getClients(clientListingPayload, {
        user,
      });
      return response;
    },
    {
      keepPreviousData: true,
      enabled: !!user && isAuthenticated,
    }
  );

  useEffect(() => {
    if (data) {
      setClients(start === 0 ? data : (prevClients) => [...prevClients, ...data]);
    }
  }, [data, start]);

  const handleRefresh = async () => {
    setStart(0);
    setClients([]);
    await refetch();
  };

  const handleLoadMore = () => {
    if (!isFetching && data?.length === limit) {
      setStart((prevStart) => prevStart + limit);
    }
  };

  const handleAddClient = () => {
    router.push("/(root)/(tabs)/clients/add-client");
  };

  const handleClientPress = (clientId: number) => {
    router.push(`/clients/${clientId}`);
  };

  const renderEmptyState = () => (
    <View className="flex-grow flex-col items-center justify-center px-4">
      <Image
        source={images.member}
        resizeMode="contain"
        style={{ width: scale(150), height: vs(150) }}
        className="mx-auto"
      />
      <View>
        <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
          We can't find any
        </Text>
        <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
          clients yet!
        </Text>
        <WithRole permission="manage" resource="client" user={user!}>
          <View className="w-[158px] mx-auto mt-5">
            <CustomButton
              title="Add Client"
              onPress={handleAddClient}
            />
          </View>
        </WithRole>
      </View>
    </View>
  );

  const renderClientsList = () => (
    <View className="pb-20">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={{
            ...client,
            description: client.description,
            category: client.type,
            status: client.status,
            progress: 75,
          }}
          onPress={() => handleClientPress(client.id)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer
        isError={isError}
      >
        <ScrollView
          className="flex-1 px-5"
          onRefresh={handleRefresh}
          refreshing={isLoading}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        >
          <Text className="text-sm  text-dark-100 mt-3">
            Track client interactions, manage leads, and monitor project statuses. View assignments, property details, and due dates for each client.
          </Text>
          {clients.length > 0 ? renderClientsList() : renderEmptyState()}
        </ScrollView>
      </AppContainer>
    </SafeAreaView>
  );
};

export default Clients;
