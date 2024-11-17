import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";
import TaskCard from "../components/TaskCard";
import { CustomButton } from "@/common/components";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { ClientRepository } from "@/repositories/client/client";
import { useAppSelector } from "@/hooks/redux";
import TaskFormModal from "../components/TaskFormModal";

interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: string;
}

const emptyFormValues = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  priority: "",
};

const Tasks = () => {
  const { id } = useLocalSearchParams();
  const clientRepo = ClientRepository.getInstance();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    router.push("/(auth)/sign-in");
    return null;
  }

  const req = { user: { id: user?.id } };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const addModalRef = useRef<BottomSheetModal>(null);
  const editModalRef = useRef<BottomSheetModal>(null);

  // Fetch tasks when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const response = await clientRepo.getTask(Number(id));
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchTasks();
  }, [id]);

  const handleAddTask = async (values: Omit<Task, 'id'>) => {
    try {
      setIsLoading(true);
      const payload = {
        ...values,
        projectId: Number(id),
        assignedTo: Number(values.assignedTo),
      };

      const response = await clientRepo.createTask(req, payload);
      setTasks((prevTasks) => [response, ...prevTasks]);
      addModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = async (values: Omit<Task, 'id'>) => {
    if (!selectedTask) return;

    try {
      setIsLoading(true);
      const payload = {
        ...values,
        id: selectedTask.id,
        projectId: Number(id),
        assignedTo: Number(values.assignedTo),
      };

      const response = await clientRepo.updateTask(req, payload);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? response : task
        )
      );
      editModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      setIsLoading(true);
      await clientRepo.deleteTask(Number(selectedTask.id));
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== selectedTask.id));
      editModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    editModalRef.current?.present();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
            {isFetching ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-2 text-gray-600">Loading tasks...</Text>
              </View>
            ) : error ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-red-500 text-center">{error}</Text>
                <CustomButton
                  title="Retry"
                  onPress={() => setTasks([])}
                  className="mt-4"
                />
              </View>
            ) : tasks.length > 0 ? (
              <View className="pb-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPress={() => handleTaskPress(task)}
                  />
                ))}
              </View>
            ) : (
              <View className="flex-grow flex-col items-center justify-center px-4">
                <Image
                  source={images.emptyList}
                  resizeMode="contain"
                  style={{ width: scale(80), height: vs(80) }}
                  className="mx-auto"
                />
                <View className="mt-8">
                  <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                    No Task found, please
                  </Text>
                  <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                    create task
                  </Text>
                  <View className="w-[158px] mx-auto mt-5">
                    <CustomButton
                      title="Add Task"
                      onPress={() => addModalRef.current?.present()}
                      IconLeft={Plus}
                      iconSize={20}
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>

        {/* Add Task Modal */}
        <TaskFormModal
          bottomSheetRef={addModalRef}
          initialValues={emptyFormValues}
          onSubmit={handleAddTask}
          isLoading={isLoading}
          mode="add"
        />

        {/* Edit Task Modal */}
        <TaskFormModal
          bottomSheetRef={editModalRef}
          initialValues={selectedTask || emptyFormValues}
          onSubmit={handleEditTask}
          isLoading={isLoading}
          mode="edit"
          onDelete={handleDeleteTask}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Tasks;