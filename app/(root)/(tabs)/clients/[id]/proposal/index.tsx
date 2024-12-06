import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "react-query";
import { vs } from "react-native-size-matters";
import { images } from "@/constants";
import { CustomButton } from "@/common/components";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { CalendarDays, NotepadText, Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ClientRepository } from "@/repositories/client/client";

interface Client {
  id: number;
  name: string;
  type: string;
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

interface ProjectResponse {
  statusCode: number;
  message: string;
  data: Project[];
}

const fetchProposals = async (id: number | string): Promise<ProjectResponse> => {
  const clientRepo = ClientRepository.getInstance();
  return clientRepo.getProposalsByProject(Number(id));
};

const Proposal = () => {
  const { id: projectId } = useLocalSearchParams();
  const navigation = useNavigation();

  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery<ProjectResponse, Error>(
    ['proposals', projectId], 
    () => fetchProposals(projectId || ''),
    {
      enabled: !!projectId, 
      staleTime: 5000, 
      cacheTime: 30 * 60 * 1000, // Cache for 30 minutes
    }
  );

  const AddButton = () => (
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
        onPress={() => {
          router.push("/(root)/(tabs)/proposal/job-details");
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

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Proposals",
      headerRight: () => <AddButton />,
    });
  }, [navigation]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading proposals...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center">
          Error loading proposals: {error?.message}
        </Text>
        <CustomButton
          title="Retry"
          onPress={() => refetch()}
        />
      </View>
    );
  }

  const proposals = data?.data || [];
  if (proposals.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-grow flex-col items-center justify-center px-4">
          <NotepadText size={100} strokeWidth={1} className="text-blue" />
          <View className="mt-4">
            <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
              We can't find any proposals yet!
            </Text>
            <View className="w-[158px] mx-auto mt-5">
              <CustomButton
                title="Add Proposal"
                onPress={() =>
                  router.push("/(root)/(tabs)/proposal/job-details")
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        <View className="pb-4">
          {proposals.map((proposal) => (
            <TouchableOpacity
              key={proposal.id}
              onPress={() => {
                router.push({
                  pathname: "/(root)/(tabs)/clients/[id]/proposal/proposal-detail",
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
                    clientId: proposal.client_id
                  }
                });
              }}
              className="bg-white border border-light p-2.5 rounded-[20px] mt-2.5"
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
                    className="text-base sm:text-lg font-ManropeBold text-dark w-full"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {proposal.job_name || 'Unnamed Project'}
                  </Text>
                  <View>
                    <View className="flex-row items-center mt-1">
                      <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
                        <View className="bg-blue w-1.5 h-1.5" />
                      </View>
                      <Text className="text-sm font-ManropeMedium text-blue ml-2">
                        {proposal.client?.type || 'Construction'}
                      </Text>
                    </View>
                    <Text
                      className="text-sm font-ManropeMedium text-dark mt-1"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {proposal.address || 'No Address'}
                    </Text>
                  </View>
                </View>
              </View>
              <Text 
                className="text-sm font-ManropeMedium text-dark-100 mt-3"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                Project details for {proposal.job_name}
              </Text>
              <View className="bg-light w-full h-px my-4" />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Image
                    source={images.user}
                    resizeMode="cover"
                    className="rounded-full border-2 border-white"
                    style={{ width: vs(30), height: vs(30) }}
                  />
                  <Text className="text-sm text-dark-100 font-ManropeMedium ml-1.5">
                    {proposal.client?.name || 'Unknown Client'}
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