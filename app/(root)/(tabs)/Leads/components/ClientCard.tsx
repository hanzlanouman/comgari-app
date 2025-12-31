import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { vs } from "react-native-size-matters";
import { images, getImageUrl } from "@/constants";

type ClientCardProps = {
  client: {
    id: number;
    createdAt: string;
    name: string;
    description?: string;
    category?: string;
    status?: string;
    progress?: number;
    logo?: string | null;
    client_user?: Array<{
      id: number;
      member_id: number;
      client_id: number;
      auth?: {
        user?: {
          id: number;
          full_name: string;
          avatar: string | null;
          authId: number;
          notification_token: string | null;
          created_at: string;
          updated_at: string;
        }
      };
    }>;
  };
  onPress: () => void;
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onPress }) => {
  const getCategoryClasses = (category: string) => {
    switch (category) {
      case "Construction":
        return { bg: "bg-blue-100", dot: "bg-blue", text: "text-blue" };
      case "Building":
        return { bg: "bg-green-100", dot: "bg-green", text: "text-green" };
      case "LandMark":
        return { bg: "bg-yellow-100", dot: "bg-yellow", text: "text-yellow" };
      default:
        return { bg: "bg-green-100", dot: "bg-green", text: "text-green" };
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Active":
        return { bg: "bg-green-100", text: "text-green-500" };
      case "Inactive":
        return { bg: "bg-yellow-100", text: "text-yellow-500" };
      default:
        return { bg: "bg-blue-100", text: "text-blue" };
    }
  };

  const categoryClasses = getCategoryClasses(client.category || "");
  const statusClasses = getStatusClasses(client.status || "");
  const formatDate = (dateString) => {
    if (!dateString) return "Oct 05 2021"; // Default fallback date
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white border border-light p-2.5 rounded-[20] mt-2.5"
    >
      <View className="flex-row items-center">
        <Image
          source={client.logo ? { uri: getImageUrl(client.logo) } : images.user}
          resizeMode="cover"
          className="rounded-2xl"
          style={{ width: vs(50), height: vs(50) }}
        />
        <View className="pl-3.5 flex-grow">
          <Text className="text-base sm:text-lg font-ManropeBold text-dark">
            {client.name}
          </Text>
          {client.category && (
            <View className="flex-row items-center mt-2">
              <View
                className={`flex-row items-center justify-center w-3.5 h-3.5 ${categoryClasses.bg}`}
              >
                <View className={`w-1.5 h-1.5 ${categoryClasses.dot}`} />
              </View>
              <Text
                className={`text-sm font-ManropeMedium ml-2 ${categoryClasses.text}`}
              >
                {client.category?.replaceAll("_", " ")}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text className="text-sm font-ManropeMedium text-dark-100 mt-3">
        {client.description || "No description available"}
      </Text>

      <View className="flex-row items-center mt-3.5">
        {(client.client_user || []).slice(0, 2).map((member, index) => {
          const avatar = member.auth?.user?.avatar;
          const source = avatar ? { uri: getImageUrl(avatar) } : images.user;
          return (
            <Image
              key={member.id}
              source={source}
              resizeMode="cover"
              className={`rounded-full border-2 border-white ${index > 0 ? "relative -ml-3.5" : ""
                }`}
              style={{ width: vs(35), height: vs(35) }}
            />
          )
        })
        }

        <Text className="text-base font-ManropeMedium text-dark ml-3.5">
          Members
        </Text>
      </View>

      {/* <View className="mt-3.5">
        <ProgressBar progress={client.progress || 0} />
      </View> */}

      <View className="flex-row items-center justify-between mt-3.5">
        <View className="flex-row items-center">
          {/* <Text className="text-sm font-ManropeMedium text-dark">Due on:</Text> */}
          <View className="flex-row items-center ml-2">
            <CalendarDays size={18} color="#1C1C1C" />
            <Text className="text-sm font-ManropeMedium text-dark ml-2">
              {formatDate(client.createdAt) || "Oct 05 2021"}

            </Text>
          </View>
        </View>
        {client.status && (
          <View
            className={`rounded-3xl px-3 pt-1 pb-1.5 ml-auto ${statusClasses.bg}`}
          >
            <Text
              className={`text-sm font-ManropeMedium text-center ${statusClasses.text}`}
            >
              {client.status}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ClientCard;
