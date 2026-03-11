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
    return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator /></View>;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>

      <Text variant="headlineMedium" style={{ marginBottom: 15, fontWeight: "bold" }}>
        Menu
      </Text>

      <TextInput
        placeholder="Search food..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
        <Chip selected={selectedCat === "all"} onPress={() => setSelectedCat("all")} style={{ marginRight: 8 }}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip key={c.id} selected={selectedCat === c.id} onPress={() => setSelectedCat(c.id)} style={{ marginRight: 8 }}>
            {c.name}
          </Chip>
        ))}
      </ScrollView>

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
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text variant="titleMedium">{item.name}</Text>
              <Text numberOfLines={2}>{item.description}</Text>
              <Text style={{ fontWeight: "bold" }}>R {item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  search: {
    marginBottom: 15, borderWidth: 1, borderColor: "#ddd",
    borderRadius: 10, paddingHorizontal: 10, height: 40,
  },
  card: {
    flexDirection: "row", padding: 10, marginBottom: 10,
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
  },
  image: { width: 80, height: 80, borderRadius: 10 },
});