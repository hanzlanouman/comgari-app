// import axios from 'axios'
import { Media, TUploadMediaResponse } from '@/utils/media/types'

export default async function uploadMedia(url: string, media: Media, fieldName?: string, up?: (percentage: number) => void): Promise<TUploadMediaResponse>

export default async function uploadMedia(url: string, media: Media, fieldName = 'data', up?: (percentage: number) => void): Promise<TUploadMediaResponse> {
    try {
        fetch(url, {
            method: 'PUT',
            // @ts-ignore
            body: media,
            headers: {
                'Content-Type': media.type,
            },
        });

        // not using axios for r2
        // const formData = new FormData()
        // // @ts-ignore
        // formData.append(fieldName, media)

        // await axios.put(url, media, {
        //     headers: {
        //         'Content-Type': media.type,
        //     },
        //     onUploadProgress: (progressEvent: any) => {
        //         if (up) {
        //             const percentCompleted = Math.round(
        //                 (progressEvent.loaded * 100) / progressEvent.total
        //             );
        //             up(percentCompleted)
        //         }
        //     }
        // })

        return { isSuccess: true, error: undefined }
    } catch (e: any) {
        return {
            isSuccess: false,
            error: e?.message || "Could not upload media"
        }
    }
}