import { useAuthorization } from "@/context/PermissionContext";
import { TUSER } from "@/repositories";
import React, { useEffect, useState } from "react";

type WithRoleType = {
  children: React.ReactNode;
  permission: string;
  resource: string;
  user: TUSER;
};
export default function WithRole({
  children,
  permission,
  resource,
  user,
}: WithRoleType) {
  const { getPermission } = useAuthorization();
  const [allow, setAllow] = useState(false);
  console.log("with Role here");
  useEffect(() => {
    setAllow(getPermission(user, permission, resource));
    console.log(getPermission(user, permission, resource));
  }, [getPermission, permission, resource, user]);
  return allow ? children : null;
}
