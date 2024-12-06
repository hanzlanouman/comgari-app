import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from "react-native";
import { Agenda } from "react-native-calendars";
import { ClientRepository } from "@/repositories/client/client";

const Appointment = () => {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const clientRepo = ClientRepository.getInstance();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await clientRepo.getAppointment();
        console.log(response.data)
        const transformedItems = response.data.reduce((acc, appointment) => {
          const formattedDate = new Date(appointment.date).toISOString().split('T')[0];

          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }

          // Extract member names
          const memberNames = appointment.appointment_member
            .map(member => member.Auth.user[0]?.full_name || 'Unknown')
            .join(', ');

          acc[formattedDate].push({
            name: appointment.title,
            startTime: appointment.start_time,
            endTime: appointment.end_time,
            address: appointment.notes || 'None',
            status: appointment.status,
            clientName: appointment.client.name,
            memberNames: memberNames
          });

          return acc;
        }, {});

        setItems(transformedItems);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      }
    };

    fetchAppointments();
  }, []);

  const renderAgendaItem = (item) => {
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

    return (
      <View className="bg-white flex-row items-center justify-between rounded-xl px-4 py-3 mt-4 mr-4 shadow-md">
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
      </View>
    );
  };

  const renderEmptyDate = () => (
    <View className="mt-11 mr-4">
      <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
        No events for today.
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
          renderEmptyDate={renderEmptyDate}
          onDayPress={(day) => {
            console.log("Day pressed", day);
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
      </View>
    </SafeAreaView>
  );
};

export default Appointment;