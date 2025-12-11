import { CouponDuration, DiscountType } from "@/common";

export type TValidateCouponResponse = {
    valid: boolean;
    coupon: TCoupon
}

export type TCoupon = {
    id: number
    name: string
    code: string
    duration: CouponDuration
    type: DiscountType
    redeemed: number
    max_redemptions: number
    value: number
    auth_id?: number
    createdAt: Date
    updatedAt: Date
}

export type TTrialStatusResponse = {
    has_used_trial: boolean
    trial_started_at: string | null
    trial_end_date: string | null
    trial_expired: boolean
    has_active_subscription: boolean
    is_on_trial: boolean
    subscription: {
        plan_name: string
        expiry_date: string
        is_trial: boolean
    } | null
}