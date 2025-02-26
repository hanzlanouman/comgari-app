import { BaseUrl, UserUrl } from '@/common'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { M, Media, TUploadMediaResponse } from '@/utils/media/types'
import { Platform } from 'react-native';

const postUrl = BaseUrl + UserUrl + '/upload'

export default async function uploadMedia<TMedia extends M>(media: TMedia, fieldName?: string, up?: (percentage: number) => void): Promise<TUploadMediaResponse<TMedia>>

export default async function uploadMedia(media: M, fieldName = 'files', up?: (percentage: number) => void): Promise<TUploadMediaResponse<M>> {
    let mediaPayload: Media[] = [];
    if (!Array.isArray(media)) {
        mediaPayload = [media]
    } else {
        mediaPayload = media
    }

    const resp = await ReactNativeBlobUtil
        .fetch(
            'POST',
            postUrl,
            {
                'Content-Type': 'multipart/form-data',
            },
            mediaPayload.map(m => ({
                name: fieldName,
                filename: m.name,
                type: m.type,
                data: ReactNativeBlobUtil.wrap(
                    Platform.OS === 'ios'
                        ? decodeURIComponent(m.uri.replace('file://', ''))
                        : m.uri
                ),
            }))
        ).uploadProgress({ interval: 250 }, (written, total) => {
            if (up) {
                const percentCompleted = Math.round(
                    (written * 100) / total
                );
                up(percentCompleted)
            }
        })


    const json = await resp.json()
    if (!json?.data || json?.data?.length < 1) {
        return {
            isSuccess: false,
            result: undefined,
            error: "Could not upload media"
        }
    }

    if (json?.data?.length === 1) {
        return { isSuccess: true, result: json?.data[0].filename, error: undefined }
    }

    const result = (json?.data as { filename: string }[])?.map(d => d.filename)

    return { isSuccess: true, result, error: undefined }
}