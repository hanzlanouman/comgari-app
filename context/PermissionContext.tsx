import React, { createContext, useEffect, useState, ReactNode } from "react";
import { MemberRepository, TUSER } from "@/repositories";

type PermissionDetail = {
  id: number;
  name: string;
  resource: string;
};

type UserPermission = {
  id: number;
  userId: number;
  permissionId: number;
  permission: PermissionDetail;
};

interface AuthorizationContextType {
  permissions: UserPermission[];
  loading: boolean;
  getPermission: (id: TUSER, permission: string, resource: string) => boolean;
}

const AuthorizationContext = createContext<AuthorizationContextType | null>(
  null
);

interface AuthorizationProviderProps {
  children: ReactNode;
}

export const AuthorizationProvider: React.FC<AuthorizationProviderProps> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userRepo = MemberRepository.getInstance();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await userRepo.getUserPermissions();
        console.log(response, "Response is this");
        const permissionsData: UserPermission[] = response.data;
        console.log(permissionsData, "Permission Data is");
        setPermissions(permissionsData);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [userRepo]);

  const getPermission = (user: TUSER, permission: string, resource: string) => {
    const isAdmin = user?.user_roles?.some(
      (item) => item.role.name === "Admin"
    );
    let hasPermission = false;
    if (isAdmin) {
      return true;
    }
    if (permission.length > 0) {
      hasPermission = permissions?.some((item) => {
        return (
          item.userId === user?.id &&
          item.permission.name === permission &&
          item.permission.resource === resource
        );
      });
    }

    return hasPermission;
  };

  return (
    <AuthorizationContext.Provider
      value={{ permissions, loading, getPermission }}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export const useAuthorization = () => {
  const context = React.useContext(AuthorizationContext);
  if (!context) {
    throw new Error(
      "useAuthorization must be used within an AuthorizationProvider"
    );
  }
  return context;
};
