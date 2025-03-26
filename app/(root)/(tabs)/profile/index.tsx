// import React, { useState, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     ScrollView,
// } from "react-native";
// import { AppImage, CustomButton, InputField } from "@/common/components";
// import { useAppDispatch, useAppSelector } from "@/hooks/redux";
// import { logout } from "@/store";
// import { Upload, ChevronDown, ChevronUp, ChevronRight } from "lucide-react-native";
// import { AuthRepository } from "@/repositories/auth/auth";
// import { images } from "@/constants";
// import { IS_ANDROID, pickImage, showErrorAlert, showSuccessAlert, updateUserProperty } from "@/utils";
// import { useUpload } from "@/hooks/use-upload";
// import { useMutation } from "react-query";
// import { TDeleteAcountSchema } from "@/repositories";
// import { useFormik } from "formik";
// import { router } from "expo-router";
// const authRepo = AuthRepository.getInstance();

// const Profile = () => {
//     const dispatch = useAppDispatch();
//     const { user } = useAppSelector(state => state.auth)
//     const { upload } = useUpload()

//     const [fullName, setFullName] = useState("");
//     const [oldPassword, setOldPassword] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [avatar, setAvatar] = useState<string | null>(null);

//     const [expandedSection, setExpandedSection] = useState<string | null>(null);

//     const toggleSection = (section: string) => {
//         setExpandedSection(expandedSection === section ? null : section);
//     };

//     useEffect(() => {
//         if (user?.avatar) {
//             setAvatar(user?.avatar)
//         }
//         //@ts-ignore
//         setFullName(user?.full_name)
//     }, [user])

//     const { mutate: deleteAccount } = useMutation({
//         mutationFn: authRepo.deleteAccount,
//         onError: (error: any) => {
//             showErrorAlert(error?.message || "Failed to delete account");
//         },
//         onSuccess: () => {
//             dispatch(logout());
//         }
//     })

//     const deleteFormik = useFormik({
//         initialValues: {
//             password: "",
//         },
//         onSubmit: async (values: TDeleteAcountSchema) => {
//             deleteAccount(values);
//             showSuccessAlert("Account deleted successfully");
//         },
//     });

//     const updateProfilePic = async () => {
//         try {
//             const { isSuccess, error, result } = await pickImage(false, { quality: 1, aspect: [1, 1] })
//             if (!isSuccess) {
//                 showErrorAlert(error);
//                 return;
//             }
//             upload(result, async (url: string) => {
//                 await authRepo.updateProfilePic({ avatar: url });
//                 updateUserProperty('avatar', url)
//             })
//         } catch (e: any) {
//             showErrorAlert(e?.message)
//         }
//     }

//     const handleUpdateProfile = async () => {
//         try {
//             if (!fullName) {
//                 showErrorAlert("Full name is required.");
//                 return;
//             }

//             const payload = { full_name: fullName };
//             await authRepo.updateProfile(payload);
//             // @ts-ignore
//             updateUserProperty('full_name', fullName)
//             toggleSection("name")
//         } catch (error: any) {
//             showErrorAlert(error?.message)
//         }
//     };

//     const handleChangePassword = async () => {
//         try {
//             if (!oldPassword || !newPassword) {
//                 showErrorAlert("Both old and new passwords are required.");
//                 return;
//             }

//             const payload = { oldpassword: oldPassword, password: newPassword };
//             await authRepo.changePassword(payload);
//             toggleSection("password")
//         } catch (error: any) {
//             showErrorAlert(error?.message)
//         }
//     };

//     return (
//         <SafeAreaView className="flex-1 bg-white">
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
//                 {/* Profile Picture */}
//                 <View className=" mt-4">
//                     <View className="items-center text-center">
//                         <View className="relative w-24 h-24 mb-4 mt-4">
//                             <AppImage
//                                 remote={avatar}
//                                 fallback={images.user}
//                                 className="w-full h-full rounded-full"
//                                 resizeMode="cover"
//                             />
//                             <TouchableOpacity
//                                 onPress={updateProfilePic}
//                                 className="absolute bg-blue bottom-0 right-0 bg-blue-500 w-7 h-7 rounded-full items-center justify-center">
//                                 <Upload size={16} color="#ffffff" />
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>

//                 {IS_ANDROID && <TouchableOpacity onPress={() => router.push('/(root)/(tabs)/profile/plan-details')} className="mt-6 border border-light rounded-xl">
//                     <View className="flex-row items-center justify-between p-4">
//                         <Text className="text-base font-ManropeSemibold text-dark">
//                             Upgarde Plan
//                         </Text>
//                         <ChevronRight size={18} className="text-dark-100" />
//                     </View>
//                 </TouchableOpacity>}

