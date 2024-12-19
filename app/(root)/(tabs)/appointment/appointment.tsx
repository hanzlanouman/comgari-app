import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { router } from "expo-router";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ClientRepository } from "@/repositories/client/client";
import  ActionModal from "../clients/components/ActionModal";

const Appointment = () => {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const clientRepo = ClientRepository.getInstance();
  const actionModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await clientRepo.getAppointment();
        const transformedItems = response.data.reduce((acc, appointment) => {
          const formattedDate = new Date(appointment.date).toISOString().split('T')[0];

          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }

          const memberNames = appointment.appointment_member
            .map(member => member.Auth.user[0]?.full_name || 'Unknown')
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

        setItems(transformedItems);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAppointmentPress = (item) => {
    setSelectedAppointment(item);
    actionModalRef.current?.present();
  };

  const handleUpdatePress = () => {
    if (selectedAppointment) {
      const members = selectedAppointment.fullAppointmentData.appointment_member.map(member => ({
        id: member.member_id,
        name: member.Auth.user[0]?.full_name || 'Unknown',
      }));      
      router.push({
        pathname: "/(root)/(tabs)/appointment/add-appointment",
        params: {
          isEditing: 'true',
          appointmentId: selectedAppointment.id,
          title: selectedAppointment.name,
          clientId: selectedAppointment.fullAppointmentData.client_id,
          status: selectedAppointment.status,
          date: selectedAppointment.startTime,
          notes: selectedAppointment.address,
          members: JSON.stringify(members), // Pass members as a stringified JSON

        }
      });
      actionModalRef.current?.dismiss();
    }
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
            .map(member => member.Auth.user[0]?.full_name || 'Unknown')
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

  const renderAgendaItem = (item) => (
    <TouchableOpacity 
    onPress={() => handleAppointmentPress(item)}
    className="bg-white flex-row items-center justify-between rounded-xl px-4 py-3 mt-4 mr-4 shadow-md"
  >
    <View className="bg-white flex-row items-center justify-between rounded-xl px-4 py-3 mt-4 mr-4 shadow-md">
      <View className="flex-1">
        <Text className="text-sm text-dark-100 font-ManropeMedium">
          {new Date(item.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })} - {new Date(item.endTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
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
          {item.clientName.split(' ').map(part => part[0]).join('').toUpperCase()}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
  );

  const renderEmptyDate = () => (
    <View className="mt-11 mr-4">
      <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
        No appointments for today.
      </Text>
    </View>
  );

  const renderEmptyData = () => (
    <View className="flex-1 items-center justify-center">
      {isLoading ? (
        <Text className="text-sm text-dark-100 font-ManropeMedium">Loading...</Text>
      ) : (
        <Text className="text-sm text-dark-100 font-ManropeMedium">No appointments available.</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="mb-4 flex-1">
        <Agenda
          items={items}
          selected={selectedDate}
          renderItem={renderAgendaItem}
          renderEmptyDate={renderEmptyDate}
          renderEmptyData={renderEmptyData}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            selectedDayBackgroundColor: "#1B78B9",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#1C1C1C",
            agendaDayTextColor: "#1C1C1C",
            agendaDayNumColor: "#1C1C1C",
            agendaTodayColor: "#1C1C1C",
            agendaKnobColor: "#1C1C1C",
          }}
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
