/* eslint-disable @typescript-eslint/no-unused-vars */
//repositories\member\member.ts
import { AxiosError } from "axios";
import { TReponse } from "../auth";
import { getErrorMessage } from "@/common/utils";
import { get, post, put, del } from "@/common/api";
import { BaseUrl } from "@/common";
import { END_POINTS } from "@/common/endpoints";
import { MemberPayload, UpdateMemberPayload } from "./schemas";
import { TMemberListResponse } from "./types";

interface IMemberRepository {
  getAllRoles(): Promise<TReponse>;
  getPermissions(): Promise<TReponse>;
  createMember(payload: MemberPayload): Promise<TReponse>;
  getMember(): Promise<TReponse>;
  getMemberList(): Promise<TMemberListResponse>;
  deleteMember(id: number): Promise<TReponse>;
  updateMember(id: number, payload: UpdateMemberPayload): Promise<TReponse>;
  getDashboard(): Promise<TReponse>;
}
export class MemberRepository implements IMemberRepository {
  private static instance: MemberRepository;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  static getInstance(): MemberRepository {
    if (!MemberRepository.instance) {
      MemberRepository.instance = new MemberRepository();
    }
    return MemberRepository.instance;
  }
  async createMember(payload: MemberPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.Member.CREATE_MEMBER.route}`,
        payload,
        { show_loader: true }
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
  async getMember(): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.Member.GET_MEMBER.route}`,
        { show_loader: true }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getMemberList(): Promise<TMemberListResponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.Member.GET_MEMBER_LIST.route}`,
        { show_loader: true }
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
  async deleteMember(id: number): Promise<TReponse> {
    try {
      const res: any = await del(
        `${BaseUrl + END_POINTS.Member.DELETE_MEMBER.route}/${id}`,
        { show_loader: true }
      );

      return res.data;
    } catch (e) {

      throw getErrorMessage(e);
    }
  }

  async updateMember(id: number, payload: UpdateMemberPayload): Promise<TReponse> {
    try {
      const res: any = await put(
        `${BaseUrl + END_POINTS.Member.DELETE_MEMBER.route}/${id}`,
        payload,
        { show_loader: true }
      );

      return res.data;
    } catch (e) {

      throw getErrorMessage(e);
    }
  }
  async getDashboard(params?: { startDate?: string; endDate?: string }) {
    try {
      const query = params
        ? '?' + new URLSearchParams(
            Object.entries(params).filter(([, v]) => v != null) as [string, string][]
          ).toString()
        : '';
      const res = await get(`${BaseUrl + END_POINTS.Dashboard.GET_DASHBOARD.route}${query}`, {
        show_loader: true,
      });
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getAllRoles(): Promise<TReponse> {
    try {
      const res = await get(`${BaseUrl + END_POINTS.Member.GET_ROLE.route}`);
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
  async getPermissions(): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.Member.GET_PERMISSION.route}`
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
  async getUserPermissions(): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.Member.GET_USER_PERMISSION.route}`
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

}
