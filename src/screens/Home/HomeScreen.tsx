import React, { useEffect, useState } from "react";
import { View, FlatList, Image, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { Text, Chip, ActivityIndicator } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { useAuthStore } from "../../store/authStore";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const user = useAuthStore((s) => s.user);

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
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.headerTitle}>What are you craving?</Text>
        </View>

        {/* Profile avatar — functionality unchanged */}
        <TouchableOpacity
          onPress={() => {
            if (!auth.currentUser) navigation.navigate("Login");
            else navigation.navigate("Profile");
          }}
          style={styles.avatarBtn}
        >
          {user?.name ? (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ) : (
            <Image
              source={require("../../../assets/categories/profile_placeholder.png")}
              style={styles.avatarImg}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Search bar */}
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

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={{ paddingHorizontal: 16 }}
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

      {/* Menu items */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.sectionTitle}>
          {selectedCat === "all" ? "All Items" : categories.find(c => c.id === selectedCat)?.name}
          <Text style={styles.sectionCount}> ({filteredItems.length})</Text>
        </Text>

        <FlatList
          data={filteredItems}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("AddToCart", { item })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
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

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    backgroundColor: "purple",
    paddingTop: 55,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { color: "#e0c9f5", fontSize: 14 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 2 },

  // Avatar
  avatarBtn: { padding: 2 },
  avatarCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "#fff", justifyContent: "center", alignItems: "center",
  },
  avatarInitial: { color: "purple", fontWeight: "bold", fontSize: 18 },
  avatarImg: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: "#fff" },

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

  // Chips
  chipScroll: { marginBottom: 16 },
  chip: {
    marginRight: 8, borderRadius: 20,
    backgroundColor: "#fff", borderColor: "#ddd", borderWidth: 1,
  },
  chipSelected: { backgroundColor: "purple", borderColor: "purple" },
  chipText: { color: "#555" },
  chipTextSelected: { color: "#fff" },

  // Section title
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 12 },
  sectionCount: { color: "#aaa", fontWeight: "normal" },

  // Card
  card: {
    flexDirection: "row", backgroundColor: "#fff",
    borderRadius: 14, padding: 10, marginBottom: 12,
    elevation: 2,
  },
  cardImage: { width: 85, height: 85, borderRadius: 12 },
  cardInfo: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  cardName: { fontSize: 15, fontWeight: "bold", color: "#222" },
  cardDesc: { fontSize: 12, color: "#888", marginTop: 4 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  cardPrice: { fontWeight: "bold", color: "purple", fontSize: 15 },
  addBtn: {
    backgroundColor: "purple", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});