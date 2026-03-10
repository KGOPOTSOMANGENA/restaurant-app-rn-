import React, { useEffect, useState } from "react";
import { View, FlatList, Image, StyleSheet } from "react-native";
import { Text, Card, Chip } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function PublicMenuScreen() {

  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("all");

  const load = async () => {
    const menuSnap = await getDocs(collection(db, "menuItems"));
    const catSnap = await getDocs(collection(db, "categories"));

    setItems(menuSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered =
    selectedCat === "all"
      ? items
      : items.filter(i => i.categoryId === selectedCat);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Our Menu</Text>

      <View style={styles.categoryRow}>
        <Chip
          selected={selectedCat === "all"}
          onPress={() => setSelectedCat("all")}
          style={styles.chip}
        >
          All
        </Chip>

        {categories.map(c => (
          <Chip
            key={c.id}
            selected={selectedCat === c.id}
            onPress={() => setSelectedCat(c.id)}
            style={styles.chip}
          >
            {c.name}
          </Chip>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <Card style={styles.card}>

            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />

            <Card.Content>
              <Text variant="titleMedium">{item.name}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.price}>R {item.price}</Text>
              <Text style={styles.loginText}>
                Login to place an order
              </Text>
            </Card.Content>

          </Card>

        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  chip: {
    marginRight: 6,
    marginBottom: 6,
  },

  card: {
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: 180,
  },

  price: {
    fontWeight: "bold",
    marginTop: 6,
  },

  loginText: {
    color: "purple",
    marginTop: 8,
  },

});