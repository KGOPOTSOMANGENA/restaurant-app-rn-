import React from "react";
import { Pressable, Image, Text, ImageSourcePropType, StyleSheet } from "react-native";

interface ChefCardProps {
  name: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

export default function ChefCard({ name, image, onPress }: ChefCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.active,
      ]}
    >
      <Image source={image} style={styles.image} />
      <Text style={styles.label}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 25,
    transform: [{ scale: 1 }],
  },
  active: {
    transform: [{ scale: 1.1 }],
  },
  image: { width: 60, height: 60, borderRadius: 30 },
  label: { marginTop: 5 },
});