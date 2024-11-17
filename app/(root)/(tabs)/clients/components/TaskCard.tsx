//app\(root)\(tabs)\clients\components\TaskCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { vs } from "react-native-size-matters";
import { ChevronsUp, ChevronDown, ChevronUp } from "lucide-react-native";
import { images } from "@/constants";

interface TaskCardProps {
  task: {
    title: string;
    dueDate: string;
    priority: string;
    assignedTo: number; // Single number for user ID
    status?: string;
  };
  onPress?: () => void;
}

// Utility function for date formatting
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const getPriorityIcon = () => {
    if (task.priority === "high") return <ChevronsUp size={18} color="#E03137" />;
    if (task.priority === "medium") return <ChevronUp size={18} color="#F9A000" />;
    return <ChevronDown size={18} color="#1B78B9" />;
  };

  const getPriorityColor = () => {
    if (task.priority === "high") return "text-red";
    if (task.priority === "medium") return "text-yellow";
    return "text-blue";
  };

  return (
    <TouchableOpacity onPress={onPress} className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5">
      <View className="flex-row items-center">
        {getPriorityIcon()}
        <Text className={`text-sm font-ManropeSemibold ml-1.5 ${getPriorityColor()}`}>
          {task.priority}
        </Text>
      </View>
      <Text className="text-base sm:text-lg text-dark font-ManropeSemibold leading-6 mt-1">
        {task.title}
      </Text>
      <Text className="text-sm text-dark-100 font-ManropeMedium mt-1">
        {formatDate(task.dueDate)}
      </Text>
      <View className="bg-light w-full h-px my-3" />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {/* Replace with a single avatar or fallback */}
          <Image
            source={images.user} // Replace with actual image source if available
            resizeMode="cover"
            className="rounded-full border-2 border-white"
            style={{ width: vs(30), height: vs(30) }}
          />
        </View>
        <View className="flex-row items-center">
          <View className="bg-blue-100 flex-row items-center justify-center w-3.5 h-3.5">
            <View className="bg-blue w-1.5 h-1.5" />
          </View>
          <Text className="text-base font-ManropeMedium text-blue ml-2">
            {task.status || "Todo"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TaskCard;
