import React, { useState, useRef, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Agenda } from "react-native-calendars";
import { ClientRepository } from "@/repositories/client/client";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SimpleActivityIndicator } from "@/common/components/Loader";
import ActionModal from "../clients/components/ActionModal";

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
      return response.data || [];
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  console.log("appointmentsData", appointmentsData);

  // Transform appointments data whenever it changes
  const items = useMemo(() => {
    if (!appointmentsData || appointmentsData.length === 0) {
      return EMPTY_ITEMS;
    }

    const transformedItems = appointmentsData?.reduce(
      (acc: Record<string, any[]>, appointment: any) => {
        const formattedDate = format(new Date(appointment.date), "yyyy-MM-dd");

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }

        const memberNames = appointment.appointment_member
          .map((member: any) => member.Auth?.user?.full_name || "Unknown")
          .join(", ");

        acc[formattedDate].push({
          id: appointment.id,
          name: appointment.title,
          startTime: new Date(appointment.start_time),
          endTime: new Date(appointment.end_time),
          address: appointment.notes || "None",
          status: appointment.status,
          clientName: appointment.client?.name || "Unknown Client",
          memberNames: memberNames,
          fullAppointmentData: appointment,
        });

        return acc;
      },
      {}
    );

    return transformedItems;
  }, [appointmentsData]);

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
    // Add a slight delay for iOS to ensure the modal opens properly
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
        // Invalidate and refetch after deletion
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        actionModalRef.current?.dismiss();
      } catch (error) {
        console.error("Failed to delete appointment", error);
      }
    }
  };

  const formatTime = useCallback((isoTime: string) => {
    try {
      const date = new Date(isoTime);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (e) {
      console.error("Error formatting time:", e);
      return "Invalid time";
    }
  }, []);

  const getInitials = useCallback((name: string) => {
    if (!name) return "?";
    const nameParts = name.split(" ");
    return nameParts
      .map((part: string) => part[0] || "")
      .join("")
      .toUpperCase();
  }, []);

  const renderAgendaItem = useCallback((item: any) => {
    const formatItemTime = (isoTime: string) => {
      try {
        const date = new Date(isoTime);
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } catch (e) {
        return "Invalid time";
      }
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
        // onPress={() => handleAppointmentPress(item)}
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

        <View className="bg-lightBlue rounded-full items-center justify-center ml-4" style={{ height: 40, width: 40 }}>
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
          No appointments here!
        </Text>
      </View>
    ),
    []
  );

  const renderKnob = useCallback(
    () => <View className="bg-dark self-center rounded-full mt-2" style={{ width: 48, height: 4 }} />,
    []
  );

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

  const agendaTheme = useMemo(
    () => ({
      selectedDayBackgroundColor: "#1B78B9",
      selectedDayTextColor: "#ffffff",
      todayTextColor: "#1C1C1C",
      agendaDayTextColor: "#1C1C1C",
      agendaDayNumColor: "#1C1C1C",
      agendaTodayColor: "#1C1C1C",
      agendaKnobColor: "#1C1C1C",
    }),
    []
  );

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
    // <SafeAreaView style={{ flex: 1 }}>
    //   <Agenda
    //     items={items}
    //     selected={selectedDate}
    //     renderItem={renderAgendaItem}
    //     renderEmptyData={renderEmptyDate}
    //     onDayPress={handleDayPress}
    //     markedDates={markedDates}
    //     theme={agendaTheme}
    //     hideKnob={false}
    //     hideExtraDays={true}
    //     showClosingKnob={true}
    //     showOnlySelectedDayItems={true}
    //     pastScrollRange={12}
    //     futureScrollRange={12}
    //     calendarHeight={120}
    //     renderKnob={renderKnob}
    //   />
    // </SafeAreaView>
    <SafeAreaView className="flex-1 bg-white">
      <View className="mb-4 flex-1">
        {isLoading || isFetching ? (
          <View className="flex-1 justify-center items-center">
            <SimpleActivityIndicator />
          </View>
        ) : Object.keys(items).length > 0 ? (
          <Agenda
            items={items}
            selected={selectedDate}
            renderItem={renderAgendaItem}
            renderEmptyData={renderEmptyDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
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
            hideExtraDays={true}
            showClosingKnob={true}
            showOnlySelectedDayItems={true}
            pastScrollRange={12}
            futureScrollRange={12}
            calendarHeight={120}
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
