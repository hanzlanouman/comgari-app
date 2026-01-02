import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Agenda } from "react-native-calendars";
import { ClientRepository } from "@/repositories/client/client";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import { format, parseISO, isValid } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SimpleActivityIndicator } from "@/common/components/Loader";
import ActionModal from "../clients/components/ActionModal";

const safeParseDateString = (
  dateString: string | null | undefined
): Date | null => {
  if (!dateString) return null;
  try {
    const parsed = parseISO(dateString);
    if (isValid(parsed)) return parsed;

    const date = new Date(dateString);
    if (isValid(date)) return date;

    return null;
  } catch {
    return null;
  }
};
const safeFormatDate = (
  date: Date | string | null | undefined,
  formatStr: string,
  fallback: string = ""
): string => {
  if (!date) return fallback;
  try {
    const dateObj = typeof date === "string" ? safeParseDateString(date) : date;
    if (!dateObj || !isValid(dateObj)) return fallback;
    return format(dateObj, formatStr);
  } catch {
    return fallback;
  }
};

const EMPTY_ITEMS = {};

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const clientRepo = ClientRepository.getInstance();
  const actionModalRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();

  // Delay mounting to avoid Agenda initialization bug
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const {
    isLoading,
    isFetching,
    data: appointmentsData,
    refetch,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await clientRepo.getAppointment();
      console.log("response after fetch", response);
      return response.data || [];

    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  console.log("appointmentsData", appointmentsData);

  const items = useMemo(() => {
    const transformedItems = (appointmentsData || [])?.reduce(
      (acc: Record<string, any[]>, appointment: any) => {
        const formattedDate = safeFormatDate(appointment.date, "yyyy-MM-dd");

        if (!formattedDate) {
          console.warn(
            "Skipping appointment with invalid date:",
            appointment.id
          );
          return acc;
        }

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }

        const memberNames =
          appointment.appointment_member
            ?.map((member: any) => member.Auth?.user?.full_name || "Unknown")
            .join(", ") || "";

        acc[formattedDate].push({
          id: appointment.id,
          name: appointment.title,
          startTime: appointment.start_time, // Keep as string
          endTime: appointment.end_time, // Keep as string
          address: appointment.notes || "None",
          status: appointment.status,
          clientName: appointment.client?.name || "Unknown Client",
          memberNames: memberNames,
          fullAppointmentData: appointment,
        });

        return acc;
      },
      {} as Record<string, any[]>
    );

    // Ensure selectedDate is present in items to avoid loader
    if (selectedDate && !transformedItems[selectedDate]) {
      transformedItems[selectedDate] = [];
    }

    return transformedItems;
  }, [appointmentsData, selectedDate]);

  useFocusEffect(
    React.useCallback(() => {
      if (isReady) {
        refetch();
      }
    }, [refetch, isReady])
  );

  const handleDayPress = useCallback((day: any) => {
    setSelectedDate(day.dateString);
  }, []);

  const handleAppointmentPress = (item: any) => {
    setSelectedAppointment(item);
    setTimeout(
      () => {
        actionModalRef.current?.present();
      },
      Platform.OS === "ios" ? 100 : 0
    );
  };

  const handleUpdatePress = () => {
    if (!selectedAppointment) return;
    const appointment = selectedAppointment.fullAppointmentData;

    const members = appointment.appointment_member.map((member: any) => ({
      id: member.member_id,
      name: member.Auth?.user?.full_name || "Unknown",
    }));

    const initialData = {
      isEditing: "true",
      clientId: appointment.client_id,
      date: appointment.date,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      notes: appointment.notes,
      status: appointment.status,
      title: appointment.title,
      appointmentId: appointment.id,
      members: JSON.stringify(members),
    };

    router.push({
      pathname: "/(root)/(tabs)/appointment/new-addAppointment",
      params: initialData,
    });
    actionModalRef.current?.dismiss();
  };

  const handleDeletePress = async () => {
    if (selectedAppointment) {
      try {
        await clientRepo.deleteAppointment(selectedAppointment.id);
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        actionModalRef.current?.dismiss();
      } catch (error) {
        console.error("Failed to delete appointment", error);
      }
    }
  };

  const getInitials = useCallback((name: string) => {
    if (!name) return "?";
    const nameParts = name.split(" ");
    return nameParts
      .map((part: string) => part[0] || "")
      .join("")
      .toUpperCase();
  }, []);

  const renderAgendaItem = useCallback((item: any) => {
    const formatItemTime = (timeString: string) => {
      return safeFormatDate(timeString, "HH:mm", "--:--");
    };

    const getItemInitials = (name: string) => {
      if (!name) return "?";
      const nameParts = name.split(" ");
      return nameParts
        .map((part: string) => part[0] || "")
        .join("")
        .toUpperCase();
    };

    return (
      <TouchableOpacity
        onPress={() => handleAppointmentPress(item)}
        activeOpacity={0.7}
        style={Platform.OS === "ios" ? { zIndex: 999 } : {}}
        className="bg-white flex-row items-center justify-between rounded-xl px-4 py-3 mt-4 mr-4 shadow-md"
      >
        {/* Appointment details */}
        <View className="flex-1">
          <Text className="text-sm text-dark-100 font-ManropeMedium">
            {formatItemTime(item.startTime)} - {formatItemTime(item.endTime)}
          </Text>
          <Text className="text-sm sm:text-base text-blue font-ManropeSemibold mt-1">
            {item.clientName}
          </Text>
          <Text className="text-sm text-dark-100 font-ManropeRegular mt-1">
            {item.name}
          </Text>
          <Text className="text-sm text-dark-100 font-ManropeRegular mt-1">
            With {item.memberNames}
          </Text>
        </View>

        <View
          className="bg-lightBlue rounded-full items-center justify-center ml-4"
          style={{ height: 40, width: 40 }}
        >
          <Text className="text-base text-white font-ManropeSemibold">
            {getItemInitials(item.clientName)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderEmptyDate = useCallback(
    () => (
      <View className="mt-11 mr-4">
        <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium text-center">
          No appointments available for this date.
        </Text>
      </View>
    ),
    []
  );

  const renderKnob = useCallback(
    () => (
      <View
        className="bg-dark self-center rounded-full mt-2"
        style={{ width: 48, height: 4 }}
      />
    ),
    []
  );

  const renderDay = useCallback((day: any) => {
    if (!day) return <View style={{ width: 96 }} />;

    try {
      // Handle both timestamp (number) and dateString formats
      let date: Date | null = null;

      if (day.timestamp) {
        date = new Date(day.timestamp);
      } else if (day.dateString) {
        date = safeParseDateString(day.dateString);
      }

      if (!date || !isValid(date)) {
        return <View style={{ width: 96 }} />;
      }

      const formattedDate = format(date, "EEE, dd MMM yyyy");

      return (
        <View className="w-24 py-3 pl-2">
          <Text className="text-sm text-dark-100 font-ManropeMedium">
            {formattedDate}
          </Text>
        </View>
      );
    } catch (error) {
      console.warn("Error rendering day:", error);
      return <View style={{ width: 96 }} />;
    }
  }, []);

  const markedDates = React.useMemo(() => {
    return Object.keys(items).reduce(
      (acc: Record<string, any>, date: string) => {
        acc[date] = {
          marked: true,
          dotColor: items[date]?.length > 0 ? "#1B78B9" : undefined,
        };
        return acc;
      },
      {}
    );
  }, [items]);

  if (!isReady) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <SimpleActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["bottom", "left", "right"]}
    >
      <View className="mb-4 flex-1">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <SimpleActivityIndicator />
          </View>
        ) : Object.keys(items).length > 0 ? (
          <Agenda
            items={items}
            selected={selectedDate}
            renderItem={(item) => renderAgendaItem(item)}
            renderEmptyDate={renderEmptyDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            showOnlySelectedDayItems={true}
            theme={{
              selectedDayBackgroundColor: "#1B78B9",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#1C1C1C",
              agendaDayTextColor: "#1C1C1C",
              agendaDayNumColor: "#1C1C1C",
              agendaTodayColor: "#1C1C1C",
              agendaKnobColor: "#1C1C1C",
            }}
            hideKnob={false}
            renderKnob={renderKnob}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium text-center">
              No appointments found
            </Text>
          </View>
        )}
        <ActionModal
          ref={actionModalRef}
          onUpdate={handleUpdatePress}
          onDelete={handleDeletePress}
        />
      </View>
    </SafeAreaView>
  );
};

export default Appointment;
