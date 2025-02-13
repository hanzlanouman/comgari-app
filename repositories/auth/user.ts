/* eslint-disable prettier/prettier */
export type TRole = {
  id: number;
  role_id: number;
  user_id: number;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  role: {
    id: number;
    name: string;
    created_at: string; // ISO 8601 date string
    updated_at: string; // ISO 8601 date string
    role_group_id: number;
  };
};

export type TUSER = {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  authId: string;
  user_roles: TRole[];
  subscription: boolean;
};
