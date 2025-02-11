import { Media, showErrorAlert, uploadMedia } from "@/utils"
import { useMutation } from "react-query"

export const useUpload = () => {
    const { mutate, reset } = useMutation({
        mutationFn: async (media: Media) => uploadMedia(media, undefined, true),
        retry: 3,
        retryDelay: 500,
        onError: (error: any) => {
            showErrorAlert(error?.message)
        },
    })
    const { mutate: mutateMultiple, reset: resetMultiple } = useMutation({
        mutationFn: async (media: Media[]) => uploadMedia(media, undefined, true),
        retry: 3,
        retryDelay: 500,
        onError: (error: any) => {
            showErrorAlert(error?.message)
        },
    })

    const upload = (media: Media, onSuccess: (data: string) => void) => {
        reset()
        mutate(media, {
            onSuccess: (data) => {
                if (!data.isSuccess) {
                    showErrorAlert(data.error)
                } else {
                    onSuccess(data.result)
                }
            }
        })
    }

    const uploadMultiple = (media: Media[], onSuccess: (data: string[]) => void) => {
        resetMultiple()
        mutateMultiple(media, {
            onSuccess: (data) => {
                if (!data.isSuccess) {
                    showErrorAlert(data.error)
                } else {
                    onSuccess(data.result)
                }
            }
        })
    }

    return { upload, uploadMultiple }
}