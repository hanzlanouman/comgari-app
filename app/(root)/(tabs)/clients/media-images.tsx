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

const CreateNote = () => {
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View>
            <Text>sdfsfsdfsd</Text>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateNote;
