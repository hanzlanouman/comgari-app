import { Platform } from "react-native";

export const isIos = () => {
    return Platform.OS === 'ios';
}

export const isAndroid = () => {
    return Platform.OS === 'android';
}

const MIME_TYPES_MAP = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    ico: "image/x-icon",
    tiff: "image/tiff",
    tif: "image/tiff",
    gif: "image/gif",
    mp4: "video/mp4",
    pdf: "application/pdf",
    txt: "text/plain",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

export const getMimeTypeFromFileName = (fileName: string) => {
    const extension = fileName.split(".").pop();
    return MIME_TYPES_MAP[extension as keyof typeof MIME_TYPES_MAP] || "image/jpeg";
};