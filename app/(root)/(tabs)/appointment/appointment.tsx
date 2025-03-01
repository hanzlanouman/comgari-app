import React, { useState, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { ClientRepository } from "@/repositories/client/client";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useFocusEffect } from "expo-router";
import ActionModal from "../clients/components/ActionModal";
import { format } from 'date-fns';

const Appointment = () => {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const clientRepo = ClientRepository.getInstance();
  const actionModalRef = useRef<BottomSheetModal>(null);

  const fetchAppointments = async () => {
    try {
      const response = await clientRepo.getAppointment();
      if (!response.data || response.data.length === 0) {
        setItems({});
        setIsLoading(false);
        return;
      }
      const transformedItems = response.data.reduce((acc, appointment) => {
        const formattedDate = format(new Date(appointment.date), 'yyyy-MM-dd');

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }

        // Extract member names
        const memberNames = appointment.appointment_member
          .map(member => member.Auth.user?.full_name || 'Unknown')
          .join(', ');

        acc[formattedDate].push({
          id: appointment.id,
          name: appointment.title,
          startTime: new Date(appointment.start_time),
          endTime: new Date(appointment.end_time),
          address: appointment.notes || 'None',
          status: appointment.status,
          clientName: appointment.client.name,
          memberNames: memberNames,
          fullAppointmentData: appointment
        });

        return acc;
      }, {});

      setItems(transformedItems);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      setItems({});
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchAppointments() }, []));

  const handleAppointmentPress = (item) => {
    setSelectedAppointment(item);
    actionModalRef.current?.present();
  };

  const handleUpdatePress = () => {
    if (!selectedAppointment) return;
    const appointment = selectedAppointment.fullAppointmentData;

    const members = appointment.appointment_member.map(member => ({
      id: member.member_id,
      name: member.Auth.user?.full_name || 'Unknown',
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
        // Refresh appointments after deletion
        const response = await clientRepo.getAppointment();
        const transformedItems = response.data.reduce((acc, appointment) => {
          const formattedDate = new Date(appointment.date).toISOString().split('T')[0];

          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }

          const memberNames = appointment.appointment_member
            .map(member => member.Auth.user?.full_name || 'Unknown')
            .join(', ');

          const appointmentItem = {
            id: appointment.id,
            name: appointment.title,
            startTime: appointment.start_time,
            endTime: appointment.end_time,
            address: appointment.notes || 'None',
            status: appointment.status,
            clientName: appointment.client.name,
            memberNames: memberNames,
            fullAppointmentData: appointment
          };

          acc[formattedDate].push(appointmentItem);

          return acc;
        }, {});
        actionModalRef.current?.dismiss();

        setItems(transformedItems);
      } catch (error) {
        console.error('Failed to delete appointment', error);
      }
    }
  };

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    return nameParts.map(part => part[0]).join("").toUpperCase();
  };

  const renderAgendaItem = (item) => {

    return (
      <TouchableOpacity
        onPress={() => handleAppointmentPress(item)}
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

  const markedDates = Object.keys(items).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: items[date].length > 0 ? '#1B78B9' : undefined
    };
    return acc;
  }, {});

  return (
    <SafeAreaView className="flex-1">
      <View className="mb-4 flex-1">
        <Agenda
          items={items}
          selected={selectedDate}
          renderItem={renderAgendaItem}
          renderEmptyData={renderEmptyDate}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
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
          renderKnob={() => (
            <View className="w-12 h-1 bg-dark self-center rounded-full mt-2" />
          )}
        />
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