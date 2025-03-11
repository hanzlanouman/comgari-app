import { useEffect } from "react"
import { useAppSelector } from "./redux"
import { IS_ANDROID } from "@/utils"
import { router } from "expo-router"

export const useRedirectIfIOS = () => {
    const { isAuthenticated } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (IS_ANDROID) return;
        if (isAuthenticated) {
            router.replace('/(root)/(tabs)/home')
        } else {
            router.replace('/(auth)/sign-in')
        }
    }, [isAuthenticated])
}