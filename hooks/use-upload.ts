import { clientRepo } from "@/repositories"
import { TPresignedUrlPayload } from "@/repositories/client/schemas"
import { getExtension, hideProgress, Media, showErrorAlert, showProgress, uploadMedia } from "@/utils"
import { useMutation } from "react-query"

type TUploadMediaAsync = { url: string, media: Media, uploadProgress: (per: number) => void }

export const useUpload = () => {
    const {
        reset: resetPresignedUrl,
        mutateAsync: getPresignedUrlAsync
    } = useMutation({
        mutationFn: (payload: TPresignedUrlPayload) => clientRepo.getPresignedUrl(payload),
        onError: (error: any) => {
            showErrorAlert(error?.message)
        },
    })

    const { reset, mutateAsync } = useMutation({
        mutationFn: async ({ url, media, uploadProgress }: TUploadMediaAsync) =>
            uploadMedia(url, media, undefined, true, uploadProgress),
        retry: 3,
        retryDelay: 1000,
        onError: (error: any) => {
            hideProgress()
            showErrorAlert(error?.message)
        },
    })

    const formatPayload = (media: Media[]) => {
        return media.map((item) => {
            const extension = getExtension(item.name)
            if (!extension) throw new Error("Invalid file extension")

            return {
                name: item.name,
                extension: getExtension(item.name) || "jpg",
            }
        })
    }

    const uploadAsync = async (media: Media) => {
        try {
            resetPresignedUrl()
            reset()

            const payload = formatPayload([media])
            const result = await getPresignedUrlAsync(payload)
            if (!result || result.length < 1) throw new Error("Invalid response")

            const presignedUrlResp = result[0]
            const transformedMedia: Media = {
                ...media,
                name: presignedUrlResp.updatedName,
            }

            const resp = await mutateAsync({
                url: presignedUrlResp.signedUrl,
                media: transformedMedia,
                uploadProgress
            })

            hideProgress()
            if (!resp.isSuccess) {
                showErrorAlert(resp.error)

                return {
                    isSuccess: false,
                    result: undefined,
                    error: resp.error
                }
            }

            return {
                isSuccess: true,
                result: presignedUrlResp.fileUrl,
                error: undefined
            }
        } catch (e: any) {
            showErrorAlert(e?.message || "Something went wrong")
            return {
                isSuccess: false,
                result: undefined,
                error: e?.message || "Something went wrong"
            }
        }
    }

    const uploadProgress = (percentage: number) => {
        if (percentage === 100) {
            hideProgress();
        } else {
            showProgress("Uploading", parseFloat(percentage.toFixed(2)))
        }
    }

    return { uploadAsync }
}