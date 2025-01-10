import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { CustomButton, InputField } from "@/common/components";
import { useAuthorization } from "@/context/PermissionContext";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store";
import { Upload, ChevronDown, ChevronUp } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthRepository } from "@/repositories/auth/auth";
import { images, getImageUrl } from "@/constants";
import { ClientRepository } from "@/repositories/client/client";

const Profile = () => {
  const dispatch = useAppDispatch();
  const authRepo = AuthRepository.getInstance();
  const { getPermission } = useAuthorization();
  const clientRepo = ClientRepository.getInstance();

  const [fullName, setFullName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const uploadMedia = async (
    file: ImagePicker.ImagePickerAsset
  ): Promise<string> => {
    try {
      const formData = new FormData();
      const fileToUpload = {
        uri: file.uri,
        type: file.mimeType || "image/jpeg",
        name: file.uri.split("/").pop() || "image.jpg",
      } as any;
      formData.append("files", fileToUpload);
      console.log(file, "File is this");
      const response = await clientRepo.uploadMedia(formData);

      if (response?.data?.length > 0) {
        return response.data[0].filename;
      } else if (Array.isArray(response) && response.length > 0) {
        return response[0].filename;
      }

      throw new Error("No file data received from server");
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleImageUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to access media library is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });
      const imageUrl = await uploadMedia(result.assets?.[0]);
      if (!imageUrl) {
        throw new Error("No image URL returned");
      }

      if (!result.canceled && result.assets?.[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to access image picker.");
    }
  };

  const handleUpdateProfilePic = async () => {
    try {
      if (!avatar) {
        Alert.alert("Error", "Please select an image first.");
        return;
      }

      const payload = { avatar };
      await authRepo.updateProfilePic(payload);
      Alert.alert("Success", "Profile picture updated successfully.");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to update profile picture."
      );
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!fullName) {
        Alert.alert("Error", "Full name is required.");
        return;
      }

      const payload = { full_name: fullName };
      await authRepo.updateProfile(payload);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update profile."
      );
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!oldPassword || !newPassword) {
        Alert.alert("Error", "Both old and new passwords are required.");
        return;
      }

      const payload = { oldpassword: oldPassword, password: newPassword };
      await authRepo.changePassword(payload);
      Alert.alert("Success", "Password changed successfully.");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to change password."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Profile Picture */}
        <View className=" mt-4">
          <View className="items-center text-center">
            <View className="relative w-24 h-24 mb-4">
              <Image
                source={avatar ? { uri: avatar } : images.user}
                resizeMode="cover"
                className="w-full h-full rounded-full"
              />
              <TouchableOpacity
                onPress={handleImageUpload}
                className="absolute bg-blue bottom-0 right-0 bg-blue-500 w-7 h-7 rounded-full items-center justify-center">
                <Upload size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View className="w-34">
              <CustomButton
                title="Update Profile Pic"
                onPress={handleUpdateProfilePic}
              />
            </View>
          </View>
        </View>

        {/* Update Profile Section */}
        <View className="mt-6 border border-light rounded-xl">
          <TouchableOpacity onPress={() => toggleSection("name")}>
            <View className="flex-row items-center justify-between p-4">
              <Text className="text-base font-ManropeSemibold text-dark">
                Change Name
              </Text>
              {expandedSection === "name" ? (
                <ChevronUp size={18} className="text-dark-100" />
              ) : (
                <ChevronDown size={18} className="text-dark-100" />
              )}
            </View>
          </TouchableOpacity>
          {expandedSection === "name" && (
            <View className="border-t border-light p-4">
              <View className="pb-4">
                <InputField
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                />
              </View>
              <CustomButton title="Update Name" onPress={handleUpdateProfile} />
            </View>
          )}
        </View>

        {/* Change Password Section */}
        <View className="mt-6 border border-light rounded-xl">
          <TouchableOpacity onPress={() => toggleSection("password")}>
            <View className="flex-row items-center justify-between p-4">
              <Text className="text-base font-ManropeSemibold text-dark">
                Change Password
              </Text>
              {expandedSection === "password" ? (
                <ChevronUp size={18} className="text-dark-100" />
              ) : (
                <ChevronDown size={18} className="text-dark-100" />
              )}
            </View>
          </TouchableOpacity>
          {expandedSection === "password" && (
            <View className="border-t border-light p-4">
              <View className="pb-4">
                <InputField
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Enter old password"
                  secureTextEntry
                />
              </View>
              <View className="pb-4">
                <InputField
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry
                />
              </View>
              <CustomButton
                title="Change Password"
                onPress={handleChangePassword}
              />
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View className="flex-1 justify-end mb-6">
          <CustomButton
            onPress={() => {
              dispatch(logout());
            }}
            title="Logout"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
