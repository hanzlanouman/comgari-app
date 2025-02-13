import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CustomButton } from "@/common/components";

type InsertLinkModalProps = {
  visible: boolean;
  onClose: () => void;
  onInsert: (url: string, text: string) => void;
  linkURL: string;
  setLinkURL: (url: string) => void;
  linkText: string;
  setLinkText: (text: string) => void;
};

export const InsertLinkModal: React.FC<InsertLinkModalProps> = ({
  visible,
  onClose,
  onInsert,
  linkURL,
  setLinkURL,
  linkText,
  setLinkText,
}) => {
  const handleInsert = () => {
    if (linkURL.trim() && linkText.trim()) {
      onInsert(linkURL, linkText);
    } else {
      alert("Both URL and text are required");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modal}>
          <Text style={styles.heading}>Insert Link</Text>
          <TextInput
            placeholder="URL"
            style={[styles.textInput, { marginBottom: 12 }]}
            value={linkURL}
            onChangeText={setLinkURL}
          />
          <TextInput
            placeholder="Display Text"
            style={styles.textInput}
            value={linkText}
            onChangeText={setLinkText}
          />
          <View style={styles.buttonContainer}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <CustomButton title="Cancel" onPress={onClose} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <CustomButton title="Insert" onPress={handleInsert} />
            </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

