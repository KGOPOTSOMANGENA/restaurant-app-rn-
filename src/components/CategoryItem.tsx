import React from "react";
import { Pressable, Image, Text, ImageSourcePropType, StyleSheet } from "react-native";

interface CategoryItemProps {
  label: string;
  image: ImageSourcePropType;
}

export default function CategoryItem({ label, image }: CategoryItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.active,
      ]}
    >
      <Image source={image} style={styles.image} />
      <Text style={styles.label}>{label}</Text>
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