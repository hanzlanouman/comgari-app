import ReactNativeBlobUtil, { ReactNativeBlobUtilConfig } from 'react-native-blob-util';

import { PermissionsAndroid } from 'react-native';

import { getMimeTypeFromFileName, isIos } from '../helpers';

import { TDownloadResponse } from './types';

const { config, fs, MediaCollection } = ReactNativeBlobUtil;

async function Download(url: string): Promise<TDownloadResponse> {
    if (isIos()) {
        return downloadImage(url);
    } else {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message:
                        'Comgari needs access to your storage to download Photos, Media, Notes and Proposals.',
                    buttonPositive: 'Allow',
                    buttonNegative: 'Cancel',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return downloadImage(url);
            } else {
                return {
                    success: false,
                    message: 'Storage Permission Not Granted',
                };
            }
        } catch (err: any) {
            console.log(err);
            return {
                success: false,
                message: 'An error occurred while downloading the file. Please try again later.',
            };
        }
    }
}

async function downloadImage(url: string): Promise<TDownloadResponse> {
    const date = new Date();
    const filename = url.split('/').pop() || 'example.jpg';

    const DownloadDir = fs.dirs.DownloadDir;

    const path = DownloadDir + '/' + Math.floor(date.getTime() + date.getSeconds() / 2) + filename;

    const options: ReactNativeBlobUtilConfig = {
        fileCache: true,
        indicator: true,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: path,
            description: 'Downloaded From Comgari',
        },
    };

    return config(options)
        .fetch('GET', url)
        .then(async (res) => {
            await MediaCollection.copyToMediaStore({
                name: filename,
                parentFolder: '',
                mimeType: getMimeTypeFromFileName(filename),
            },
                'Download',
                res.path()
            );
            return {
                success: true,
                message: 'File Downloaded Successfully.',
            };
        }).catch(err => {
            return {
                success: false,
                message: err?.message || 'An error occurred while downloading the file. Please try again.',
            };
        });

}

async function MoveFile(uri: string): Promise<TDownloadResponse> {
    try {
        const filename = `${Date.now()}_${uri.split('/').pop()}`;

        await MediaCollection.copyToMediaStore({
            name: filename,
            parentFolder: '',
            mimeType: getMimeTypeFromFileName(filename),
        },
            'Download',
            uri
        );
        return {
            success: true,
            message: 'File Downloaded Successfully.',
        };
    } catch (error: any) {
        console.error('Error downloading:', error);
        return {
            success: false,
            message: error?.message || 'Download Failed'
        };

    }
}

export { Download, MoveFile };