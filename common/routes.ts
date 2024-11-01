const baseAuthPath = "/(auth)/";
const baseRootPath = "/(root)/";

export const route = {
  auth: {
    login: `${baseAuthPath}sign-in` as const,
    register: `${baseAuthPath}sign-up` as const,
    forgotPassword: `${baseAuthPath}forgot-password` as const,
    resetPassword: `${baseAuthPath}reset-password` as const,
    Otp: `${baseAuthPath}otp` as const,
    OnBoarding: `${baseAuthPath}onboarding` as const,
    Welcome: `${baseAuthPath}welcome` as const,
  },
  root: {
    home: `${baseRootPath}(tabs)/home`,
  },
};
