//app\(root)\(tabs)\clients\[id]\media\[type].tsx
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
} from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { Trash2, X, ChevronRight, Upload } from "lucide-react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

type MediaItem = {
  type: 'images' | 'videos' | 'documents';
  uri: string;
  name?: string;
  size?: string;
  duration?: string;
};

const MediaDetailScreen = () => {
    const navigation = useNavigation();

  const { id, type, items } = useLocalSearchParams<{ 
    id: string,
    type: string, 
    items: string 
  }>();
  useEffect(() => {
    navigation.setOptions({
        headerShown: true,
        title: type,
    });
}, [navigation]);
  const parsedItems: MediaItem[] = JSON.parse(items || '[]');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const windowWidth = Dimensions.get("window").width;
  const spacingBetweenImages = 16;
  const sidePadding = 16;
  const imageWidth =
    (windowWidth - sidePadding * 2 - spacingBetweenImages * 2) / 3;

  const player = selectedItem?.type === 'video' 
    ? useVideoPlayer(selectedItem.uri, (player) => {
        player.loop = true;
        player.play();
      }) 
    : null;

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const renderMediaItem = (item: MediaItem, index: number) => {
    switch (item.type) {
      case 'image':
        return (
          <TouchableOpacity
            key={index}
            style={{
              width: imageWidth,
              height: imageWidth,
              marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
              marginBottom: spacingBetweenImages,
            }}
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          >
            <Image
              source={{ uri: item.uri }}
              style={{ width: "100%", height: "100%" }}
              className="rounded-[20px]"
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      
      case 'video':
        return (
          <TouchableOpacity
            key={index}
            style={{
              width: imageWidth,
              height: imageWidth,
              marginRight: index % 3 === 2 ? 0 : spacingBetweenImages,
              marginBottom: spacingBetweenImages,
            }}
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          >
            <Text className="absolute bottom-1 right-2 text-white text-sm font-ManropeSemibold z-[1px]">
              {item.duration}
            </Text>
            <Image
              source={{ uri: item.uri }}  // Thumbnail
              style={{ width: "100%", height: "100%" }}
              className="rounded-[20px]"
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      
      case 'document':
        return (
          <TouchableOpacity
            key={index}
            className="border border-light rounded-xl p-2.5 flex-row items-center justify-between mt-3"
            onPress={handlePresentModalPress}
          >
            <View className="flex-row items-center flex-1">
              <Image 
                source={
                  item.name?.endsWith('.pdf') 
                    ? icons.pdfIcon 
                    : icons.docIcon
                } 
                className="w-9 h-9" 
              />
              <View className="pl-2.5">
                <Text
                  className="text-sm sm:text-base text-dark font-ManropeMedium w-3/5"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <Text className="text-xs text-dark-100 font-ManropeRegular">
                  {item.size}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} className="text-dark" />
          </TouchableOpacity>
        );
    }
  };

  const renderMediaModal = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'image':
        return (
          <Modal 
            animationType="slide" 
            transparent={true} 
            visible={modalVisible}
          >
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
                    onPress={() => setModalVisible(false)}
                    className="bg-black w-8 h-8 rounded-full flex flex-row justify-center items-center pb-px"
                  >
                    <X size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <Image
                    source={{ uri: selectedItem.uri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                </View>
              </SafeAreaView>
            </View>
          </Modal>
        );
      
      case 'video':
        return (
          <Modal 
            animationType="slide" 
            transparent={true} 
            visible={modalVisible}
          >
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
                    onPress={() => setModalVisible(false)}
                    className="bg-black w-8 h-8 rounded-full flex flex-row justify-center items-center pb-px"
                  >
                    <X size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
                <View className="flex-1 flex-col items-center justify-center">
                  {player && (
                    <VideoView
                      className="w-full h-64"
                      player={player}
                      allowsFullscreen
                      allowsPictureInPicture
                    />
                  )}
                </View>
              </SafeAreaView>
            </View>
          </Modal>
        );
    }
  };

  const renderBottomSheet = () => {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={["22%", "22%"]}
        backdropComponent={Backdrop}
        backgroundStyle={{
          borderRadius: 24,
        }}
      >
        <BottomSheetView>
          <View className="p-4 pt-2">
            <TouchableOpacity className="flex-row items-center justify-between border border-light rounded-xl p-2.5">
              <View className="flex-row items-center">
                <LinearGradient
                  colors={["#1B78B9", "#63348F"]}
                  className="rounded-full w-8 h-8"
                  start={[0, 0]}
                  end={[1, 1]}
                >
                  <TouchableOpacity
                    onPress={() => {}}
                    className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px"
                  >
                    <Upload size={16} color="#ffffff" />
                  </TouchableOpacity>
                </LinearGradient>
                <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                  Download
                </Text>
              </View>
              <ChevronRight size={16} color="#1C1C1C" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between border border-light rounded-xl p-2.5 mt-3">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => {}}
                  className="bg-red rounded-full w-8 h-8 flex flex-row justify-center items-center"
                >
                  <Trash2 size={16} color="#ffffff" />
                </TouchableOpacity>
                <Text className="text-sm sm:text-base font-ManropeMedium text-dark ml-2.5">
                  Delete
                </Text>
              </View>
              <ChevronRight size={16} color="#1C1C1C" />
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
            className="px-4"
          >
            <View>
              <Text className="text-sm sm:text-base font-ManropeMedium text-dark">
                {type === 'images' ? 'Images' : 
                 type === 'videos' ? 'Videos' : 
                 'Documents'}
              </Text>
              <View className={type !== 'documents' 
                ? "flex flex-row flex-wrap mt-4" 
                : ""
              }>
                {parsedItems.map(renderMediaItem)}
              </View>
            </View>
          </ScrollView>

          {renderMediaModal()}
          {renderBottomSheet()}
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default MediaDetailScreen;