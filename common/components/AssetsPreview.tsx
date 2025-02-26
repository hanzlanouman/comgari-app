import { MediaItem } from "@/app/(root)/(tabs)/clients/[id]/notes/add-note";
import { getImageUrl, images } from "@/constants";
import { Video } from "expo-av";
import { Trash2 } from "lucide-react-native";
import { Text } from "react-native";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";

const windowWidth = Dimensions.get("window").width;
const spacingBetweenImages = 16;
const sidePadding = 16;
const imageWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

const getMediaPreview = (mimeType: string, url: string) => {
    switch (true) {
        case mimeType.includes("pdf"):
            return images.pdf;
        case mimeType.includes("text"):
            return images.doc;
        case mimeType.includes("video"):
            return { uri: url };
        default:
            return { uri: getImageUrl(url) };
    }
};

export const AssetPreview = ({ disabled, index, media, removeMedia }: { disabled: boolean, media: MediaItem, index: number, removeMedia?: () => void }) => {
    const previewSource = getMediaPreview(media.mimeType, media.localUri || media.url);
    const isImage = media.mimeType?.includes("image");
    const isVideo = media.mimeType?.includes("video");
    const isPDFOrText = media.mimeType?.includes("pdf") || media.mimeType?.includes("text");
    const isWorld = media.mimeType?.includes("word");

    return (
        <View
            style={{
                width: imageWidth,
                height: imageWidth,
                marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
                marginBottom: spacingBetweenImages,
            }}
            className="relative">
            {removeMedia && <TouchableOpacity
                className="bg-red flex items-center justify-center w-6 h-6 rounded-full absolute top-2 right-2 z-10"
                onPress={() => removeMedia()}
                disabled={disabled}>
                <Trash2 size={12} color="#ffffff" />
            </TouchableOpacity>}

            {isImage ? (
                <Image
                    source={{ uri: media.localUri }}
                    style={{ width: "100%", height: "100%" }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                />
            ) : isVideo ? (
                <Video
                    source={{ uri: media.localUri }}
                    style={{ width: "100%", height: "100%" }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                    shouldPlay={false}
                />
            ) : isPDFOrText ? (
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f3f3f3",
                        borderRadius: 20,
                    }}
                >
                    <Image
                        source={previewSource}
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-[20px]"
                        resizeMode="contain"
                    />
                </View>
            ) : isWorld ? (
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f3f3f3",
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ color: "#4A4A4A", fontSize: 14, textAlign: "center" }}>
                        World File
                    </Text>
                </View>
            ) : (
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f3f3f3",
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ color: "#4A4A4A", fontSize: 14, textAlign: "center" }}>
                        Unsupported File
                    </Text>
                </View>
            )}
        </View>
    );
};