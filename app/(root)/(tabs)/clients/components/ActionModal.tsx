import React, { forwardRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { CustomButton } from '@/common/components';

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
                    appearsOnIndex={0} 
                    disappearsOnIndex={-1} 
                    pressBehavior="close" 
                />
            ),
            []
        );

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={['30%']}
                index={0}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetScrollView>
                    <View style={styles.container}>
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Edit"
                                onPress={onUpdate}
                                style={styles.button}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Delete"
                                onPress={onDelete}
                                style={[styles.button, styles.deleteButton]}
                            />
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 2,
        padding: 16,
    },
    buttonContainer: {
        marginBottom: 16,
    },
    button: {
        borderRadius: 12,
    },
    deleteButton: {
        backgroundColor: '#FF0000',
    },
});

export default ActionModal;