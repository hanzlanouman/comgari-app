import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";
import { router } from "expo-router";
import { CustomButton, AppContainer } from "@/common/components";
import ClientCard from "./components/ClientCard";
import { ClientRepository } from "@/repositories/client/client";

interface Client {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  type: "INDIVIDUAL" | "COMPANY";
  createdAt: string;
  updatedAt: string;
  client_user: Array<{
    id: number;
    member_id: number;
    client_id: number;
  }>;
}

const Clients: React.FC = () => {
  const clientRepo = ClientRepository.getInstance();
  const [clients, setClients] = useState<Client[]>([]);

  const { data, isError, isLoading, refetch } = useQuery<{ data: Client[] }>(
    "clients",
    async () => {
      const response = await clientRepo.getClients();
      return response;
    }
  );

  useEffect(() => {
    if (data?.data) {
      setClients(data.data);
    }
  }, [data]);

  const handleRefresh = async () => {
    await refetch();
  };

  const handleAddClient = () => {
    router.push("/(root)/(tabs)/clients/add-client");
  };

  const renderEmptyState = () => (
    <View className="flex-grow flex-col items-center justify-center px-4">
      <Image
        source={images.client}
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
        <View className="w-[158px] mx-auto mt-5">
          <CustomButton
            title="Add Client"
            onPress={handleAddClient}
          />
        </View>
      </View>
    </View>
  );

  const renderClientsList = () => (
    <View className="pb-20">
      {clients.map((client) => (
        <ClientCard 
          key={client.id} 
          client={client}
          onPress={() => router.push(`/(root)/(tabs)/clients/${client.id}`)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppContainer 
        isError={isError}
        isLoading={isLoading}
      >
        <ScrollView 
          className="flex-1 px-5"
          onRefresh={handleRefresh}
          refreshing={isLoading}
        >
          {clients.length > 0 ? renderClientsList() : renderEmptyState()}
        </ScrollView>
      </AppContainer>
    </SafeAreaView>
  );
};

export default Clients;