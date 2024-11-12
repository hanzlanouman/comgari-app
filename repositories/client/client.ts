import { AxiosError } from "axios";
import { TReponse } from "../auth";
import { getErrorMessage } from "@/common/utils";
import { get, post, put, del as httpDelete } from "@/common/api";
import { BaseUrl } from "@/common";
import { END_POINTS } from "@/common/endpoints";
import { 
  CreateClientPayload, 
  BriefPayload, 
  ClientMediaPayload, 
  TaskPayload,
  CreateNotePayload,
  CreateProjectPayload,
  ClientListingPayload 
} from "./schemas";

interface RequestUser {
  id: number;
}

interface Request {
  user: RequestUser;
}

interface IClientRepository {
  createClient(req: Request, payload: CreateClientPayload): Promise<TReponse>;
  deleteClient(req: Request, clientId: number): Promise<TReponse>;
  updateClient(req: Request, clientId: number, payload: CreateClientPayload): Promise<TReponse>;
  createBrief(payload: BriefPayload): Promise<TReponse>;
  getBrief(clientId: number): Promise<TReponse>;
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

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  static getInstance(): ClientRepository {
    if (!ClientRepository.instance) {
      ClientRepository.instance = new ClientRepository();
    }
    return ClientRepository.instance;
  }

  async createClient(req: Request, payload: CreateClientPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl}${END_POINTS.Client.CREATE_CLIENT.route}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async deleteClient(req: Request, clientId: number): Promise<TReponse> {
    try {
      const res = await httpDelete(
        `${BaseUrl}${END_POINTS.Client.DELETE_CLIENT.route}/${clientId}`
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateClient(req: Request, clientId: number, payload: CreateClientPayload): Promise<TReponse> {
    try {
      const res = await put(
        `${BaseUrl}${END_POINTS.Client.UPDATE_CLIENT.route}/${clientId}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createBrief(payload: BriefPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl}${END_POINTS.Client.CREATE_BRIEF.route}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getBrief(clientId: number): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl}${END_POINTS.Client.GET_BRIEF.route}/${clientId}`
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }


  async getClients(payload: ClientListingPayload, req: Request): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl}${END_POINTS.Client.GET_CLIENTS.route}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async saveClientMedia(payload: ClientMediaPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl}${END_POINTS.Client.SAVE_MEDIA.route}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createTask(req: Request, payload: TaskPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl}${END_POINTS.Client.CREATE_TASK.route}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateTask(taskId: number, payload: TaskPayload): Promise<TReponse> {
    try {
      const res = await put(
        `${BaseUrl}${END_POINTS.Client.UPDATE_TASK.route}/${taskId}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async deleteTask(taskId: number): Promise<TReponse> {
    try {
      const res = await httpDelete(
        `${BaseUrl}${END_POINTS.Client.DELETE_TASK.route}/${taskId}`
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getTask(projectId: number): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl}${END_POINTS.Client.GET_TASK.route}/${projectId}`
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createNote(payload: CreateNotePayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl}${END_POINTS.Client.CREATE_NOTE.route}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getNotes(projectId: number): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl}${END_POINTS.Client.GET_NOTES.route}/${projectId}`
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async deleteNote(noteId: number): Promise<TReponse> {
    try {
      const res = await httpDelete(
        `${BaseUrl}${END_POINTS.Client.DELETE_NOTE.route}/${noteId}`
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async updateNote(noteId: number, payload: CreateNotePayload): Promise<TReponse> {
    try {
      const res = await put(
        `${BaseUrl}${END_POINTS.Client.UPDATE_NOTE.route}/${noteId}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createProject(req: Request, payload: CreateProjectPayload): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl}${END_POINTS.Client.CREATE_PROJECT.route}`,
        payload
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
}