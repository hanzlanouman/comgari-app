/* eslint-disable prettier/prettier */
export enum APP_NAMES {
  USER = "USER",
  AUTH = "AUTH",
  PAYMENT = "PAYMENT",
}
export enum OTP_TYPE {
  VIERIFICATION = "verification",
  PASSWORD_RESET = "password-reset",
  MEMBER_VERIFICATION = "member_verification",
}

export enum Action {
  ADD = 'Add',
  REMOVE = 'Remove',
}

export enum TaskPriority {
  low = "low",
  medium = "medium",
  high = "high",
}


export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export enum CouponDuration {
  forever = "forever",
  once = "once",
}