import { getImageUrl } from '@/constants';

import React, { useEffect } from 'react';

import {
    Image,
    ImageProps,
    ImageRequireSource,
    ImageSourcePropType
} from 'react-native';

import { images } from '../constants';

interface TAppImageProps extends ImageProps {
    remote?: string | null;
    asset?: ImageRequireSource;
    className?: string | undefined;
    fallback?: ImageRequireSource;
}

export function AppImage({ asset, remote, className, fallback, resizeMode = "cover", ...props }: TAppImageProps & { children?: React.ReactNode }) {
    const [image, setImage] = React.useState<ImageSourcePropType>();

    useEffect(() => {
        if (remote) {
            setImage({ uri: getImageUrl(remote) });
        } else if (asset) {
            setImage(asset);
        } else if (fallback) {
            setImage(fallback);
        } else {
            setImage(images.missingImage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remote, asset]);

    const onError = () => {
        if (fallback)
            setImage(fallback);
        else
            setImage(images.missingImage);
    };
    return (
        <Image
            source={image}
            className={className}
            resizeMode={resizeMode}
            onError={onError}
            {...props}
        />
    );
}
