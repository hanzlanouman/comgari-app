import { AxiosError } from "axios";
import { TReponse } from "../auth";
import { getErrorMessage } from "@/common/utils";
import { get, post, put, del as httpDelete, postForm } from "@/common/api";
import { BaseUrl } from "@/common";
import { END_POINTS } from "@/common/endpoints";
import {
  Request,
  CreateClientPayload,
  BriefPayload,
  ClientMediaPayload,
  TaskPayload,
  CreateNotePayload,
  CreateProjectPayload,
  UpdateClientPayload,
  ClientListingPayload
} from "./schemas";

type TClientReponse = {
  statusCode: boolean;
  data?: any;
  message?: any;
};

interface IClientRepository {
  uploadMedia(file: any): Promise<TReponse>;
  createClient(req: Request, payload: CreateClientPayload): Promise<TReponse>;
  deleteClient(req: Request, clientId: number): Promise<TReponse>;
  updateClient(clientId:string , payload: UpdateClientPayload): Promise<TReponse>;
  createBrief(payload: BriefPayload): Promise<TReponse>;
  getBrief(clientId: number): Promise<TReponse>;
  updateBrief(payload: BriefPayload): Promise<TReponse>;
  getSingleClient(clientId: number): Promise<TClientReponse>;
  getClients(payload: ClientListingPayload, req: Request): Promise<TReponse>;
  saveClientMedia(payload: ClientMediaPayload): Promise<TReponse>;
  createTask(req: Request, payload: TaskPayload): Promise<TReponse>;
  updateTask(taskId: number, payload: TaskPayload): Promise<TReponse>;
  deleteTask(taskId: number): Promise<TReponse>;
  getTask(projectId: number): Promise<TReponse>;
  createNote(payload: CreateNotePayload): Promise<TReponse>;
  getNotes(projectId: number): Promise<TReponse>;
  deleteNote(noteId: number): Promise<TReponse>;
  updateNote(noteId: number, payload: CreateNotePayload): Promise<TReponse>;
  createProject(req: Request, payload: CreateProjectPayload): Promise<TReponse>;
}

export class ClientRepository implements IClientRepository {
  private static instance: ClientRepository;

  private constructor() {}

  static getInstance(): ClientRepository {
    if (!ClientRepository.instance) {
      ClientRepository.instance = new ClientRepository();
    }
    return ClientRepository.instance;
  }
  async uploadMedia(formData: FormData): Promise<any> {
    try {
      const res = await postForm(
        `${BaseUrl + END_POINTS.Client.UPLOAD.route}`,
        formData,
        {
          headers: {
            'Accept': 'application/json',
          },
          transformRequest: (data) => {
            return data; 
          },
        }
      );
      
      if (res?.data?.data) {
        return res.data;
      } else if (Array.isArray(res?.data)) {
        return { data: res.data };
      }
      throw new Error('Invalid response format');
    } catch (e) {
      console.error('Upload error details:', e);
      throw getErrorMessage(e);
    }
  }
  async createClient(req: Request, payload: CreateClientPayload): Promise<TReponse> {
    try {
      const res = await post(`${BaseUrl}${END_POINTS.Client.CREATE_CLIENT.route}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async deleteClient(req: Request, clientId: number): Promise<TReponse> {
    try {
      const res = await httpDelete(`${BaseUrl}${END_POINTS.Client.DELETE_CLIENT.route}/${clientId}`);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateClient(clientId:string , payload: UpdateClientPayload): Promise<TReponse> {
    console.log("Updating client payload",payload)
    try {
      const res: any = await put(
        `${BaseUrl + END_POINTS.Client.UPDATE_CLIENT.route}/${clientId}`,
        payload
      );

      return res;
    } catch (e) {
      throw getErrorMessage(e);
    }
  }

  async createBrief(payload: BriefPayload): Promise<TReponse> {
    try {
      const res = await post(`${BaseUrl}${END_POINTS.Client.CREATE_BRIEF.route}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getBrief(clientId: number): Promise<TReponse> {
    try {
      const res = await get(`${BaseUrl}${END_POINTS.Client.GET_BRIEF.route}/${clientId}`);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateBrief(payload: BriefPayload): Promise<TReponse> {
    try {
      const res = await put(`${BaseUrl}${END_POINTS.Client.UPDATE_BRIEF.route}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getSingleClient(clientId: number): Promise<TClientReponse> {
    try {
      const res = await get(`${BaseUrl}${END_POINTS.Client.GET_SINGLE_CLIENT.route}/${clientId}`);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getClients(payload: ClientListingPayload, req: Request): Promise<TReponse> {
    try {
      const res = await post(`${BaseUrl}${END_POINTS.Client.GET_CLIENTS.route}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async saveClientMedia(payload: ClientMediaPayload): Promise<TReponse> {
    try {
      const res = await post(`${BaseUrl}${END_POINTS.Client.SAVE_MEDIA.route}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createTask(req: Request, payload: TaskPayload): Promise<TReponse> {
    try {
      const res = await post(`${BaseUrl}${END_POINTS.Client.CREATE_TASK.route}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateTask(taskId: number, payload: TaskPayload): Promise<TReponse> {
    try {
      const res = await put(`${BaseUrl}${END_POINTS.Client.UPDATE_TASK.route}/${taskId}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async deleteTask(taskId: number): Promise<TReponse> {
    try {
      const res = await httpDelete(`${BaseUrl}${END_POINTS.Client.DELETE_TASK.route}/${taskId}`);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getTask(projectId: number): Promise<TReponse> {
    try {
      const res = await get(`${BaseUrl}${END_POINTS.Client.GET_TASK.route}/${projectId}`);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createNote(payload: CreateNotePayload): Promise<TReponse> {
    try {
      const res = await post(`${BaseUrl}${END_POINTS.Client.CREATE_NOTE.route}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getNotes(projectId: number): Promise<TReponse> {
    try {
      const res = await get(`${BaseUrl}${END_POINTS.Client.GET_NOTES.route}/${projectId}`);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async deleteNote(noteId: number): Promise<TReponse> {
    try {
      const res = await httpDelete(`${BaseUrl}${END_POINTS.Client.DELETE_NOTE.route}/${noteId}`);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateNote(noteId: number, payload: CreateNotePayload): Promise<TReponse> {
    try {
      const res = await put(`${BaseUrl}${END_POINTS.Client.UPDATE_NOTE.route}/${noteId}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createProject(req: Request, payload: CreateProjectPayload): Promise<TReponse> {
    try {
      const res = await post(`${BaseUrl}${END_POINTS.Client.CREATE_PROJECT.route}`, payload);
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
}