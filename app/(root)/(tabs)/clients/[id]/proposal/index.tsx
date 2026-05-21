import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { vs } from "react-native-size-matters";
import { getImageUrl } from "@/constants";
import { CustomButton, SimpleActivityIndicator } from "@/common/components";
import UserAvatar from "@/common/components/UserAvatar";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { CalendarDays, NotepadText, Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ClientRepository } from "@/repositories/client/client";
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
interface Client {
  id: number;
  name: string;
  type: string;
  logo?: string;
}

interface Project {
  id: number;
  client_id: number;
  job_name: string;
  job_phone: string;
  zip_code: number;
  city: string;
  estimated_days: number;
  address: string;
  date: string;
  client: Client;
}

const Proposal = () => {
  const { id: projectId } = useLocalSearchParams();
  const navigation = useNavigation();
  const clientRepo = ClientRepository.getInstance();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<
    any,
    Error
  >({
    queryKey: ["proposals", projectId],
    queryFn: () => clientRepo.getProposalsByProject(Number(projectId)),
    enabled: !!projectId,
    refetchOnWindowFocus: true,
    staleTime: 5000,
    gcTime: 30 * 60 * 1000,
  });

  const AddButton = React.useMemo(() => {
    const AddButtonComponent = () => (
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
            router.push({
              pathname:
                `/(root)/(tabs)/clients/[id]/proposal/add-proposal` as any,
              params: { id: projectId, projectId },
            });
          }}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={18} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>
    );
    AddButtonComponent.displayName = "AddButtonComponent";
    return AddButtonComponent;
  }, [projectId]);

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Proposals",
      headerRight: () => <AddButton />,
    });
  }, [navigation, AddButton]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <SimpleActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center">
          Error loading proposals: {error?.message}
        </Text>
        <CustomButton title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  // Sort proposals by date in descending order (latest first)
  const proposals = [...((data as any)?.data || [])].sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (proposals.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-grow flex-col items-center justify-center px-4">
          <NotepadText size={100} strokeWidth={1} className="text-blue" />
          <View className="mt-4">
            <Text className="text-lg sm:text-[22] font-ManropeSemibold text-dark text-center px-4" style={{ color: "#000000" }}>
              We can't find any proposals yet!
            </Text>
            <View className="mx-auto mt-5" style={{ width: 158 }}>
              <CustomButton
                title="Add Proposal"
                onPress={() =>
                  router.push({
                    pathname:
                      `/(root)/(tabs)/clients/[id]/proposal/add-proposal` as any,
                    params: { id: projectId, projectId },
                  })
                }
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        className="px-4"
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <View className="pb-4">
          {proposals.map((proposal) => (
            <TouchableOpacity
              key={proposal.id}
              onPress={() => {
                router.push({
                  pathname:
                    "/(root)/(tabs)/clients/[id]/proposal/proposal-detail",
                  params: {
                    id: proposal.id,
                    jobName: proposal.job_name,
                    jobPhone: proposal.job_phone,
                    city: proposal.city,
                    zip: proposal.zip_code,
                    estimatedDays: proposal.estimated_days,
                    clientName: proposal.client?.name,
                    clientType: proposal.client?.type,
                    address: proposal.address,
                    date: proposal.date,
                    clientId: proposal.client_id,
                    estimatedCost: proposal.estimated_cost,
                    projectDirector: proposal.project_director,
                    specification: proposal.specification,
                  },
                });
              }}
              className="bg-white border border-light p-2.5 rounded-[20] mt-2.5"
            >
              <View className="flex-row items-center">
                <View
                  className="bg-[#BAE3FF] rounded-xl flex-row items-center justify-center"
                  style={{ width: vs(55), height: vs(55) }}
                >
                  <NotepadText
                    size={vs(30)}
                    strokeWidth={1.2}
                    className="text-blue"
                  />
                </View>
                <View className="pl-3.5 flex-1">
                  <Text
                    className="text-base sm:text-lg font-ManropeBold text-dark"
                    style={{ width: "100%" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {proposal.job_name || "Unnamed Project"}
                  </Text>
                  <View>
                    <View className="flex-row items-center mt-1">
                      <View
                        className="bg-blue-100 flex-row items-center justify-center"
                        style={{ width: 14, height: 14 }}
                      >
                        <View className="bg-blue" style={{ width: 6, height: 6 }} />
                      </View>
                      <Text className="text-sm font-ManropeMedium text-blue ml-2">
                        {proposal.client?.type?.replaceAll("_", " ") ||
                          "Construction"}
                      </Text>
                    </View>
                    <Text
                      className="text-sm font-ManropeMedium text-dark mt-1"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {proposal.city || "No city"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="bg-light my-4" style={{ width: "100%", height: 1 }} />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <UserAvatar imageUrl={proposal.client?.logo} name={proposal.client?.name || 'Client'} size={vs(30)} />
                  <Text className="text-sm text-dark-100 font-ManropeMedium ml-1.5">
                    {proposal.client?.name || "Unknown Client"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <CalendarDays
                    size={16}
                    strokeWidth={1.5}
                    className="text-dark"
                  />
                  <Text className="text-sm text-dark-100 font-ManropeMedium ml-1">
                    {formatDate(proposal.date)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Proposal;
