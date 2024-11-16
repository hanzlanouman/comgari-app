import { SafeAreaView, View, Text } from "react-native";
import { Agenda } from "react-native-calendars";

const Appointment = () => {
  const items = {
    "2024-11-16": [
      {
        name: "Team Meeting",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        address:
          "Dilli Haat Pitampura, Near Netaji Subhash Place Metro Station",
      },
    ],
    "2024-11-17": [
      {
        name: "Doctor Appointment",
        startTime: "2:00 PM",
        endTime: "3:00 PM",
        address: "Kohinoor chowk, Jaranwala road",
      },
    ],
    "2024-11-18": [],
    "2024-11-19": [
      {
        name: "Lunch with Client",
        startTime: "2:00 PM",
        endTime: "3:00 PM",
        address: "60/d, Purana paltan (1st floor west side), 1000",
      },
      {
        name: "Project Review",
        name: "Team Meeting",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        address: "65 Calle Industria 1100",
      },
    ],
  };

  const renderAgendaItem = (item) => (
    <View className="bg-white rounded-xl px-4 py-3 mt-4 mr-4 last:mt-0">
      <Text className="text-sm text-dark-100 font-ManropeMedium">
        {item.startTime} - {item.endTime}
      </Text>
      <Text className="text-sm sm:text-base text-blue font-ManropeSemibold mt-0.5">
        {item.name}
      </Text>
      <Text className="text-sm text-dark-100 font-ManropeRegular mt-1">
        {item.address}
      </Text>
    </View>
  );

  const renderEmptyDate = () => (
    <View className="mt-11 mr-4">
      <Text className="text-sm sm:text-base text-dark-100 font-ManropeMedium">
        No events for today.
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="mb-4 flex-1">
        <Agenda
          items={items}
          selected={"2024-11-16"}
          renderItem={(item) => renderAgendaItem(item)}
          renderEmptyDate={renderEmptyDate}
          onDayPress={(day) => console.log("Day pressed", day)}
          markedDates={{
            "2024-11-16": { selected: true, marked: true },
            "2024-11-17": { marked: true },
            "2024-11-18": { disabled: true },
          }}
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
