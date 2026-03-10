import React, { useEffect, useState } from "react";
import { View, FlatList, Image, ScrollView } from "react-native";
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

  useEffect(() => {
    load();
  }, []);

  const filtered = selectedCat === "all" ? items : items.filter((i: any) => i.categoryId === selectedCat);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button mode="contained" onPress={() => navigation.navigate("Add / Edit Item", { id: null })}>
        Add Item
      </Button>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ flexDirection: "row", alignItems: "center" }}>
        <Chip onPress={() => setSelectedCat("all")} selected={selectedCat === "all"} style={{ marginRight: 8 }} compact>
          All
        </Chip>

        {categories.map((c) => (
          <Chip key={c.id} onPress={() => setSelectedCat(c.id)} selected={selectedCat === c.id} style={{ marginRight: 8 }} compact>
            {c.name}
          </Chip>
        ))}
      </ScrollView>

      <FlatList
        contentContainerStyle={{ marginTop: 12 }}
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginBottom: 10, alignItems: "center" }}>
            <Image source={{ uri: item.imageUrl }} style={{ width: 70, height: 70, borderRadius: 10 }} />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text variant="titleSmall">{item.name}</Text>
              <Text>R {item.price}</Text>
            </View>

            <IconButton icon="pencil" onPress={() => navigation.navigate("Add / Edit Item", { id: item.id })} />
            <IconButton icon="delete" onPress={() => deleteDoc(doc(db, "menuItems", item.id)).then(load)} />
          </View>
        )}
      />
    </View>
  );
}