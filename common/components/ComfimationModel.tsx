import React from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import CustomButton from './CustomButton'
import { Colors } from '../Colors';
import { ms } from 'react-native-size-matters';

type Props = {
    visible: boolean;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

type TiggerButton = ({ onPress }: { onPress: () => void }) => React.JSX.Element

type WithTriggerProps = Omit<Props, 'visible'> & { Button: string | TiggerButton }

export function ComfimationModelWithTrigger({ Button, message, onCancel, onConfirm }: WithTriggerProps) {
    const [visible, setVisible] = React.useState(false)
    return (
        <>
            {typeof Button === 'string' ? <CustomButton title={Button} onPress={() => setVisible(true)} /> :
                <Button onPress={() => setVisible(true)} />
            }
            <ComfimationModel
                visible={visible}
                message={message}
                onCancel={() => {
                    setVisible(false);
                    if (onCancel) onCancel();
                }}
                onConfirm={() => {
                    setVisible(false);
                    onConfirm();
                }}
            />
        </>
    )
}

export function ComfimationModel({ visible, message, onCancel, onConfirm }: Props) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.centeredView}>
                <View style={styles.modal}>
                    <Text style={styles.heading}>Confirm</Text>
                    <Text style={styles.textStyle}>{message}</Text>
                    <View className="mb-2">
                        <CustomButton onPress={onConfirm} title="Yes" />
                    </View>
                    <View className="mb-2">
                        <CustomButton onPress={onCancel} title="No" />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.modalBg,
    },
    modal: {
        width: "80%",
        maxWidth: ms(300),
        backgroundColor: Colors.dark.text,
        borderRadius: ms(10),
        padding: ms(20),
        // alignItems: "center",
        // justifyContent: "center",
        shadowColor: Colors.dark.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        textAlign: "center",
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
        color: Colors.error.red,
    },
});