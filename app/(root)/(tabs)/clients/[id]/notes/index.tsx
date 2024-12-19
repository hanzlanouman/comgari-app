//app\(root)\(tabs)\clients\[id]\notes\index.tsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images, icons, getImageUrl } from "@/constants";
import { useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { CustomButton } from "@/common/components";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Plus } from "lucide-react-native";
import { useQuery } from "react-query";
import { ClientRepository } from "@/repositories/client/client";

const Notes = () => {
  const { id } = useLocalSearchParams();
  const clientId = typeof id === "string" ? parseInt(id, 10) : id;
  const clientRepo = ClientRepository.getInstance();
  const navigation = useNavigation();
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
        onPress={() => router.push(
          `/clients/${clientId}/notes/add-note`,
        )}
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

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Notes",
      headerRight: () => <AddButton />,
    });
  }, [navigation]);
  const {
    data: clientNotes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clientNotes", clientId],
    queryFn: () => clientRepo.getNotes(clientId),
    enabled: !!clientId,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }
  // console.log(clientNotes)
  // Check if we have valid data
  const hasData =
    clientNotes && Array.isArray(clientNotes) && clientNotes.length > 0;

    const processNoteText = (html: string) => {
      if (!html) return "";
      const strippedText = html.replace(/<[^>]*>/g, ''); // Remove HTML tags
      return strippedText.length > 30 ? `${strippedText.slice(0, 30)}...` : strippedText;
    };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
        {hasData ? (
          <View className="pb-4">
            {clientNotes?.map((note) => (
              <TouchableOpacity
                key={note.id}
                onPress={() => router.push({
                  pathname: "/(root)/(tabs)/clients/[id]/notes/[noteId]",
                  params: {
                    id: clientId,
                    noteId: note.id,
                    noteDetails: JSON.stringify(note)
                  }
                })}
                className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5"
              >
                <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6">
                  {processNoteText(note?.notes)}
                </Text>
                <View className="flex-row items-center justify-between mt-2.5">
                  <View className="flex-row items-center">
                    <Image
                      source={note.project?.created_by?.user[0]?.avatar
                        ? getImageUrl(note.project.created_by.user[0].avatar)
                        : images.user}
                      resizeMode="cover"
                      className="rounded-full border-2 border-white"
                      style={{ width: vs(30), height: vs(30) }}
                    />
                    <Text className="text-sm text-dark-100 font-ManropeMedium ml-1.5">
                      {note.project?.created_by?.user[0]?.full_name ||
                        "Unknown User"}
                    </Text>
                  </View>
                  <Text className="text-sm text-dark-100 font-ManropeMedium">
                    {new Date(note.created_at)?.toLocaleDateString()}
                  </Text>
                </View>

              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-grow flex-col items-center justify-center px-4">
            <Image
              source={icons?.noNotes}
              resizeMode="contain"
              style={{ width: scale(80), height: vs(80) }}
              className="mx-auto"
            />
            <View className="mt-8">
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                No Notes found, please
              </Text>
              <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                create notes
              </Text>
              <View className="w-[180px] mx-auto mt-5">
                <CustomButton
                  title="Create Note"
                  onPress={() => router.push(
                    `/clients/${clientId}/notes/add-note`,
                  )}
                  IconLeft={Plus}
                  iconSize={20}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notes;
