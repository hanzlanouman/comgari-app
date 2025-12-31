import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useQuery } from "@tanstack/react-query";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";
import { router } from "expo-router";
import { CustomButton, AppContainer } from "@/common/components";
import ClientCard from "./components/ClientCard";
import { ClientRepository } from "@/repositories/client/client";
import { ClientListingPayload } from "@/repositories/client/schemas";
import { useAppSelector } from "@/hooks/redux";
import { ClientType, ClientStatus } from "@/common/types";

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
  client_user: {
    id: number;
    member_id: number;
    client_id: number;
  }[];
}

const Clients: React.FC = () => {
  const clientRepo = ClientRepository.getInstance();
  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pageSize = 10;

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { isError, isLoading, isFetching, refetch, data } = useQuery<Client[]>({
    queryKey: ["clients", page, pageSize],
    queryFn: async () => {
      const clientListingPayload: ClientListingPayload = {
        start: page * pageSize,
        limit: pageSize,
      };

      const response = await clientRepo.getClients(clientListingPayload);
      return Array.isArray(response.data) ? response.data : [];
    },
    placeholderData: (previousData) => previousData,
    enabled: !!user && isAuthenticated,
  });

  // Handle data updates with useEffect instead of onSuccess/onError
  useEffect(() => {
    if (data) {
      if (page === 0) {
        setClients(data);
      } else {
        setClients((prevClients) => [...prevClients, ...data]);
      }
      setHasMore(data.length === pageSize);
    }
    setIsLoadingMore(false);
    setRefreshing(false);
  }, [data, page, pageSize]);

  useEffect(() => {
    if (isError) {
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  }, [isError]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    setClients([]);
    setHasMore(true);
    await refetch();
  }, [refetch]);

  const loadMoreClients = useCallback(() => {
    if (!isFetching && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore, isLoadingMore]);

  const handleAddClient = () => {
    router.push("/(root)/(tabs)/clients/add-client");
  };

  const handleClientPress = (clientId: number) => {
    router.push({
      pathname: "/(root)/(tabs)/clients/[id]",
      params: { id: String(clientId), clientId: String(clientId) },
    });
  };

  const renderEmptyState = () => (
    <View className="flex-grow flex-col items-center justify-center px-4 py-10">
      <Image
        source={images.member}
        resizeMode="contain"
        style={{ width: scale(150), height: vs(150) }}
        className="mx-auto"
      />
      <View>
        <Text className="text-lg sm:text-[22] font-ManropeSemibold text-dark text-center px-4">
          We can't find any
        </Text>
        <Text className="text-lg sm:text-[22] font-ManropeSemibold text-dark text-center px-4">
          clients yet!
        </Text>
        <WithRole permission="manage" resource="client" user={user!}>
          <View className="mx-auto mt-5" style={{ width: 158 }}>
            <CustomButton title="Add Client" onPress={handleAddClient} />
          </View>
        </WithRole>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#1B78B9" />
        <Text className="text-center mt-2 text-gray-500">
          Loading more clients...
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Client }) => (
    <ClientCard
      key={item.id}
      client={{
        ...item,
        description: item.description,
        category: item.type,
        status: item.status,
        progress: 75,
      }}
      onPress={() => handleClientPress(item.id)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer isError={isError}>
        <View className="flex-1 px-5">
          <Text className="text-sm text-dark-100 mt-3 mb-2">
            Track client interactions, manage leads, and monitor project
            statuses. View assignments, property details, and due dates for each
            client.
          </Text>

          {isLoading && !refreshing && page === 0 ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#1B78B9" />
            </View>
          ) : clients.length > 0 ? (
            <FlatList
              data={clients}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: vs(50) }}
              onEndReached={loadMoreClients}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={["#1B78B9"]}
                />
              }
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </AppContainer>
    </SafeAreaView>
  );
};

export default Clients;
