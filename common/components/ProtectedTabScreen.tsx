// components/ProtectedTabScreen.tsx
import React from "react";
import { Tabs } from "expo-router";
import { useAuthorization } from "@/context/PermissionContext";
// Adjust the import based on your setup

interface ProtectedTabScreenProps {
  requiredPermission: string;
  name: string;
  options: object;
}

const ProtectedTabScreen: React.FC<ProtectedTabScreenProps> = ({
  requiredPermission,
  name,
  options,
}) => {
  const hasPermission = false;

  // Render the tab screen only if the user has the required permission
  return hasPermission ? <Tabs.Screen name={name} options={options} /> : null;
};

export default ProtectedTabScreen;
