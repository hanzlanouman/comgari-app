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