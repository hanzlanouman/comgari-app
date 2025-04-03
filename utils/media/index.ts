import { isRunningInExpoGo } from 'expo'
import { TMediaError, TUploadMediaSuccess, TUploadMediaResponse, TDownloadResponse, Media } from '@/utils/media/types'

export * from '@/utils/media/pick-image'
export * from '@/utils/media/pick-document'
export * from '@/utils/media/types'

export type TPickAndUploadMedia = TUploadMediaSuccess | TMediaError

export async function uploadMedia(url: string, media: Media, fieldName?: string, thr?: boolean, up?: (percentage: number) => void): Promise<TUploadMediaResponse>

export async function uploadMedia(url: string, meida: Media, fieldName?: string, thr = false, up?: (percentage: number) => void): Promise<TUploadMediaResponse> {
    try {
        // @ts-ignore
        const _uploadMedia: any = (isRunningInExpoGo() ? await import('./upload-media.axios') : await import('./upload-media.native'))

        return _uploadMedia.default(url, meida, fieldName, up)
    } catch (e: any) {
        if (thr) {
            throw new Error(e?.message || "Something went wrong")
        }
        return {
            isSuccess: false,
            result: undefined,
            error: e?.message || "Something went wrong"
        }
    }
}

export async function downloadMedia(url: string): Promise<TDownloadResponse> {
    try {
        // @ts-ignore
        const _downloadMedia: any = (isRunningInExpoGo() ? await import('./download-media.expo') : await import('./download-media.native'))

        return _downloadMedia.Download(url)
    } catch (e: any) {
        return {
            success: false,
            message: e?.message || "Something went wrong"
        }
    }
}

export async function moveFile(uri: string): Promise<TDownloadResponse> {
    try {
        // @ts-ignore
        const _downloadMedia: any = (isRunningInExpoGo() ? await import('./download-media.expo') : await import('./download-media.native'))

        return _downloadMedia.MoveFile(uri)
    } catch (e: any) {
        return {
            success: false,
            message: e?.message || "Something went wrong"
        }
    }
}