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

export async function pickAndUploadMedia<TMultiple extends boolean>(mutliple: TMultiple, options?: ImagePickerOptions): Promise<TPickAndUploadMedia<TMultiple>>

export async function pickAndUploadMedia(mutliple: boolean, options?: ImagePickerOptions): Promise<TPickAndUploadMedia<boolean>> {
    const resp = await pickImage(mutliple, options)
    if (!resp.isSuccess) {
        return resp
    }

    return uploadMedia(resp.result)
}

export async function pickAndUploadDocument<TMultiple extends boolean>(mutliple: TMultiple, options?: DocumentPickerOptions): Promise<TPickAndUploadMedia<TMultiple>>

export async function pickAndUploadDocument(mutliple: boolean, options?: DocumentPickerOptions): Promise<TPickAndUploadMedia<boolean>> {
    const resp = await pickDocument(mutliple, options)
    if (!resp.isSuccess) {
        return resp
    }

    return uploadMedia(resp.result)
}

export async function uploadMedia<TMedia extends M>(media: TMedia, fieldName?: string, thr?: boolean): Promise<TUploadMediaResponse<TMedia>>

export async function uploadMedia(meida: M, fieldName?: string, thr = false): Promise<TUploadMediaResponse<M>> {
    try {
        // @ts-ignore
        const _uploadMedia: any = (isRunningInExpoGo() ? await import('./upload-media.axios') : await import('./upload-media.native'))

        return _uploadMedia.default(meida, fieldName, thr)
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