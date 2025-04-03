export type Media = {
    uri: string,
    type: string,
    name: string
}

export type TMediaError = {
    isSuccess: false,
    result: undefined,
    error: string
}

export type MediaArray = Media[]

export type M = Media | MediaArray

export type TUploadMediaSuccess = {
    isSuccess: true,
    error: undefined
}

export type PickerSuccess<T> = {
    isSuccess: true,
    result: T,
    error: undefined
}

export type TPickerResponse<TMultiple extends boolean> =
    (
        TMultiple extends true ?
        PickerSuccess<Media[]> :
        PickerSuccess<Media>
    ) | TMediaError

export type TUploadMediaResponse = TUploadMediaSuccess | Omit<TMediaError, 'result'>


export type TDownloadResponse = {
    success: boolean;
    message: string;
};
