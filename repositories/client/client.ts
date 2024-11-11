
import { AxiosError } from "axios";
import { TReponse } from "../auth";
import { getErrorMessage } from "@/common/utils";
import { get, post, put, del as httpDelete } from "@/common/api";
import { BaseUrl } from "@/common";
import { END_POINTS } from "@/common/endpoints";
import { CreateClientPayload, BriefPayload, ClientMediaPayload, TaskPayload } from "./schemas";

interface IClientRepository {
  createClient(payload: CreateClientPayload): Promise<TReponse>;
  getClients(start: number, limit: number): Promise<TReponse>;
  getBrief(clientId: number): Promise<TReponse>;
  updateBrief(payload: BriefPayload): Promise<TReponse>;
  createBrief(payload: BriefPayload): Promise<TReponse>;
  saveClientMedia(payload: ClientMediaPayload): Promise<TReponse>;
  createTask(payload: TaskPayload): Promise<TReponse>;
  deleteTask(taskId: number): Promise<TReponse>;
  updateTask(payload: TaskPayload, taskId: number): Promise<TReponse>;
  deleteClient(clientId: number): Promise<TReponse>;
  updateClient(clientId: number, payload: CreateClientPayload): Promise<TReponse>;
  getTask(clientId: number): Promise<TReponse>;
}

export class ClientRepository implements IClientRepository {
  private static instance: ClientRepository;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  static getInstance(): ClientRepository {
    if (!ClientRepository.instance) {
      ClientRepository.instance = new ClientRepository();
    }
    return ClientRepository.instance;
  }

  async createClient(payload: CreateClientPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.Client.CREATE_CLIENT.route}`,
        payload,
        { show_loader: true }
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getClients(start: number = 0, limit: number = 10): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.Client.GET_CLIENTS.route}?start=${start}&limit=${limit}`,
        { show_loader: true }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getBrief(clientId: number): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.Client.GET_BRIEF.route}/${clientId}`
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateBrief(payload: BriefPayload): Promise<TReponse> {
    try {
      const res = await put(
        `${BaseUrl + END_POINTS.Client.UPDATE_BRIEF.route}`,
        payload
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createBrief(payload: BriefPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.Client.CREATE_BRIEF.route}`,
        payload
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async saveClientMedia(payload: ClientMediaPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.Client.SAVE_MEDIA.route}`,
        payload
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createTask(payload: TaskPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.Client.CREATE_TASK.route}`,
        payload
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async deleteTask(taskId: number): Promise<TReponse> {
    try {
      const res = await httpDelete(
        `${BaseUrl + END_POINTS.Client.DELETE_TASK.route}/${taskId}`
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateTask(payload: TaskPayload, taskId: number): Promise<TReponse> {
    try {
      const res = await put(
        `${BaseUrl + END_POINTS.Client.UPDATE_TASK.route}/${taskId}`,
        payload
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async deleteClient(clientId: number): Promise<TReponse> {
    try {
      const res = await httpDelete(
        `${BaseUrl + END_POINTS.Client.DELETE_CLIENT.route}/${clientId}`
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateClient(
    clientId: number,
    payload: CreateClientPayload
  ): Promise<TReponse> {
    try {
      const res = await put(
        `${BaseUrl + END_POINTS.Client.UPDATE_CLIENT.route}/${clientId}`,
        payload
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getTask(clientId: number): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.Client.GET_TASK.route}/${clientId}`
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
}