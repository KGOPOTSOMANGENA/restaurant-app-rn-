import React, { useEffect, useState } from "react";
import { View, FlatList, Image, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Text, Chip, ActivityIndicator } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function MenuScreen() {
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const catSnap = await getDocs(collection(db, "categories"));
    const itemSnap = await getDocs(collection(db, "menuItems"));
    const cats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c: any) => c.active);
    const menu = itemSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((i: any) => i.active);
    setCategories(cats);
    setItems(menu);
    setFilteredItems(menu);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let temp = selectedCat === "all" ? items : items.filter((i) => i.categoryId === selectedCat);
    if (search.trim() !== "") temp = temp.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredItems(temp);
  }, [selectedCat, search, items]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator color="purple" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Purple header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <Text style={styles.headerSub}>What would you like today?</Text>
      </View>

      {/* Search bar floating out of header */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search food..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.body}>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <Chip
            selected={selectedCat === "all"}
            onPress={() => setSelectedCat("all")}
            style={[styles.chip, selectedCat === "all" && styles.chipSelected]}
            textStyle={selectedCat === "all" ? styles.chipTextSelected : styles.chipText}
          >
            All
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c.id}
              selected={selectedCat === c.id}
              onPress={() => setSelectedCat(c.id)}
              style={[styles.chip, selectedCat === c.id && styles.chipSelected]}
              textStyle={selectedCat === c.id ? styles.chipTextSelected : styles.chipText}
            >
              {c.name}
            </Chip>
          ))}
        </ScrollView>

        {/* Item count */}
        <Text style={styles.countText}>
          {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} available
        </Text>

        {/* Menu items */}
        <FlatList
          data={filteredItems}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("AddToCart", { item })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardPrice}>R {item.price}</Text>
                  <View style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+ Add</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    backgroundColor: "purple",
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  headerSub: { color: "#e0c9f5", fontSize: 13, marginTop: 4 },

  // Search
  searchWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", marginHorizontal: 16,
    marginTop: -18, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 4,
    elevation: 4, marginBottom: 16,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 40, fontSize: 14, color: "#333" },

  // Body
  body: { paddingHorizontal: 16 },

  // Chips
  chip: {
    marginRight: 8, backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#ddd", borderRadius: 20,
  },
  chipSelected: { backgroundColor: "purple", borderColor: "purple" },
  chipText: { color: "#555" },
  chipTextSelected: { color: "#fff" },

  // Count
  countText: { color: "#aaa", fontSize: 13, marginBottom: 12 },

  // Card
  card: {
    flexDirection: "row", backgroundColor: "#fff",
    borderRadius: 14, padding: 10, marginBottom: 12, elevation: 2,
  },
  image: { width: 85, height: 85, borderRadius: 12 },
  cardInfo: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  cardName: { fontSize: 15, fontWeight: "bold", color: "#1a1a1a" },
  cardDesc: { fontSize: 12, color: "#888", marginTop: 4 },
  cardBottom: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginTop: 8,
  },
  cardPrice: { fontWeight: "bold", color: "purple", fontSize: 15 },
  addBtn: {
    backgroundColor: "purple", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});