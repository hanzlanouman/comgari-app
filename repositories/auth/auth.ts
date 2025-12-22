/* eslint-disable prettier/prettier */
import { get, post, put } from "@/common/api";
import { END_POINTS } from "@/common/endpoints";
import { BaseUrl } from "@/common/enviornment";
import { ApiReponse } from "@/common/types";
import { getCustomErrorMessage, getErrorMessage } from "@/common/utils";
import {
  forgotPasswordPayload,
  LoginPayload,
  ChangePasswordPayload,
  UpdateProfilePayload,
  UpdateProfilePicPayload,
  ResetPasswordPayload,
  SignupPayload,
  TDeleteAcountSchema,
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
  verifyGoogleToken(payload: any): Promise<TReponse>;
  deleteAccount(payload: TDeleteAcountSchema): Promise<TReponse>;
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
  async updateProfile(
    payload: UpdateProfilePayload
  ): Promise<{ message: string }> {
    try {
      const res = await put(
        `${BaseUrl + END_POINTS.AUTH.UPDATE_PROFILE.route}`,
        payload,
        { show_loader: true }
      );
      return res?.data;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async updateProfilePic(
    payload: UpdateProfilePicPayload
  ): Promise<{ message: string }> {
    try {
      const res = await put(
        `${BaseUrl + END_POINTS.AUTH.UPDATE_PROFILE_PIC.route}`,
        payload,
        { show_loader: true }
      );
      return res?.data;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async verifyGoogleToken(payload: any): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.AUTH.GOOGLE_LOGIN.route}`,
        payload,
        { show_loader: true }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw getErrorMessage(e);
    }
  }

  async googleSignIn(payload: { token?: string; server_auth_code?: string }): Promise<any> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.AUTH.GOOGLE_SIGNIN.route}`,
        payload,
        { show_loader: true }
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }

  async googleSignUp(payload: {
    token?: string;
    server_auth_code?: string;
    user_name: string;
    business_name: string;
    phone: string;
  }): Promise<TLoginResponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.AUTH.GOOGLE_SIGNUP.route}`,
        payload,
        { show_loader: true }
      );
      return res.data;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async changePassword(
    payload: ChangePasswordPayload
  ): Promise<{ message: string }> {
    try {
      const res = await put(
        `${BaseUrl + END_POINTS.AUTH.CHANGE_PASSWORD.route}`,
        payload,
        { show_loader: true }
      );
      return res?.data;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async checkOAuth(): Promise<boolean> {
    try {
      const res = await get(`${BaseUrl + END_POINTS.AUTH.CHECK_O_AUTH.route}`, {
        show_loader: true,
      });

      return res?.data?.hasOauth;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
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
      return res?.data;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
  async addToken(token: string) {
    const notificationToken = {
      token: token,
    };
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.AUTH.NOTIFICATIONTOKEN.route}`,
        notificationToken,
        { show_loader: true }
      );
      return res;
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
  async verifyCred(
    otpPayLoad: TVerifyCredPayload,
    authResponse: TLoginResponse
  ): Promise<TReponse> {
    try {
      const res = await put(END_POINTS.AUTH.VERIFY_CRED.route, otpPayLoad, {
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

  async deleteAccount(payload: TDeleteAcountSchema): Promise<TReponse> {
    try {
      const res = await post(
        `${BaseUrl + END_POINTS.AUTH.DELETE_ACCOUNT_EMAIL.route}`,
        payload,
        { show_loader: true }
      );
      return res;
    } catch (e: AxiosError | any) {
      throw new Error(getErrorMessage(e));
    }
  }
}
export const AuthRepo = AuthRepository.getInstance();
