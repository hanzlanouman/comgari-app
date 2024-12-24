import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { vs } from "react-native-size-matters";
import { ChevronsUp, ChevronDown, ChevronUp } from "lucide-react-native";
import { images } from "@/constants";

interface Member {
  id: number;
  member: {
    Auth: {
      username: string;
    };
  };
}

interface TaskCardProps {
  task: {
    title: string;
    dueDate: string;
    priority: string;
    task_member?: Member[];
    status?: string;
  };
  onPress?: () => void;
}

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

  const renderMembers = () => {
    if (!task.task_member || task.task_member.length === 0) {
      return <View className="h-[30px]" />;
    }
    const maxVisibleMembers = 3;
    const totalMembers = task.task_member.length;
    const visibleMembers = task.task_member.slice(0, maxVisibleMembers);
    const remainingCount = totalMembers - maxVisibleMembers;
  
    return (
      <View className="flex-row items-center">
        <View className="flex-row items-center">
          {visibleMembers.map((member, index) => (
            <View
              key={member.id}
              className={`${index > 0 ? "-ml-3" : ""}`}
              style={{ zIndex: maxVisibleMembers - index }}
            >
              <Image
                source={images.user}
                resizeMode="cover"
                className="rounded-full border-2 border-white"
                style={{ width: vs(30), height: vs(30) }}
              />
            </View>
          ))}
          {remainingCount > 0 && (
            <View 
              className="-ml-3"
              style={{ zIndex: 0 }}
            >
              <View className="w-[30px] h-[30px] rounded-full border-2 border-white bg-gray-100 items-center justify-center">
                <Text className="text-xs font-ManropeMedium text-gray-600">
                  +{remainingCount}
                </Text>
              </View>
            </View>
          )}
        </View>
        {totalMembers > 3 && (
          <Text className="text-sm font-ManropeMedium text-gray-600 ml-2">
            {totalMembers} Members
          </Text>
        )}
      </View>
    );
  };
  

  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="bg-white border border-light p-3.5 rounded-[20px] mt-2.5"
    >
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
        {renderMembers()}
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