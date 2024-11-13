import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import { images } from "@/constants";
import { Play, Trash2, X } from "lucide-react-native";

const MediaImages = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenImages = 16;
  const sidePadding = 16;
  const imageWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

  const imageArray = [
    images.user,
    images.user,
    images.user,
    images.user,
    images.user,
    images.user,
  ];

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
                <View
                  key={index}
                  style={{
                    width: imageWidth,
                    height: imageWidth,
                    marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
                    marginBottom: spacingBetweenImages,
                  }}
                  className="relative"
                >
                  <TouchableOpacity
                    className="bg-blue w-6 h-6 rounded-full absolute top-1/2 left-1/2 -transform-1/2 z-[1px] flex-row items-center justify-center"
                    onPress={() => setModalVisible(true)}
                  >
                    <Play size={14} color="#ffffff" />
                  </TouchableOpacity>
                  <Text className="absolute bottom-1 right-2 text-white text-sm font-ManropeSemibold z-[1px]">
                    0.12
                  </Text>
                  <Image
                    source={image}
                    style={{ width: "100%", height: "100%" }}
                    className="rounded-[20px]"
                    resizeMode="cover"
                  />
                </View>
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
                >
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

        {/* Full Image Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View className="bg-white flex-1">
            <SafeAreaView className="flex-1">
              <View className="flex-row items-center justify-between px-4">
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
              <View className="flex-1">
                <Text>dsfsfdf</Text>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MediaImages;
