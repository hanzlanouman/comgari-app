import { BaseUrl, UserUrl } from '@/common'
import axios from 'axios'
import { M, Media, TUploadMediaResponse } from '@/utils/media/types'

const postUrl = BaseUrl + UserUrl + '/upload'

export default async function uploadMedia<TMedia extends M>(media: TMedia, fieldName?: string, up?: (percentage: number) => void): Promise<TUploadMediaResponse<TMedia>>

export default async function uploadMedia(media: M, fieldName = 'files', up?: (percentage: number) => void): Promise<TUploadMediaResponse<M>> {
    let mediaPayload: Media[] = [];
    if (!Array.isArray(media)) {
        mediaPayload = [media]
    } else {
        mediaPayload = media
    }
    const formData = new FormData()
    // @ts-ignore
    mediaPayload.forEach(m => formData.append(fieldName, m))

    const json = await axios.post(postUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
            if (up) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                up(percentCompleted)
            }
        }
    })

    if (!json?.data?.data || json?.data?.data?.length < 1) {
        return {
            isSuccess: false,
            result: undefined,
            error: "Could not upload media"
        }
    }

    if (json?.data?.data?.length === 1) {
        return { isSuccess: true, result: json?.data?.data[0].filename, error: undefined }
    }

    const result = (json?.data?.data as { filename: string }[])?.map(d => d.filename)

    return { isSuccess: true, result, error: undefined }
}