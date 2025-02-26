import { UserStatus } from "./schemas"

export type TMemberListResponse = {
    id: number
    auth_id: number
    agency_id: number
    created_at: Date
    updated_at: Date
    deleted_At: Date | null
    created_by: number
    Auth: {
        id: number
        username: string
        email: string
        phone: string
        is_verified: boolean
        status: UserStatus
        createdAt: Date
        updatedAt: Date
        user: {
            id: number
            full_name: string
            avatar: string | null
            authId: number
            notification_token: string | null
            created_at: Date
            updated_at: Date
        }
    }
}[]
