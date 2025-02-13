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

export type TUploadMediaSuccess<T> = {
    isSuccess: true,
    result: T,
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

export type TUploadMediaResponse<TMedia extends M> =
    (
        TMedia extends MediaArray ?
        TUploadMediaSuccess<string[]>
        :
        TUploadMediaSuccess<string>
    )
    | TMediaError