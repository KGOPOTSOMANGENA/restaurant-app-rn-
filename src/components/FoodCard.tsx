import React from "react";
import { Pressable, Image, Text, ImageSourcePropType, StyleSheet } from "react-native";

interface FoodCardProps {
  title: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

export default function FoodCard({ title, image, onPress }: FoodCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.active,
      ]}
    >
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    marginRight: 15,
    borderRadius: 15,
    padding: 10,
    elevation: 3,
    transform: [{ scale: 1 }],
  },
  active: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.3,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontWeight: "600",
  },
});