/* eslint-disable prettier/prettier */
import { post, put } from "@/common/api";
import { END_POINTS } from "@/common/endpoints";
import { BaseUrl } from "@/common/enviornment";
import { ApiReponse, AuthReponse } from "@/common/types";
import { getErrorMessage } from "@/common/utils";
import {
  forgotPasswordPayload,
  LoginPayload,
  OtpPayload,
  ResetPasswordPayload,
  SignupPayload,
} from "@/repositories/auth/schemas";
import { TLoginResponse, TReponse } from "@/repositories/auth/types";
import { AxiosError } from "axios";

interface IAuthRepository {
  login(payload: LoginPayload): Promise<TLoginResponse>;
  logout(): Promise<any>;
  register(signupPayLoad: SignupPayload): Promise<TLoginResponse>;
  forgotPassword(
    forgotPasswordPayload: forgotPasswordPayload
  ): Promise<TReponse>;
  verifyCred(otpPayload: OtpPayload): Promise<TReponse>;
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
      const res: ApiReponse<TLoginResponse> = await post(
        `${END_POINTS.AUTH.LOGIN}`,
        payload
      );
      return res;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
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
    console.log(END_POINTS.AUTH.REGISTER);
    try {
      const res: ApiReponse<AuthReponse> = await post(
        `${BaseUrl + END_POINTS.AUTH.REGISTER.route}`,
        signupPayLoad
      );
      return res;
    } catch (e: AxiosError | any) {
      console.log(e, "Error");
      throw new Error(getErrorMessage(e));
    }
  }
  async forgotPassword(
    forgotPasswordPayLoad: forgotPasswordPayload
  ): Promise<TReponse> {
    try {
      const res: ApiReponse<any> = await post(
        `${BaseUrl + END_POINTS.AUTH.FORGOT_PASSWORD}`,
        forgotPasswordPayLoad
      );
      return res;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async verifyCred(otpPayLoad: OtpPayload): Promise<TReponse> {
    try {
      const res: ApiReponse<any> = await put(
        `${BaseUrl + END_POINTS.AUTH.VERFY_CRED}`,
        otpPayLoad
      );
      return res;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async resetPassword(resetPayLoad: ResetPasswordPayload): Promise<TReponse> {
    console.log("eee");
    try {
      const res: ApiReponse<any> = await post(
        `${BaseUrl + END_POINTS.AUTH.RESET_PASSWORD}`,
        resetPayLoad
      );
      return res;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
}
