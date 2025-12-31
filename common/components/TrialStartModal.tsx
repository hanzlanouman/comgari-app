import React from 'react';
import { Modal, View, Text } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import CustomButton from './CustomButton';

type TrialStartModalProps = {
    visible: boolean;
    onClose: () => void;
};

export const TrialStartModal = ({ visible, onClose }: TrialStartModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 p-4">
                <View
                    className="bg-white rounded-2xl p-6 items-center shadow-xl"
                    style={{ width: "100%", maxWidth: 384 }}
                >
                    <View className="flex items-center mb-4">
                        <CheckCircle size={64} color="#10B981" />
                    </View>

                    <Text className="text-xl font-bold text-center mb-4 text-black">
                        Welcome to Comgari! 🎉
                    </Text>

                    <View className="mb-6" style={{ width: "100%" }}>
                        <Text className="text-center text-base mb-2 text-black">
                            Your <Text className="font-bold">7-day free trial</Text> has started!
                        </Text>
                        <Text className="text-center text-sm text-gray-500 mb-4">
                            Enjoy full access to all features for the next 7 days.
                        </Text>

                        <View className="bg-blue-50 rounded-lg p-3" style={{ width: "100%" }}>
                            <Text className="text-blue-600 font-bold text-sm mb-1">
                                ⚠️ Important Notice
                            </Text>
                            <Text className="text-xs text-gray-700">
                                After your trial ends, your subscription will begin and you'll be charged according to the selected plan.
                            </Text>
                        </View>
                    </View>

                    <View className="" style={{ width: "100%" }}>
                        <CustomButton
                            title="Get Started"
                            onPress={onClose}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
