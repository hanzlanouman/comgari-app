import { hideProgress, Media, showErrorAlert, showProgress, uploadMedia } from "@/utils"
import { useMutation } from "react-query"

export const useUpload = () => {
    const { mutate, reset, mutateAsync } = useMutation({
        mutationFn: async ({ media, uploadProgress }: { media: Media, uploadProgress: (per: number) => void }) => uploadMedia(media, undefined, true, uploadProgress),
        retry: 3,
        retryDelay: 500,
        onError: (error: any) => {
            hideProgress()
            showErrorAlert(error?.message)
        },
    })

    const { mutate: mutateMultiple, reset: resetMultiple, mutateAsync: mutateMutlipleAsync } = useMutation({
        mutationFn: async ({ media, uploadProgress }: { media: Media[], uploadProgress: (per: number) => void }) => uploadMedia(media, undefined, true, uploadProgress),
        retry: 3,
        retryDelay: 500,
        onError: (error: any) => {
            hideProgress()
            showErrorAlert(error?.message)
        },
    })

    const upload = (media: Media, onSuccess: (data: string) => void) => {
        reset()
        mutate({ media, uploadProgress }, {
            onSuccess: (data) => {
                hideProgress()
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
        mutateMultiple({ media, uploadProgress }, {
            onSuccess: (data) => {
                hideProgress()
                if (!data.isSuccess) {
                    showErrorAlert(data.error)
                } else {
                    onSuccess(data.result)
                }
            }
        })
    }

    const uploadAsync = async (media: Media) => {
        const resp = await mutateAsync({ media, uploadProgress })
        hideProgress()
        if (!resp.isSuccess) {
            showErrorAlert(resp.error)
        }
        return resp
    }

    const uploadMutlipleAsync = async (media: Media[]) => {
        const resp = await mutateMutlipleAsync({ media, uploadProgress })
        hideProgress()
        if (!resp.isSuccess) {
            showErrorAlert(resp.error)
        }
        return resp
    }

    const uploadProgress = (percentage: number) => {
        if (percentage === 100) {
            hideProgress();
        } else {
            showProgress("Uploading", parseFloat(percentage.toFixed(2)))
        }
    }

    return { upload, uploadMultiple, uploadAsync, uploadMutlipleAsync }
}