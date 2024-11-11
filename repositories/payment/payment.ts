import { AxiosError } from "axios";
import { TLoginResponse, TReponse } from "../auth";
import { get, post } from "@/common/api";
import { BaseUrl } from "@/common";
import { END_POINTS } from "@/common/endpoints";
import { getErrorMessage } from "@/common/utils";

interface IPaymentRepository {
  createBuyer(authResponse: TLoginResponse): Promise<TReponse>;
  getCards(authResponse: TLoginResponse): Promise<TReponse>;
  getSubscription(authResponse: TLoginResponse): Promise<TReponse>;
  createSubscription(
    payload: any,
    authResponse: TLoginResponse
  ): Promise<TReponse>;
}

export class PaymentRepository implements IPaymentRepository {
  private static instance: PaymentRepository;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }
  async createSubscription(
    payload: any,
    authResponse: TLoginResponse
  ): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.PAYMENT.CREATE_SUBSCRIPTION.route}`,
        payload,
        {
          show_loader: true,

          headers: { Authorization: `Bearer ${authResponse.access_token}` },
        }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async getSubscription(authResponse: any): Promise<TReponse> {
    console.log(
      authResponse,
      authResponse?.access_token,
      "Auth Response in repo"
    );
    try {
      const parsedAuthResponse = JSON.parse(authResponse);
      const res = await get(
        `${BaseUrl + END_POINTS.PAYMENT.GET_SUBSCRIPTION.route}`,
        {
          show_loader: true,

          headers: {
            Authorization: `Bearer ${parsedAuthResponse.access_token}`,
          },
        }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
  async getCards(authResponse: TLoginResponse): Promise<TReponse> {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImZ1bGxfbmFtZSI6IkFkbWluIiwicm9sZXMiOlt7ImlkIjoxLCJyb2xlX2lkIjoxLCJ1c2VyX2lkIjoxLCJjcmVhdGVkX2F0IjoiMjAyNC0xMS0wNVQxMDoxNToyMi4xODdaIiwidXBkYXRlZF9hdCI6IjIwMjQtMTEtMDVUMTA6MTU6MjIuMTg3WiIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJBZG1pbiIsImNyZWF0ZWRfYXQiOiIyMDI0LTExLTA1VDEwOjE1OjIyLjAyMloiLCJ1cGRhdGVkX2F0IjoiMjAyNC0xMS0wNVQxMDoxNToyMi4wMjJaIiwicm9sZV9ncm91cF9pZCI6MX19XSwiYXV0aF9pZCI6MSwiaWF0IjoxNzMwODgxNDk1LCJleHAiOjE3MzEwNTQyOTV9.RPVQGMpe6Jfg5MFa5qp1JlPZ850rD0Y1SYuVWyEk4eY";
      const res = await get(`${BaseUrl + END_POINTS.PAYMENT.GET_CARD.route}`, {
        show_loader: true,

        headers: {
          Authorization: `Bearer ${authResponse.access_token}`,
        },
      });
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  static getInstance(): PaymentRepository {
    if (!PaymentRepository.instance) {
      PaymentRepository.instance = new PaymentRepository();
    }
    return PaymentRepository.instance;
  }
  async createBuyer(authResponse: TLoginResponse): Promise<TReponse> {
    try {
      const res = await get(
        `${BaseUrl + END_POINTS.PAYMENT.CREATE_BUYER.route}`,
        {
          show_loader: true,

          headers: {
            Authorization: `Bearer ${authResponse.access_token}`,
          },
        }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }
}
