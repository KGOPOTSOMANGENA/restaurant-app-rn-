import React, { useEffect, useState } from "react";
import { View, FlatList, Image, ScrollView, StyleSheet } from "react-native";
import { Text, Button, IconButton, Chip } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function AdminMenuList() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("all");

  const load = async () => {
    const menuSnap = await getDocs(collection(db, "menuItems"));
    const catsSnap = await getDocs(collection(db, "categories"));
    setItems(menuSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setCategories(catsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { load(); }, []);

  const filtered = selectedCat === "all" ? items : items.filter((i: any) => i.categoryId === selectedCat);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu Items</Text>
        <Text style={styles.headerSub}>{items.length} items total</Text>
      </View>

      <View style={styles.body}>
        <Button
          mode="contained"
          buttonColor="purple"
          style={styles.addBtn}
          contentStyle={{ paddingVertical: 6 }}
          icon="plus"
          onPress={() => navigation.navigate("Add / Edit Item", { id: null })}
        >
          Add New Item
        </Button>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 12 }}
          contentContainerStyle={{ flexDirection: "row", alignItems: "center" }}
        >
          <Chip
            onPress={() => setSelectedCat("all")}
            selected={selectedCat === "all"}
            style={[styles.chip, selectedCat === "all" && styles.chipSelected]}
            textStyle={selectedCat === "all" ? styles.chipTextSelected : styles.chipText}
            compact
          >
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.id}
              onPress={() => setSelectedCat(c.id)}
              selected={selectedCat === c.id}
              style={[styles.chip, selectedCat === c.id && styles.chipSelected]}
              textStyle={selectedCat === c.id ? styles.chipTextSelected : styles.chipText}
              compact
            >
              {c.name}
            </Chip>
          ))}
        </ScrollView>

        {/* Items list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>R {item.price}</Text>
              </View>
              <IconButton
                icon="pencil"
                iconColor="purple"
                size={20}
                onPress={() => navigation.navigate("Add / Edit Item", { id: item.id })}
              />
              <IconButton
                icon="delete"
                iconColor="#e74c3c"
                size={20}
                onPress={() => deleteDoc(doc(db, "menuItems", item.id)).then(load)}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "purple",
    paddingTop: 55, paddingBottom: 24, paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#e0c9f5", fontSize: 13, marginTop: 4 },
  body: { padding: 16 },
  addBtn: { borderRadius: 10 },
  chip: {
    marginRight: 8, backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#ddd",
  },
  chipSelected: { backgroundColor: "purple", borderColor: "purple" },
  chipText: { color: "#555" },
  chipTextSelected: { color: "#fff" },
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 14,
    padding: 10, marginBottom: 10, elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12 },
  itemName: { fontWeight: "bold", fontSize: 15, color: "#1a1a1a" },
  itemPrice: { color: "purple", fontWeight: "bold", marginTop: 4 },
});