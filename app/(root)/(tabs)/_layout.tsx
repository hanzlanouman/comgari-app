import React, { useMemo } from "react";
import { route } from "@/common";
import { useAuthorization } from "@/context/PermissionContext";
import { useAppSelector } from "@/hooks/redux";
import { Redirect, Tabs } from "expo-router";
import {
  CalendarDays,
  House,
  UserPen,
  Users,
  UsersRound,
} from "lucide-react-native";

const Layout = () => {
  const { getPermission } = useAuthorization();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const tabScreens = useMemo(() => {
    const screens = [
      {
        name: "home",
        title: "Home",
        icon: House,
        permissionRequired: null,
        headerShown: true,
      },
      {
        name: "members",
        title: "Members",
        icon: Users,
        permissionRequired: {
          user: user,
          permission: "Get",
          resource: "member",
        },
        headerShown: false,
      },
      {
        name: "clients",
        title: "Clients",
        icon: UsersRound,
        permissionRequired: {
          user: user,
          permission: "Get",
          resource: "client",
        },
        headerShown: false,
      },
      {
        name: "appointment",
        title: "Appointment",
        icon: CalendarDays,
        permissionRequired: {
          user: user,
          permission: "Get",
          resource: "appointment",
        },
        headerShown: false,
      },
      {
        name: "profile",
        title: "Profile",
        icon: UserPen,

        headerShown: false,
      },
    ];

    return screens.map((screen) => {
      if (screen.permissionRequired) {
        const { user, permission, resource } = screen.permissionRequired;
        console.log(user, "USer in screen");
        const hasPermission = getPermission(user!, permission, resource);
        return {
          ...screen,
          href: hasPermission ? screen.name : null,
        };
      }
      return {
        ...screen,
        href: screen.name,
      };
    });
  }, [getPermission, user]);

  // Only render <Redirect> after all hooks are called
  if (!isAuthenticated) {
    return <Redirect href={route.auth.login} />;
  }

  return (
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
      {tabScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.href || screen.name} // Use href if it's not null
          options={{
            title: screen.title,
            headerShown: screen.headerShown,
            href: screen.href, // Pass href here
            tabBarIcon: ({ focused }) => (
              <screen.icon color={focused ? "#1B78B9" : "#1C1C1C"} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default Layout;
