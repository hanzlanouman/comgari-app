const baseAuthPath = "/(auth)/";

export const route = {
  auth: {
    login: `${baseAuthPath}sign-in`,
    register: `${baseAuthPath}sign-up`,
    forgotPassword: `${baseAuthPath}forgot-password`,
    resetPassword: `${baseAuthPath}reset-password`,
    Otp: `${baseAuthPath}otp`,
    OnBoarding: `${baseAuthPath}onboarding`,
  },
};
