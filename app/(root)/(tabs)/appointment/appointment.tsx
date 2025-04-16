import React, { useState, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Agenda } from "react-native-calendars";
import { ClientRepository } from "@/repositories/client/client";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useFocusEffect } from "expo-router";
import ActionModal from "../clients/components/ActionModal";
import { format } from 'date-fns';
import { useQuery, useQueryClient } from 'react-query';
import { SimpleActivityIndicator } from "@/common/components/Loader";

const Appointment = () => {
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAgenda, setShowAgenda] = useState(false);
  const clientRepo = ClientRepository.getInstance();
  const actionModalRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();

  const { isLoading, isFetching, data: appointmentsData } = useQuery(
    'appointments',
    async () => {
      const response = await clientRepo.getAppointment();
      return response.data || [];
    },
    {
      staleTime: 0,
      cacheTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      onSuccess: () => {
        setShowAgenda(true);
      },
      onError: () => {
        setShowAgenda(true);
      }
    }
  );

  // Transform appointments data whenever it changes
  const transformAppointments = useCallback((appointments: any[]) => {
    if (!appointments || appointments.length === 0) {
      setItems({});
      return;
    }

    const transformedItems = appointments.reduce((acc: Record<string, any[]>, appointment: any) => {
      const formattedDate = format(new Date(appointment.date), 'yyyy-MM-dd');

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }

      const memberNames = appointment.appointment_member
        .map((member: any) => member.Auth?.user?.full_name || 'Unknown')
        .join(', ');

      acc[formattedDate].push({
        id: appointment.id,
        name: appointment.title,
        startTime: new Date(appointment.start_time),
        endTime: new Date(appointment.end_time),
        address: appointment.notes || 'None',
        status: appointment.status,
        clientName: appointment.client?.name || 'Unknown Client',
        memberNames: memberNames,
        fullAppointmentData: appointment
      });

      return acc;
    }, {});

    setItems(transformedItems);
  }, []);

  // Update items whenever appointments data changes
  React.useEffect(() => {
    if (appointmentsData) {
      transformAppointments(appointmentsData);
    }
  }, [appointmentsData, transformAppointments]);

  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries('appointments');
      // Reset states when screen is focused
      setShowAgenda(false);
    }, [queryClient])
  );

  const handleDayPress = useCallback((day: any) => {
    setSelectedDate(day.dateString);
  }, []);

  const handleAppointmentPress = (item: any) => {
    setSelectedAppointment(item);
    actionModalRef.current?.present();
  };

  const handleUpdatePress = () => {
    if (!selectedAppointment) return;
    const appointment = selectedAppointment.fullAppointmentData;

    const members = appointment.appointment_member.map((member: any) => ({
      id: member.member_id,
      name: member.Auth?.user?.full_name || 'Unknown',
    }));

    const initialData = {
      isEditing: 'true',
      clientId: appointment.client_id,
      date: appointment.date,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      notes: appointment.notes,
      status: appointment.status,
      title: appointment.title,
      appointmentId: appointment.id,
      members: JSON.stringify(members),
    }

    router.push({
      pathname: "/(root)/(tabs)/appointment/add-appointment",
      params: initialData
    });
    actionModalRef.current?.dismiss();
  };

  const handleDeletePress = async () => {
    if (selectedAppointment) {
      try {
        await clientRepo.deleteAppointment(selectedAppointment.id);
        // Invalidate and refetch after deletion
        queryClient.invalidateQueries('appointments');
        actionModalRef.current?.dismiss();
      } catch (error) {
        console.error('Failed to delete appointment', error);
      }
    }
  };

  const formatTime = (isoTime: string) => {
    try {
      const date = new Date(isoTime);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      console.error('Error formatting time:', e);
      return "Invalid time";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const nameParts = name.split(" ");
    return nameParts.map((part: string) => part[0] || "").join("").toUpperCase();
  };

  const renderAgendaItem = (item: any) => {
    return (
      <TouchableOpacity
        onPressIn={() => handleAppointmentPress(item)}
        className="bg-white flex-row items-center justify-between rounded-xl px-4 py-3 mt-4 mr-4 shadow-md"
      >
        {/* Appointment details */}
        <View className="flex-1">
          <Text className="text-sm text-dark-100 font-ManropeMedium">
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
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

        <View className="bg-lightBlue h-10 w-10 rounded-full items-center justify-center ml-4">
          <Text className="text-base text-white font-ManropeSemibold">
            {getInitials(item.clientName)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => (
    <View className="mt-11 mr-4">
      <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium text-center">
        No appointments here!
      </Text>
    </View>
  );

  const markedDates = Object.keys(items).reduce((acc: Record<string, any>, date: string) => {
    acc[date] = {
      marked: true,
      dotColor: items[date]?.length > 0 ? '#1B78B9' : undefined
    };
    return acc;
  }, {});

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mb-4 flex-1">
        {(isLoading || isFetching) && !showAgenda ? (
          <View className="flex-1 justify-center items-center">
            <SimpleActivityIndicator />
          </View>
        ) : showAgenda ? (
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
            showOnlySelectedDayItems={true}
            pastScrollRange={1}
            futureScrollRange={1}
            renderKnob={() => (
              <View className="w-12 h-1 bg-dark self-center rounded-full mt-2" />
            )}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#1B78B9" />
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
