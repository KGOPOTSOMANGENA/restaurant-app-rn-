import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function AdminCategories() {
  const [cats, setCats] = useState<any[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCats(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!name.trim()) return;
    await addDoc(collection(db, "categories"), { name, active: true });
    setName("");
    load();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium">Categories</Text>

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          placeholder="Category name"
          value={name}
          onChangeText={setName}
          style={{ flex: 1 }}
        />
        <Button onPress={save}>Add</Button>
      </View>

      <FlatList
        contentContainerStyle={{ marginTop: 16 }}
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text style={{ flex: 1 }}>{item.name}</Text>
            <IconButton
              icon="delete"
              onPress={() => deleteDoc(doc(db, "categories", item.id)).then(load)}
            />
          </View>
        )}
      />
    </View>
  );
}