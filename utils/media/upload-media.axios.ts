import { BaseUrl, UserUrl } from '@/common'
import axios from 'axios'
import { M, Media, TUploadMediaResponse } from '@/utils/media/types'

const postUrl = UserUrl + '/upload'

export default async function uploadMedia<TMedia extends M>(media: TMedia, fieldName?: string): Promise<TUploadMediaResponse<TMedia>>

export default async function uploadMedia(media: M, fieldName = 'files'): Promise<TUploadMediaResponse<M>> {
    let mediaPayload: Media[] = [];
    if (!Array.isArray(media)) {
        mediaPayload = [media]
    } else {
        mediaPayload = media
    }
    const formData = new FormData()
    // @ts-ignore
    mediaPayload.forEach(m => formData.append(fieldName, m))

    const json = await axios.post(BaseUrl + postUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
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