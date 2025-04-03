import ReactNativeBlobUtil from 'react-native-blob-util'
import { Media, TUploadMediaResponse } from '@/utils/media/types'
import { Platform } from 'react-native';

export default async function uploadMedia(url: string, media: Media, fieldName?: string, up?: (percentage: number) => void): Promise<TUploadMediaResponse>

export default async function uploadMedia(url: string, media: Media, fieldName = 'data', up?: (percentage: number) => void): Promise<TUploadMediaResponse> {

    const resp = await ReactNativeBlobUtil
        .fetch(
            'PUT',
            url,
            {
                'Content-Type': media.type,
            },
            ReactNativeBlobUtil.wrap(
                Platform.OS === 'ios'
                    ? decodeURIComponent(media.uri.replace('file://', ''))
                    : media.uri
            )
        ).uploadProgress({ interval: 250 }, (written, total) => {
            if (up) {
                const percentCompleted = Math.round(
                    (written * 100) / total
                );
                up(percentCompleted)
            }
        })


    if (resp.respInfo.status >= 200 && resp.respInfo.status < 300) {
        return { isSuccess: true, error: undefined }
    }

    return {
        isSuccess: false,
        error: "Could not upload media"
    }
}
