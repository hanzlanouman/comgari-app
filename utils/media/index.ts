import { ImagePickerOptions } from '@/utils/media/pick-image'
import { pickImage } from '@/utils/media/pick-image'
import { isRunningInExpoGo } from 'expo'
import { M, TMediaError, TUploadMediaSuccess, TUploadMediaResponse } from '@/utils/media/types'
import { DocumentPickerOptions, pickDocument } from '@/utils/media/pick-document'

export * from '@/utils/media/pick-image'
export * from '@/utils/media/pick-document'
export * from '@/utils/media/types'

export type TPickAndUploadMedia<TMedia extends boolean> =
    (
        TMedia extends true ?
        TUploadMediaSuccess<string[]>
        :
        TUploadMediaSuccess<string>
    )
    | TMediaError

export async function pickAndUploadMedia<TMultiple extends boolean>(mutliple: TMultiple, options?: ImagePickerOptions, up?: (percentage: number) => void): Promise<TPickAndUploadMedia<TMultiple>>

export async function pickAndUploadMedia(mutliple: boolean, options?: ImagePickerOptions, up?: (percentage: number) => void): Promise<TPickAndUploadMedia<boolean>> {
    const resp = await pickImage(mutliple, options)
    if (!resp.isSuccess) {
        return resp
    }

    return uploadMedia(resp.result, undefined, false, up)
}

export async function pickAndUploadDocument<TMultiple extends boolean>(mutliple: TMultiple, options?: DocumentPickerOptions, up?: (percentage: number) => void): Promise<TPickAndUploadMedia<TMultiple>>

export async function pickAndUploadDocument(mutliple: boolean, options?: DocumentPickerOptions, up?: (percentage: number) => void): Promise<TPickAndUploadMedia<boolean>> {
    const resp = await pickDocument(mutliple, options)
    if (!resp.isSuccess) {
        return resp
    }

    return uploadMedia(resp.result, undefined, false, up)
}

export async function uploadMedia<TMedia extends M>(media: TMedia, fieldName?: string, thr?: boolean, up?: (percentage: number) => void): Promise<TUploadMediaResponse<TMedia>>

export async function uploadMedia(meida: M, fieldName?: string, thr = false, up?: (percentage: number) => void): Promise<TUploadMediaResponse<M>> {
    try {
        // @ts-ignore
        const _uploadMedia: any = (isRunningInExpoGo() ? await import('./upload-media.axios') : await import('./upload-media.native'))

        return _uploadMedia.default(meida, fieldName, up)
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