//                 {/* Update Profile Section */}
//                 <View className="mt-6 border border-light rounded-xl">
//                     <TouchableOpacity onPress={() => toggleSection("name")}>
//                         <View className="flex-row items-center justify-between p-4">
//                             <Text className="text-base font-ManropeSemibold text-dark">
//                                 Change Name
//                             </Text>
//                             {expandedSection === "name" ? (
//                                 <ChevronUp size={18} className="text-dark-100" />
//                             ) : (
//                                 <ChevronDown size={18} className="text-dark-100" />
//                             )}
//                         </View>
//                     </TouchableOpacity>
//                     {expandedSection === "name" && (
//                         <View className="border-t border-light p-4">
//                             <View className="pb-4">
//                                 <InputField
//                                     value={fullName}
//                                     onChangeText={setFullName}
//                                     placeholder="Enter your full name"
//                                 />
//                             </View>
//                             <CustomButton title="Update Name" onPress={handleUpdateProfile} />
//                         </View>
//                     )}
//                 </View>

//                 {/* Change Password Section */}
//                 <View className="mt-6 border border-light rounded-xl">
//                     <TouchableOpacity onPress={() => toggleSection("password")}>
//                         <View className="flex-row items-center justify-between p-4">
//                             <Text className="text-base font-ManropeSemibold text-dark">
//                                 Change Password
//                             </Text>
//                             {expandedSection === "password" ? (
//                                 <ChevronUp size={18} className="text-dark-100" />
//                             ) : (
//                                 <ChevronDown size={18} className="text-dark-100" />
//                             )}
//                         </View>
//                     </TouchableOpacity>
//                     {expandedSection === "password" && (
//                         <View className="border-t border-light p-4">
//                             <View className="pb-4">
//                                 <InputField
//                                     value={oldPassword}
//                                     onChangeText={setOldPassword}
//                                     placeholder="Enter old password"
//                                     secureTextEntry
//                                 />
//                             </View>
//                             <View className="pb-4">
//                                 <InputField
//                                     value={newPassword}
//                                     onChangeText={setNewPassword}
//                                     placeholder="Enter new password"
//                                     secureTextEntry
//                                 />
//                             </View>
//                             <CustomButton
//                                 title="Change Password"
//                                 onPress={handleChangePassword}
//                             />
//                         </View>
//                     )}
//                 </View>
//                 {/* Delete Account Section */}
//                 <View className="my-6 border border-light rounded-xl">
//                     <TouchableOpacity onPress={() => toggleSection("detele")}>
//                         <View className="flex-row items-center justify-between p-4">
//                             <Text className="text-base font-ManropeSemibold text-dark">
//                                 Delete Account
//                             </Text>
//                             {expandedSection === "detele" ? (
//                                 <ChevronUp size={18} className="text-dark-100" />
//                             ) : (
//                                 <ChevronDown size={18} className="text-dark-100" />
//                             )}
//                         </View>
//                     </TouchableOpacity>
//                     {expandedSection === "detele" && (
//                         <View className="border-t border-light p-4">
//                             <Text className="text-base font-ManropeBold text-red mt-2">
//                                 Are you sure you want to delete your account?
//                             </Text>
//                             <Text className="text-sm font-ManropeLight text-dark mb-4 mt-1">
//                                 This action cannot be undone. All your data will be permanently
//                                 deleted. All you subscribed to will be canceled. You will not
//                                 be able to recover your account or subscriptions after deletion.
//                             </Text>
//                             <View className="pb-4">
//                                 <InputField
//                                     value={deleteFormik.values.password}
//                                     onChangeText={deleteFormik.handleChange("password")}
//                                     placeholder="Enter password"
//                                     secureTextEntry
//                                     error={
//                                         deleteFormik.touched.password && deleteFormik.errors.password
//                                             ? deleteFormik.errors.password
//                                             : undefined
//                                     }
//                                 />
//                             </View>
//                             <CustomButton
//                                 title="Delete Account"
//                                 onPress={() => deleteFormik.handleSubmit()}
//                             />
//                         </View>
//                     )}
//                 </View>

//                 {/* Logout Button */}
//                 <View className="flex-1 justify-end mb-6">
//                     <CustomButton
//                         onPress={() => {
//                             dispatch(logout());
//                         }}
//                         title="Logout"
//                     />
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { AppImage, CustomButton, InputField } from "@/common/components";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/store";
import { Upload, ChevronDown, ChevronUp, ChevronRight } from "lucide-react-native";
import { AuthRepository } from "@/repositories/auth/auth";
import { images } from "@/constants";
import { IS_ANDROID, pickImage, showErrorAlert, showSuccessAlert, updateUserProperty } from "@/utils";
import { useUpload } from "@/hooks/use-upload";
import { useMutation, useQueryClient } from "react-query";
import { TDeleteAcountSchema } from "@/repositories";
import { useFormik } from "formik";
import { router } from "expo-router";
const authRepo = AuthRepository.getInstance();

