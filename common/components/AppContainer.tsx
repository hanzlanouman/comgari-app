/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";

import {
  Modal,
  View,
  StyleProp,
  ViewStyle,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { ms } from "react-native-size-matters";

import  { CustomButton } from "@/common/components/CustomButton";

import { Colors } from "@/common/Colors";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { SimpleActivityIndicator } from "@/common/components/Loader";

type Props = {
  children: React.ReactNode;
  isError?: boolean;
  isSuccess?: boolean;
  isConfirm?: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  confirmationMessage?: string;
  onPress?: () => void;
  onConfirm?: () => void;
  hasScroll?: boolean;
};

enum TITLE_TYPE {
  ERROR = "Error",
  SUCCESS = "Success",
}

export const AppContainer = (props: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [title, setTitle] = useState(props.title || "");

  useEffect(() => {
    if (props.isError) {
      setTitle(TITLE_TYPE.ERROR);
      setModalVisible(true);
    } else if (props.isSuccess) {
      setTitle(TITLE_TYPE.SUCCESS);
      setModalVisible(true);
    } else if (props.isConfirm) {
      setShowConfirmation(true);
    }
  }, [props.isError, props.isSuccess, props.isConfirm]);

  const handleClose = () => {
    setModalVisible(false);
    if (props.onPress) {
      props.onPress();
    }
  };

  const handleConfirm = () => {
    if (props.onConfirm) {
      props.onConfirm();
    }
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const hasScroll = props?.hasScroll ? true : false;

  return (
    <KeyboardAwareScrollView className="bg-white w-screen h-screen">
      {props?.loading && <SimpleActivityIndicator />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && !showConfirmation}
        onRequestClose={handleClose}>
        <View style={styles.centeredView}>
          <View style={styles.modal}>
            <Text style={styles.heading}>{title}</Text>
            <Text style={styles.textStyle}>{props.message}</Text>

            <CustomButton onPress={handleClose} title="Ok" />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={handleCancel}>
        <View style={styles.centeredView}>
          <View style={styles.modal}>
            <Text style={styles.heading}>Confirm</Text>
            <Text style={styles.textStyle}>{props.confirmationMessage}</Text>
            <View className="mb-2">
              <CustomButton onPress={handleConfirm} title="Yes" />
            </View>
            <View className="mb-2">
              <CustomButton onPress={handleCancel} title="No" />
            </View>

          </View>
        </View>
      </Modal>
      {hasScroll ? (
        <ScrollView
          className="bg-white w-screen h-screen"
          contentContainerStyle={props?.style}>
          {props.children}
        </ScrollView>
      ) : (
        props.children
      )}
    </KeyboardAwareScrollView>
  );
};

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

export default AppContainer;
