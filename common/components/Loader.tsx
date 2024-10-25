/* eslint-disable prettier/prettier */
import React from "react";

import { Colors } from "@/common/Colors";

import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export function SimpleActivityIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.text}>Loading</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.dark.modalBg,
  },
  text: {
    color: Colors.light.text,
  },
});
