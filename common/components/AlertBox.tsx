import React from "react";

import { Modal, View, Text, StyleSheet } from "react-native";

import { ms } from "react-native-size-matters";

import { CustomButton } from "./CustomButton";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import { hideAlert } from "@/store/alert-slice";
import { Colors } from "../Colors";

export function AlertBox() {
    const { title, message, shown } = useAppSelector(state => state.alert);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(hideAlert());
    };

    return (
        <StatelessAlertBox
            shown={shown}
            title={title}
            message={message}
            onClose={handleClose}
        />
    );
}


export type TAlertBoxProps = {
    title: string,
    message: string,
    shown: boolean,
    onClose: () => void
}

export const StatelessAlertBox = ({ message, onClose, shown, title }: TAlertBoxProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={shown}
            onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modal}>
                    <Text style={styles.heading}>{title}</Text>
                    <Text style={styles.textStyle}>{message}</Text>
                    <View>
                        <CustomButton
                            title="Ok"
                            onPress={onClose}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.modalBg,
        backdropFilter: "blur(5px)",
        paddingHorizontal: ms(20),
    },
    modal: {
        width: "80%",
        maxWidth: ms(300),
        backgroundColor: Colors.dark.text,
        borderRadius: ms(10),
        padding: ms(20),
        alignItems: "center",
        shadowColor: Colors.dark.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    heading: {
        color: Colors.dark.shadowColor,
        textAlign: "center",
        marginBottom: ms(20),
        fontWeight: "700",
    },
    textStyle: {
        fontSize: ms(16),
        marginBottom: ms(20),
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.dark.shadowColor,
    },
});
