/* eslint-disable react/display-name */
import React, { forwardRef, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { CustomButton } from '@/common/components';

type ActionModalProps = {
    onUpdate: () => void;
    onDelete: () => void;
    user: any;
    selectedMember?: any;
};

const ActionModal = forwardRef<BottomSheetModal, ActionModalProps>(
    ({ onUpdate, onDelete, user, selectedMember }, ref) => {
        // Memoize the custom backdrop to optimize re-renders
        const renderBackdrop = useMemo(
            () => (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0} 
                    disappearsOnIndex={-1} 
                    pressBehavior="close" 
                />
            ),
            []
        );

        // Check if user is agency admin or current user
        const isAgencyAdmin = selectedMember?.auth_id === selectedMember?.created_by;
        const isCurrentUser = user?.id === selectedMember?.auth_id;
        const shouldShowButtons = !isAgencyAdmin && !isCurrentUser;

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={['30%']}
                index={0}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetScrollView>
                    <View style={styles.container}>
                        {shouldShowButtons ? (
                            <>
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
                            </>
                        ) : (
                            <View style={styles.messageContainer}>
                                <Text style={styles.messageText}>
                                    {isAgencyAdmin 
                                        ? "Agency owner cannot be modified." 
                                        : "You cannot edit or delete your own account."}
                                </Text>
                            </View>
                        )}
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
    messageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    messageText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        fontWeight: '500',
    },
});

export default ActionModal;