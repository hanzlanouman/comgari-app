import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';

import { TDownloadResponse } from './types';

import * as Sharing from 'expo-sharing';

import { getMimeTypeFromFileName, isIos } from '../helpers';

const Download = async (url: string): Promise<TDownloadResponse> => {
    try {
        const filename = `${Date.now()}_${url.split('/').pop()}`;
        const fileUri = `${FileSystem.documentDirectory}${filename}`;

        const downloadResult = await FileSystem.downloadAsync(url, fileUri);

        if (downloadResult.status !== 200) {
            throw new Error(`Download failed with status ${downloadResult.status}`);
        }

        // Request Media Library permission
        const { granted } = await MediaLibrary.requestPermissionsAsync();
        if (!granted) {
            return {
                success: false,
                message: 'Permission Denied'
            }
        }

        // Save the file
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        await MediaLibrary.createAlbumAsync('Downloads', asset, false);

        return {
            success: true,
            message: 'File Downloaded Successfully.'
        };
    } catch (error: any) {
        console.error('Error downloading file:', error);
        return {
            success: false,
            message: error?.message || 'Download Failed'
        };
    }
};

const MoveFile = async (uri: string): Promise<TDownloadResponse> => {
    try {
        if (isIos()) {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Save File',
                    UTI: 'com.adobe.pdf'
                });

                return {
                    success: true,
                    message: 'File Downloaded Successfully.'
                };
            }
        }

        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
            return {
                success: false,
                message: 'Permission Denied'
            }
        }
        const filename = `${Date.now()}_${uri.split('/').pop()}`;
        const mimeType = getMimeTypeFromFileName(filename);
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64
        });

        return await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            mimeType
        ).then(async (newUri) => {
            await FileSystem.writeAsStringAsync(newUri, base64, {
                encoding: FileSystem.EncodingType.Base64
            });
            return {
                success: true,
                message: 'File Downloaded Successfully.'
            };
        }).catch(err => {
            return {
                success: false,
                message: err?.message || 'An error occurred while downloading the file. Please try again.',
            };
        });
    } catch (error: any) {
        console.error('Error downloading invoice:', error);
        return {
            success: false,
            message: error?.message || 'Download Failed'
        };
    }
};

export { Download, MoveFile };