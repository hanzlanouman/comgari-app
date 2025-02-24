import { Media, showErrorAlert, uploadMedia } from "@/utils"
import { useMutation } from "react-query"

export const useUpload = () => {
    const { mutate, reset, mutateAsync } = useMutation({
        mutationFn: async (media: Media) => uploadMedia(media, undefined, true),
        retry: 3,
        retryDelay: 500,
        onError: (error: any) => {
            showErrorAlert(error?.message)
        },
    })

    const { mutate: mutateMultiple, reset: resetMultiple, mutateAsync: mutateMutlipleAsync } = useMutation({
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

    const uploadAsync = async (media: Media) => {
        const resp = await mutateAsync(media)
        if (!resp.isSuccess) {
            showErrorAlert(resp.error)
        }
        return resp
    }

    const uploadMutlipleAsync = async (media: Media[]) => {
        const resp = await mutateMutlipleAsync(media)
        if (!resp.isSuccess) {
            showErrorAlert(resp.error)
        }
        return resp
    }

    return { upload, uploadMultiple, uploadAsync, uploadMutlipleAsync }
}