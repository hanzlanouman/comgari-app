import { AxiosError } from "axios";
import { TReponse } from "../auth";
import { getErrorMessage } from "@/common/utils";
import { get, post, put, del, postForm } from "@/common/api";
import { BaseUrl, UserUrl } from "@/common";
import { END_POINTS } from "@/common/endpoints";
import { MemberPayload, UpdateMemberPayload } from "./schemas";

interface IMemberRepository {
  getAllRoles(): Promise<TReponse>;
  getPermissions(): Promise<TReponse>;
  createMember(payload: MemberPayload): Promise<TReponse>;
  getMember(): Promise<TReponse>;
  deleteMember(id: number): Promise<TReponse>;
  updateMember(id:number , payload: UpdateMemberPayload ): Promise<TReponse>;

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
        `${BaseUrl + END_POINTS.Member.CREATE_MEMBER.route}`,
        { show_loader: true }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
  async deleteMember(id: number): Promise<TReponse>
  {
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

  async updateMember(id:number , payload: UpdateMemberPayload ): Promise<TReponse>
  {
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
  async getAllRoles(): Promise<TReponse> {
    try {
      const res = await get(`${BaseUrl + END_POINTS.Member.GET_ROLE.route}`);
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
  async getPermissions(): Promise<TReponse> {
    console.log(
      `${BaseUrl + UserUrl + END_POINTS.Member.GET_PERMISSION.route}`,
      "Permission is"
    );
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
    console.log(
      `${BaseUrl + UserUrl + END_POINTS.Member.GET_USER_PERMISSION.route}`,
      "Permission is"
    );
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
