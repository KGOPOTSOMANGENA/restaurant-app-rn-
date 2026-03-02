import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function ChefDetailsScreen({ route }: any) {
  const { name, image, country, rating, specialty, bio } = route.params;

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text>🌍 {country}</Text>
      <Text>⭐ {rating} / 5</Text>
      <Text style={styles.specialty}>{specialty}</Text>
      <Text style={styles.bio}>{bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: 140, height: 140, borderRadius: 70, alignSelf: "center" },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 15, textAlign: "center" },
  specialty: { marginTop: 10, fontWeight: "600" },
  bio: { marginTop: 10, lineHeight: 22 },
});