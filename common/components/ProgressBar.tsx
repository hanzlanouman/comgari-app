import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface ProgressBarProps {
  progress: number; 
  color?: string; 
  height?: number; 
  style?: ViewStyle; 
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = "#2196F3", height = 8, style }) => {
  return (
    <View style={[styles.progressContainer, { height, ...style }]}>
      <View
        style={[
          styles.progressBar,
          { width: `${progress}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    backgroundColor: "#E5E7EB", 
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
});

export { ProgressBar };
