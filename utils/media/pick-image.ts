import * as ImagePicker from 'expo-image-picker';
import { TPickerResponse } from '@/utils/media/types';

export type ImagePickerOptions = Omit<ImagePicker.ImagePickerOptions, 'allowsMultipleSelection'>

const defaultOptions: ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
}

export function pickImage<TMultiple extends boolean>(mutliple: TMultiple, options?: ImagePickerOptions,): Promise<TPickerResponse<TMultiple>>

export async function pickImage(mutliple: boolean, options?: ImagePickerOptions): Promise<TPickerResponse<boolean>> {
    try {
        let pickerOptions: ImagePicker.ImagePickerOptions = options || defaultOptions
        if (mutliple) {
            pickerOptions.allowsMultipleSelection = true
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            ...pickerOptions,
            presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN
        });

        if (result.canceled) {

            return {
                isSuccess: false,
                error: "User canceled",
                result: undefined
            }
        }

        if (result.assets.length === 1 && !mutliple) {
            return {
                isSuccess: true,
                error: undefined,
                result: formatImage(result.assets[0])
            }
        }

        const files = result.assets.map(file => (formatImage(file)))

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

const formatImage = (image: ImagePicker.ImagePickerAsset) => {
    return {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: image.fileName || "image"
    }
}
