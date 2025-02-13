export const getExtFromUri = (uri: string, def: string = 'pdf'): string => {
    return uri.split(".").pop() || def;
}