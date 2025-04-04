/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from "axios";
import { TLoginResponse, TReponse } from "../auth";
import { del, get, post } from "@/common/api";
import { BaseUrl } from "@/common";
import { END_POINTS } from "@/common/endpoints";
import { getErrorMessage } from "@/common/utils";
import { TCreateSubscriptionPayload } from "./schema";

interface IPaymentRepository {
  createBuyer(authResponse?: TLoginResponse): Promise<TReponse>;
  getCards(authResponse?: TLoginResponse): Promise<TReponse>;
  getSubscription(authResponse?: TLoginResponse): Promise<TReponse>;
  createSubscription(
    payload: any,
    authResponse?: TLoginResponse
  ): Promise<TReponse>;
}

export class PaymentRepository implements IPaymentRepository {
  private static instance: PaymentRepository;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  static getInstance(): PaymentRepository {
    if (!PaymentRepository.instance) {
      PaymentRepository.instance = new PaymentRepository();
    }
    return PaymentRepository.instance;
  }

  async createSubscription(
    payload: any,
    authResponse?: TLoginResponse
  ): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.PAYMENT.CREATE_SUBSCRIPTION.route}`,
        payload,
        {
          show_loader: true,
          headers: authResponse
            ? { Authorization: `Bearer ${authResponse.access_token}` }
            : undefined,
        }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getSubscription(authResponse?: TLoginResponse): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.PAYMENT.GET_SUBSCRIPTION.route}`,
        {
          show_loader: true,
          headers: authResponse
            ? { Authorization: `Bearer ${authResponse.access_token}` }
            : undefined,
        }
      );

      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getCards(authResponse?: TLoginResponse): Promise<TReponse> {
    try {
      const res = await get(`${BaseUrl + END_POINTS.PAYMENT.GET_CARD.route}`, {
        show_loader: true,
        headers: authResponse
          ? { Authorization: `Bearer ${authResponse.access_token}` }
          : undefined,
      });
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async createBuyer(authResponse?: TLoginResponse): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.PAYMENT.CREATE_BUYER.route}`,
        {
          show_loader: true,
          headers: authResponse
            ? { Authorization: `Bearer ${authResponse.access_token}` }
            : undefined,
        }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getAgencySubscription() {
    try {
      const res = await get(`${BaseUrl + END_POINTS.PAYMENT.AGENCY_SUBSCRIPTION.route}`, {
        show_loader: true
      })

      return res
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e)
    }
  }

  async updateAgencySubscription(payload: TCreateSubscriptionPayload) {
    try {
      const res = await post(`${BaseUrl + END_POINTS.PAYMENT.UPGRADE_PLAN.route}`, payload, {
        show_loader: true
      })

      return res
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e)
    }
  }

  async cancelSubscription() {
    try {
      const res = await del(`${BaseUrl + END_POINTS.PAYMENT.CANCEL_SUBSCRIPTION.route}`, {
        show_loader: true
      })

      return res
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e)
    }
  }
}
