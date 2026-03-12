import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function AdminCategories() {
  const [cats, setCats] = useState<any[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCats(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!name.trim()) return;
    await addDoc(collection(db, "categories"), { name, active: true });
    setName("");
    load();
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSub}>{cats.length} categories</Text>
      </View>

      <View style={styles.body}>
        {/* Add category */}
        <View style={styles.addBox}>
          <TextInput
            placeholder="Category name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            outlineColor="#ddd"
            activeOutlineColor="purple"
          />
          <Button
            mode="contained"
            onPress={save}
            buttonColor="purple"
            style={styles.addBtn}
            contentStyle={{ paddingVertical: 6 }}
          >
            Add
          </Button>
        </View>

        {/* List */}
        <FlatList
          data={cats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.catRow}>
              <View style={styles.catDot} />
              <Text style={styles.catName}>{item.name}</Text>
              <IconButton
                icon="delete"
                iconColor="purple"
                size={20}
                onPress={() => deleteDoc(doc(db, "categories", item.id)).then(load)}
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
  addBox: { flexDirection: "row", gap: 10, marginBottom: 16, alignItems: "center" },
  input: { flex: 1, backgroundColor: "#fff" },
  addBtn: { borderRadius: 10 },
  catRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 4,
    marginBottom: 10, elevation: 2,
  },
  catDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: "purple", marginRight: 12,
  },
  catName: { flex: 1, fontSize: 15, color: "#333" },
});