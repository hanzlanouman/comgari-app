import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { images } from "@/constants";
import { Trash2, X } from "lucide-react-native";
import { useVideoPlayer, VideoView } from "expo-video";

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const MediaVideos = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenImages = 16;
  const sidePadding = 16;
  const imageWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

  const imageArray = Array(6).fill(images.user);

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-4 pb-0">
          <View>
            <Text className="text-sm sm:text-base font-ManropeMedium text-dark">
              Yesterday
            </Text>
            <View className="flex flex-row flex-wrap mt-4">
              {imageArray.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: imageWidth,
                    height: imageWidth,
                    marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
                    marginBottom: spacingBetweenImages,
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  <Text className="absolute bottom-1 right-2 text-white text-sm font-ManropeSemibold z-[1px]">
                    0.12
                  </Text>
                  <Image
                    source={image}
                    style={{ width: "100%", height: "100%" }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text className="text-sm sm:text-base font-ManropeMedium text-dark">
              15 Oct 2024
            </Text>
            <View className="flex flex-row flex-wrap mt-4">
              {imageArray.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: imageWidth,
                    height: imageWidth,
                    marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
                    marginBottom: spacingBetweenImages,
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  <Text className="absolute bottom-1 right-2 text-white text-sm font-ManropeSemibold z-[1px]">
                    0.12
                  </Text>
                  <Image
                    source={image}
                    style={{ width: "100%", height: "100%" }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View className="bg-white flex-1">
            <SafeAreaView className="flex-1">
              <View className="flex-row items-center justify-between px-4 pb-4">
                <TouchableOpacity
                  onPress={() => {}}
                  className="bg-red w-8 h-8 rounded-full flex flex-row justify-center items-center pb-px"
                >
                  <Trash2 size={16} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  className="bg-black w-8 h-8 rounded-full flex flex-row justify-center items-center pb-px"
                >
                  <X size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <View className="flex-1 flex-col items-center justify-center">
                <VideoView
                  className="w-full h-64"
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MediaVideos;