const Profile = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth)
    const { upload } = useUpload()

    const queryClient = useQueryClient()

    const [fullName, setFullName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    useEffect(() => {
        if (user?.avatar) {
            setAvatar(user?.avatar)
        }
        //@ts-ignore
        setFullName(user?.full_name)
    }, [user])

    const { mutate: deleteAccount } = useMutation({
        mutationFn: authRepo.deleteAccount,
        onError: (error: any) => {
            showErrorAlert(error?.message || "Failed to delete account");
        },
        onSuccess: () => {
            showSuccessAlert("Account deleted successfully");
            dispatch(logout());
        }
    })

    const deleteFormik = useFormik({
        initialValues: {
            password: "",
        },
        onSubmit: async (values: TDeleteAcountSchema) => {
            deleteAccount(values);
        },
    });

    const updateProfilePic = async () => {
        try {
            const { isSuccess, error, result } = await pickImage(false, { quality: 1, aspect: [1, 1] })
            if (!isSuccess) {
                showErrorAlert(error);
                return;
            }
            upload(result, async (url: string) => {
                await authRepo.updateProfilePic({ avatar: url });
                updateUserProperty('avatar', url)
                queryClient.invalidateQueries({
                    queryKey: ["member"]
                })
            })
        } catch (e: any) {
            showErrorAlert(e?.message)
        }
    }

    const handleUpdateProfile = async () => {
        try {
            if (!fullName) {
                showErrorAlert("Full name is required.");
                return;
            }

            const payload = { full_name: fullName };
            await authRepo.updateProfile(payload);
            // @ts-ignore
            updateUserProperty('full_name', fullName)
            toggleSection("name")
        } catch (error: any) {
            showErrorAlert(error?.message)
        }
    };

    const handleChangePassword = async () => {
        try {
            if (!oldPassword || !newPassword) {
                showErrorAlert("Both old and new passwords are required.");
                return;
            }

            const payload = { oldpassword: oldPassword, password: newPassword };
            await authRepo.changePassword(payload);
            toggleSection("password")
        } catch (error: any) {
            showErrorAlert(error?.message)
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
                {/* Profile Picture */}
                <View className=" mt-4">
                    <View className="items-center text-center">
                        <View className="relative w-24 h-24 mb-4 mt-4">
                            <AppImage
                                remote={avatar}
                                fallback={images.user}
                                className="w-full h-full rounded-full"
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                onPress={updateProfilePic}
                                className="absolute bg-blue bottom-0 right-0 bg-blue-500 w-7 h-7 rounded-full items-center justify-center">
                                <Upload size={16} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {IS_ANDROID && <TouchableOpacity onPress={() => router.push('/(root)/(tabs)/profile/plan-details')} className="mt-6 border border-light rounded-xl">
                    <View className="flex-row items-center justify-between p-4">
                        <Text className="text-base font-ManropeSemibold text-dark">
                            Upgarde Plan
                        </Text>
                        <ChevronRight size={18} className="text-dark-100" />
                    </View>
                </TouchableOpacity>}

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
                {/* Delete Account Section */}
                <View className="my-6 border border-light rounded-xl">
                    <TouchableOpacity onPress={() => toggleSection("detele")}>
                        <View className="flex-row items-center justify-between p-4">
                            <Text className="text-base font-ManropeSemibold text-dark">
                                Delete Account
                            </Text>
                            {expandedSection === "detele" ? (
                                <ChevronUp size={18} className="text-dark-100" />
                            ) : (
                                <ChevronDown size={18} className="text-dark-100" />
                            )}
                        </View>
                    </TouchableOpacity>
                    {expandedSection === "detele" && (
                        <View className="border-t border-light p-4">
                            <Text className="text-base font-ManropeBold text-red mt-2">
                                Are you sure you want to delete your account?
                            </Text>
                            <Text className="text-sm font-ManropeLight text-dark mb-4 mt-1">
                                This action cannot be undone. All your data will be permanently
                                deleted. All you subscribed to will be canceled. You will not
                                be able to recover your account or subscriptions after deletion.
                            </Text>
                            <View className="pb-4">
                                <InputField
                                    value={deleteFormik.values.password}
                                    onChangeText={deleteFormik.handleChange("password")}
                                    placeholder="Enter password"
                                    secureTextEntry
                                    error={
                                        deleteFormik.touched.password && deleteFormik.errors.password
                                            ? deleteFormik.errors.password
                                            : undefined
                                    }
                                />
                            </View>
                            <CustomButton
                                title="Delete Account"
                                onPress={() => deleteFormik.handleSubmit()}
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