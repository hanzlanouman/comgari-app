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
import { NavigationState, useNavigationState, } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useNotification } from "@/hooks/use-notification"; 

const hide = ["job-details", "specifications", "review"];

const getFocusedRouteName = (
  state: Partial<NavigationState> | undefined
): string | undefined => {
  if (!state || !state.routes || state.index === undefined) {
    return undefined;
  }

  const route = state.routes[state.index];

  if (route.state) {
    return getFocusedRouteName(route.state as Partial<NavigationState>);
  }
  console.log(route.params, "Route params");
  if (
    route.params &&
    typeof route.params === "object" &&
    route.params?.screen
  ) {
    return route.params?.params?.screen; // Get the nested screen name from params
  }

  // Return the name of the current route
  return route.name;
};

const Layout = () => {
  const { getPermission } = useAuthorization();
  const { isAuthenticated, isSubscribed, user } = useAppSelector((state) => state.auth);
  console.log("user sign in : ", user)
  const focusedRouteName = useNavigationState(getFocusedRouteName);

  console.log(focusedRouteName, "Focused Route Name");

  const tabBarStyle = hide.includes(focusedRouteName || "")
    ? style.hide
    : {
        backgroundColor: "#ffffff",
      };

  const tabScreens = useMemo(() => {
    const screens = [
      {
        name: "home",
        title: "Dashboard",
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
          permission: "manage",
          resource: "member",
        },
        headerShown: false,
      },
      {
        name: "clients",
        title: "Clients",
        icon: UsersRound,
       
        headerShown: false,
      },
      {
        name: "appointment",
        title: "Appointment",
        icon: CalendarDays,
       
        headerShown: false,
      },
      {
        name: "profile",
        title: "Profile",
        icon: UserPen,

        headerShown: false,
      },
      {
        name: "proposal",
        title: "proposal",
        icon: UserPen,
        headerShown: false,
      },
    ];

    return screens.map((screen) => {
      if (screen.name === "proposal") {
        return { ...screen, href: null };
      }
      if (screen.name === "clients") {
        const hasPermission = screen.permissionRequired 
          ? getPermission(
              screen.permissionRequired.user!, 
              screen.permissionRequired.permission, 
              screen.permissionRequired.resource
            )
          : true;
        
        // Hide tab if no permission and no client data
        const shouldHideTab = !hasPermission && (!clientData || clientData.length === 0);
        
        return {
          ...screen,
          href: shouldHideTab ? null : screen.name,
        };
      }
      if (screen.permissionRequired) {
        const { user, permission, resource } = screen.permissionRequired;
        console.log(user, "User in screen");
        const hasPermission = getPermission(user!, permission, resource);
        console.log("per", hasPermission)
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
  useNotification(isAuthenticated);

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

        tabBarStyle: tabBarStyle,
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
const style = StyleSheet.create({
  hide: {
    display: "none",
  },
});

