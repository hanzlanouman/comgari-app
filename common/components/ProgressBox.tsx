import React from "react";

import { Modal, View, Text, StyleSheet } from "react-native";

import { ms } from "react-native-size-matters";

import { useAppSelector } from "@/hooks/redux";

import { Colors } from "../Colors";
import { ProgressBar } from "./ProgressBar";

export function ProgressBox() {
    const { title, progress, shown, description } = useAppSelector(state => state.progress);
    return (
        <StatelessProgress
            shown={shown}
            title={title}
            progress={progress}
            description={description}
        />
    );
}


export type TProgressBoxProps = {
    title: string,
    progress: number,
    description?: string,
    shown: boolean,
}

export const StatelessProgress = ({ progress, shown, title, description }: TProgressBoxProps) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={shown}
        >
            <View style={styles.centeredView}>
                <View style={styles.modal}>
                    <Text style={styles.heading}>{title}</Text>
                    <ProgressBar
                        progress={progress}
                        style={{
                            width: "100%",
                            marginBottom: ms(10),
                        }}
                    />
                    <Text style={styles.textStyle}>{progress}%</Text>
                    {description && <Text style={styles.textStyle2}>{description}</Text>}
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
        marginBottom: ms(10),
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.dark.shadowColor,
    },
    textStyle2: {
        fontSize: ms(14),
        marginBottom: ms(20),
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.dark.shadowColor,
    },
});
