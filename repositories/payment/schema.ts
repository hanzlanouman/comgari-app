import * as yup from 'yup'

export const CreateSubscriptionSchema = yup.object().shape({
    id: yup.string().required("ID is required"),
    paymentMethod_id: yup.string().required("Payment Id is required")
})

export type TCreateSubscriptionPayload = yup.InferType<typeof CreateSubscriptionSchema>