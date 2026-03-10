import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";


export default function FoodDetailsScreen({ route }: any) {
  const { title, image, description, time, price } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{description}</Text>
      <Text style={styles.info}>🕒 {time}</Text>
      <Text style={styles.info}>💰 R {price}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: "100%", height: 220, borderRadius: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 15 },
  text: { marginTop: 10, fontSize: 16, lineHeight: 22 },
  info: { marginTop: 10, fontWeight: "600" },
});