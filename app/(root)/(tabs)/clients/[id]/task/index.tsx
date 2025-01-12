import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { scale, vs } from "react-native-size-matters";
import { images } from "@/constants";
import TaskCard from "../../components/TaskCard";
import { CustomButton } from "@/common/components";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClientRepository } from "@/repositories/client/client";
import { useAppSelector } from "@/hooks/redux";
import TaskFormModal from "../../components/TaskFormModal";
import ActionModal from "../../components/ActionModal";
import { UpdateTaskPayload } from "@/repositories/client/schemas";
import { Task, TaskPayload } from "@/repositories/client/types";
import { INITIAL_FORM_VALUES } from "@/repositories/client/constants";

const Tasks = () => {
  const { id: projectId } = useLocalSearchParams();
  const clientRepo = ClientRepository.getInstance();
  const user = useAppSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!user) {
  }
  const request: Request = {
    user: {
      id: user?.id,
      auth_id: user?.authId,
    },
  };

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const addModalRef = useRef<BottomSheetModal>(null);
  const editModalRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();

  const {
    data: tasks = [],
    isLoading: isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => {
      return clientRepo.getTask(Number(projectId)).then(tasks => 
        tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    },
    staleTime: 0,
  });

  const createTaskMutation = useMutation({
    mutationFn: (values: TaskPayload) => {
      const payload = {
        ...values,
        projectId: Number(projectId),
        dueDate: new Date(values.dueDate).toISOString(),
      };
      return clientRepo.createTask(request, payload);
    },
    onSuccess: async (newTask) => {
      queryClient.setQueryData(
        ["tasks", projectId],
        (oldTasks: Task[] = []) => [newTask, ...oldTasks]
      );

      await queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });

      addModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (values: Omit<UpdateTaskPayload, "projectId">) => {
      if (!selectedTask) throw new Error("No task selected");
      const payload: UpdateTaskPayload = {
        ...values,
        projectId: Number(projectId),
        dueDate: new Date(values.dueDate).toISOString(),
      };
      return clientRepo.updateTask(selectedTask.id, payload);
    },

    onSuccess: async (updatedTask) => {
      queryClient.setQueryData(["tasks", projectId], (oldTasks: Task[] = []) =>
        oldTasks.map((task) =>
          task.id === selectedTask?.id ? { ...task, ...updatedTask } : task
        )
      );

      await queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });

      editModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => {
      if (!selectedTask) throw new Error("No task selected");
      return clientRepo.deleteTask(selectedTask.id);
    },
    onSuccess: async () => {
      queryClient.setQueryData(["tasks", projectId], (oldTasks: Task[] = []) =>
        oldTasks.filter((task) => task.id !== selectedTask?.id)
      );

      await queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });

      editModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });
  const actionModalRef = useRef<BottomSheetModal>(null);

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    actionModalRef.current?.present();
  }, []);

  const handleUpdatePress = useCallback(() => {
    actionModalRef.current?.dismiss();
    // Small timeout to ensure smooth transition between modals
    setTimeout(() => {
      editModalRef.current?.present();
    }, 300);
  }, []);

  const handleDeletePress = useCallback(() => {
    if (selectedTask) {
      deleteTaskMutation.mutate();
      actionModalRef.current?.dismiss();
    }
  }, [selectedTask, deleteTaskMutation]);
  const AddButton = () => (
    <LinearGradient
      colors={["#1B78B9", "#63348F"]}
      style={{
        borderRadius: 999,
        width: 32,
        height: 32,
      }}
      start={[0, 0]}
      end={[1, 1]}>
      <TouchableOpacity
        onPress={() => {
          addModalRef.current?.present();
        }}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Plus size={18} color="#ffffff" />
      </TouchableOpacity>
    </LinearGradient>
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Tasks",
      headerRight: () => <AddButton />,
    });
  }, [navigation]);

  const transformTaskForForm = (
    task: Task
  ): Omit<TaskPayload, "projectId"> => ({
    title: task.title,
    assignedTo: task.task_member.map((member) => Number(member.member_id)),
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4">
            { error ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-red-500 text-center">
                  Failed to load tasks. Please try again later.
                </Text>
                <CustomButton
                  title="Retry"
                  onPress={() => refetch()}
                  className="mt-4"
                />
              </View>
            ) : tasks?.length > 0 ? (
              <View className="pb-4">
                {tasks?.map((task) => (
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
                  source={images?.emptyList}
                  resizeMode="contain"
                  style={{ width: scale(80), height: vs(80) }}
                  className="mx-auto"
                />
                <View className="mt-8">
                  <Text className="text-lg sm:text-[22px] font-ManropeSemibold text-dark text-center px-4">
                  No task found, you can create new tasks here!
                  </Text>
                  
                  <View className="w-[158px] mx-auto mt-5">
                    <CustomButton
                      title="Add Task"
                      onPress={() => addModalRef.current?.present()}
                      // IconLeft={Plus}
                      // iconSize={20}
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>

        <TaskFormModal
          bottomSheetRef={addModalRef}
          initialValues={INITIAL_FORM_VALUES}
          onSubmit={(values) => createTaskMutation.mutate(values)}
          isLoading={createTaskMutation?.isPending}
          mode="add"
        />

        <ActionModal
          ref={actionModalRef}
          onUpdate={handleUpdatePress}
          onDelete={handleDeletePress}
        />

        <TaskFormModal
          bottomSheetRef={editModalRef}
          initialValues={
            selectedTask
              ? transformTaskForForm(selectedTask)
              : INITIAL_FORM_VALUES
          }
          onSubmit={(values) => updateTaskMutation.mutate(values)}
          isLoading={updateTaskMutation.isPending}
          mode="edit"
          currentMembers={
            selectedTask?.task_member.map((tm) => Number(tm.member_id)) || []
          }
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Tasks;
