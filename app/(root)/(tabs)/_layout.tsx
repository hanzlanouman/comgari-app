import { Tabs } from "expo-router";
import {
  CalendarDays,
  House,
  UserPen,
  Users,
  UsersRound,
} from "lucide-react-native";

const Layout = () => (
  <Tabs
    initialRouteName="home"
    screenOptions={{
      tabBarInactiveTintColor: "#1C1C1C",
      tabBarActiveTintColor: "#1B78B9",
      tabBarShowLabel: true,
      tabBarStyle: {
        backgroundColor: "#ffffff",
      },
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerShadowVisible: false,
    }}>
    <Tabs.Screen
      name="home"
      options={{
        title: "Home",
        headerShown: true,
        tabBarIcon: ({ focused }) => (
          <House color={focused ? "#1B78B9" : "#1C1C1C"} />
        ),
      }}
    />
    <Tabs.Screen
      name="members"
      options={{
        title: "Members",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Users color={focused ? "#1B78B9" : "#1C1C1C"} />
        ),
      }}
    />
    <Tabs.Screen
      name="clients"
      options={{
        title: "Clients",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <UsersRound color={focused ? "#1B78B9" : "#1C1C1C"} />
        ),
      }}
    />
    <Tabs.Screen
      name="appointment"
      options={{
        title: "Appointment",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <CalendarDays color={focused ? "#1B78B9" : "#1C1C1C"} />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <UserPen color={focused ? "#1B78B9" : "#1C1C1C"} />
        ),
      }}
    />
  </Tabs>
);

export default Layout;
