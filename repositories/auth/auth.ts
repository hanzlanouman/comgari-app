/* eslint-disable prettier/prettier */
import { post, put } from "@/common/api";
import { END_POINTS } from "@/common/endpoints";
import { BaseUrl } from "@/common/enviornment";
import { ApiReponse, AuthReponse } from "@/common/types";
import { getCustomErrorMessage, getErrorMessage } from "@/common/utils";
import {
  forgotPasswordPayload,
  LoginPayload,
  OtpPayload,
  ResetPasswordPayload,
  SignupPayload,
} from "@/repositories/auth/schemas";
import {
  TLoginResponse,
  TReponse,
  TVerifyCredPayload,
} from "@/repositories/auth/types";
import { AxiosError } from "axios";

interface IAuthRepository {
  login(payload: LoginPayload): Promise<TLoginResponse>;
  logout(): Promise<any>;
  register(signupPayLoad: SignupPayload): Promise<TLoginResponse>;
  forgotPassword(
    forgotPasswordPayload: forgotPasswordPayload
  ): Promise<TReponse>;
  verifyCred(
    otpPayLoad: TVerifyCredPayload,
    authResponse: TLoginResponse
  ): Promise<TReponse>;
}

export class AuthRepository implements IAuthRepository {
  private static instance: AuthRepository;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  async login(payload: LoginPayload): Promise<TLoginResponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.AUTH.LOGIN.route}`,
        payload,
        { show_loader: true }
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw new Error(getCustomErrorMessage(e));
    }
  }

  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Implementation for logout
    });
  }

  async register(
    signupPayLoad: Partial<SignupPayload>
  ): Promise<TLoginResponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.AUTH.REGISTER.route}`,
        signupPayLoad,
        { show_loader: true }
      );
      await this.sendOtp({ username: signupPayLoad.email! });

      return res?.data;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async forgotPassword(
    forgotPasswordPayLoad: forgotPasswordPayload
  ): Promise<TReponse> {
    try {
      const res: ApiReponse<any> = await post(
        `${BaseUrl + END_POINTS.AUTH.FORGOT_PASSWORD.route}`,
        forgotPasswordPayLoad,
        { show_loader: true }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async verifyCred(otpPayLoad: TVerifyCredPayload): Promise<TReponse> {
    try {
      const res = await put(END_POINTS.AUTH.VERFY_CRED.route, otpPayLoad, {
        show_loader: true,
      });

      return res;
    } catch (e: any) {
      throw new Error(getErrorMessage(e));
    }
  }

  async resetPassword(resetPayLoad: ResetPasswordPayload): Promise<TReponse> {
    try {
      const res: ApiReponse<any> = await post(
        `${BaseUrl + END_POINTS.AUTH.RESET_PASSWORD.route}`,
        resetPayLoad,
        { show_loader: true }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async sendOtp(
    forgotPasswordPayload: forgotPasswordPayload
  ): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.AUTH.OTP.route}`,
        forgotPasswordPayload,
        { show_loader: true }
      );

      return res;
    } catch (e: any) {
      throw new Error(getErrorMessage(e));
    }
  }
}
