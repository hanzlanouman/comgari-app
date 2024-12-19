import React, { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { CustomButton } from '@/common/components'; // Ensure correct import of CustomButton

type ActionModalProps = {
    onUpdate: () => void;
    onDelete: () => void;
};

const ActionModal = forwardRef<BottomSheetModal, ActionModalProps>(
    ({ onUpdate, onDelete }, ref) => {

        // Memoize the custom backdrop to optimize re-renders
        const renderBackdrop = useMemo(
            () => (props) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0} // Shows backdrop when the modal is open
                    disappearsOnIndex={-1} // Hides backdrop when the modal is closed
                    pressBehavior="close" // Closes the modal when backdrop is pressed
                />
            ),
            []
        );

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={["30%"]}
                index={0} 
                backdropComponent={renderBackdrop} 
            >
                <BottomSheetScrollView>
                    <View className="flex-2 p-4">
                        <View className="mb-4">            
                        <CustomButton
                            title="Update"
                            onPress={onUpdate}
                        />
                        </View>
                        <View className="mb-4">
                        <CustomButton
                            title="Delete"
                            onPress={onDelete}

                        />
                        </View>
                    </View >
                </BottomSheetScrollView>
            </BottomSheetModal>
        );
    }
);

export default ActionModal;
