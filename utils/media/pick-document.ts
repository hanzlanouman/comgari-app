
import * as DocumentPicker from "expo-document-picker";

import { TPickerResponse } from '@/utils/media/types';

export type DocumentPickerOptions = Omit<DocumentPicker.DocumentPickerOptions, 'multiple'>

const defaultOptions: DocumentPickerOptions = {
    type: "*/*",
}

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "application/pdf",
    "text/plain",
];

const ALLOWED_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".mp4",
    ".pdf",
    ".txt",
];

export function pickDocument<TMultiple extends boolean>(mutliple: TMultiple, options?: DocumentPickerOptions): Promise<TPickerResponse<TMultiple>>

export async function pickDocument(mutliple: boolean, options?: DocumentPickerOptions): Promise<TPickerResponse<boolean>> {
    try {
        let pickerOptions: DocumentPicker.DocumentPickerOptions = options || defaultOptions
        if (mutliple) {
            pickerOptions.multiple = true
        }
        const result = await DocumentPicker.getDocumentAsync(options);

        const assets = result.assets || []

        if (result.assets && result.assets.length > 0) {
            const validFiles = result.assets.filter((file) => {
                const mimeTypeAllowed = ALLOWED_TYPES.includes(file.mimeType || "");
                const extensionAllowed = ALLOWED_EXTENSIONS.some((ext) => file.name?.toLowerCase().endsWith(ext));
                return mimeTypeAllowed && extensionAllowed;
            });
            assets.push(...validFiles)
        }

        if (result.canceled || assets.length === 0) {

            return {
                isSuccess: false,
                error: "User canceled",
                result: undefined
            }
        }

        if (result.assets.length === 1) {
            return {
                isSuccess: true,
                error: undefined,
                result: formatFile(result.assets[0])
            }
        }

        const files = result.assets.map(file => (formatFile(file)))

        return {
            isSuccess: true,
            error: undefined,
            result: files
        }
    } catch (e: any) {
        return {
            isSuccess: false,
            error: e?.message || "Something went wrong",
            result: undefined
        }
    }
};


const formatFile = (file: DocumentPicker.DocumentPickerAsset) => {
    return {
        uri: file.uri,
        type: file.mimeType || getMimeTypeFromUri(file.uri),
        name: file.name || `example.${getExtentionFromMime(file?.mimeType || '')}`,
    }
}

export const getExtentionFromMime = (mime: string) => {
    return mime.split("/").pop();
};

const getMimeTypeFromUri = (uri: string): string => {
    return uri.split(".").pop() || "image/jpeg";
}