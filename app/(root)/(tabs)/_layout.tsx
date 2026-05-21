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
import { NavigationState, useNavigationState } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useNotification } from "@/hooks/use-notification";
import { useSubscriptionValidation } from "@/hooks/use-subscription-validation";
import { IS_IOS } from "@/utils";

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
  const focusedRouteName = useNavigationState(getFocusedRouteName);
  useNotification();
  useSubscriptionValidation();

  const tabBarStyle = hide.includes(focusedRouteName || "")
    ? style.hide
    : {
        backgroundColor: "#ffffff",
      };

  const tabScreens = useMemo(() => {
    const isAffiliate = !!user?.sales_team;
    const isAffiliateClient = isAffiliate && !!user?.user_roles?.length;

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
        name: "Leads",
        title: "Leads",
        icon: UsersRound,
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

      // Any affiliate (pure or with roles): full access to all tabs for product demo
      if (isAffiliate) {
        return { ...screen, href: screen.name };
      }

      // Regular users: check permissions
      if (screen.permissionRequired) {
        const { user: permUser, permission, resource } = screen.permissionRequired;
        const hasPermission = getPermission(permUser!, permission, resource);
        const href = hasPermission ? screen.name : null;
        return { ...screen, href };
      }

      return { ...screen, href: screen.name };
    });
  }, [getPermission, user]);

  const isAffiliate = !!user?.sales_team;
  const isAffiliateClient = isAffiliate && !!user?.user_roles?.length;

  // Only render <Redirect> after all hooks are called
  if (!isAuthenticated) {
    return <Redirect href={route.auth.login} />;
  }

  if (IS_IOS && !isSubscribed && !(isAffiliate || isAffiliateClient)) {
    return <Redirect href="/(auth)/no-subscription" />;
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
      }}
    >
      {tabScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.href || screen.name}
          options={{
            title: screen.title,
            headerShown: screen.headerShown,
            href: screen.href,
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
