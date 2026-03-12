import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import { Text, TextInput, Button, Chip, Snackbar, IconButton, Divider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useRoute, useNavigation } from "@react-navigation/native";
import { db, now } from "../../services/firebase";
import { collection, addDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";

export default function AdminMenuForm() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const editId = route.params?.id;

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [extras, setExtras] = useState<{ name: string; price: string }[]>([]);
  const [extraName, setExtraName] = useState("");
  const [extraPrice, setExtraPrice] = useState("");

  useEffect(() => {
    (async () => {
      const catSnap = await getDocs(collection(db, "categories"));
      setCategories(catSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      if (editId) {
        const snap = await getDoc(doc(db, "menuItems", editId));
        const data: any = snap.data();
        setName(data.name);
        setDesc(data.description);
        setPrice(String(data.price));
        setCategoryId(data.categoryId);
        setImg(data.imageUrl);
        setExtras(data.extras || []);
      }
    })();
  }, []);

  const addExtra = () => {
    if (!extraName || !extraPrice) { alert("Please enter extra name and price."); return; }
    setExtras((prev) => [...prev, { name: extraName, price: extraPrice }]);
    setExtraName("");
    setExtraPrice("");
  };

  const removeExtra = (index: number) => {
    setExtras((prev) => prev.filter((_, i) => i !== index));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { alert("Permission required to access images."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", allowsEditing: true, aspect: [4, 3], quality: 1,
    });
    if (!result.canceled) {
      setProcessing(true);
      try {
        const manipulated = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 400 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        setImg(`data:image/jpeg;base64,${manipulated.base64}`);
      } catch (e: any) {
        alert("Failed to process image: " + e.message);
      } finally {
        setProcessing(false);
      }
    }
  };

  const save = async () => {
    if (!name || !price || !categoryId) { alert("Please fill all required fields."); return; }
    setSaving(true);
    const data = {
      name, description: desc, price: Number(price),
      imageUrl: img, categoryId, active: true, updatedAt: now(),
      extras: extras.map((e) => ({ name: e.name, price: Number(e.price) })),
      ...(editId ? {} : { createdAt: now() }),
    };
    try {
      if (editId) { await updateDoc(doc(db, "menuItems", editId), data); }
      else { await addDoc(collection(db, "menuItems"), data); }
      setSnackbarVisible(true);
      setTimeout(() => nav.goBack(), 1000);
    } catch (e: any) {
      alert("Failed to save item: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{editId ? "Edit Item" : "Add New Item"}</Text>
      </View>

      <View style={styles.body}>

        {/* Basic info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Item Details</Text>

          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            value={name} onChangeText={setName}
            mode="outlined" style={styles.input}
            outlineColor="#ddd" activeOutlineColor="purple"
          />

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            value={desc} onChangeText={setDesc}
            multiline mode="outlined" style={styles.input}
            outlineColor="#ddd" activeOutlineColor="purple"
          />

          <Text style={styles.fieldLabel}>Price (R)</Text>
          <TextInput
            value={price} onChangeText={setPrice}
            keyboardType="numeric" mode="outlined" style={styles.input}
            outlineColor="#ddd" activeOutlineColor="purple"
          />
        </View>

        {/* Category */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
            {categories.map((c) => (
              <Chip
                key={c.id}
                onPress={() => setCategoryId(c.id)}
                selected={categoryId === c.id}
                style={[styles.chip, categoryId === c.id && styles.chipSelected]}
                textStyle={categoryId === c.id ? styles.chipTextSelected : styles.chipText}
              >
                {c.name}
              </Chip>
            ))}
          </View>
        </View>

        {/* Image */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Item Image</Text>
          {img && (
            <Image source={{ uri: img }} style={styles.previewImg} />
          )}
          <Button
            mode="outlined"
            onPress={pickImage}
            loading={processing}
            disabled={saving || processing}
            textColor="purple"
            style={styles.outlineBtn}
            icon="image"
          >
            {processing ? "Processing..." : img ? "Change Image" : "Choose Image"}
          </Button>
        </View>

        {/* Extras */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Extras (optional)</Text>

          {extras.map((e, index) => (
            <View key={index} style={styles.extraItem}>
              <Text style={styles.extraItemText}>• {e.name} — R {e.price}</Text>
              <IconButton icon="delete" iconColor="#e74c3c" size={18} onPress={() => removeExtra(index)} />
            </View>
          ))}

          <View style={styles.extraInputRow}>
            <TextInput
              label="Extra name"
              value={extraName}
              onChangeText={setExtraName}
              mode="outlined"
              style={[styles.input, { flex: 2 }]}
              outlineColor="#ddd"
              activeOutlineColor="purple"
            />
            <TextInput
              label="Price"
              value={extraPrice}
              onChangeText={setExtraPrice}
              keyboardType="numeric"
              mode="outlined"
              style={[styles.input, { flex: 1 }]}
              outlineColor="#ddd"
              activeOutlineColor="purple"
            />
          </View>

          <Button
            mode="outlined"
            onPress={addExtra}
            icon="plus"
            textColor="purple"
            style={styles.outlineBtn}
          >
            Add Extra
          </Button>
        </View>

        {/* Save */}
        <Button
          mode="contained"
          onPress={save}
          loading={saving}
          disabled={saving || processing}
          buttonColor="purple"
          style={styles.saveBtn}
          contentStyle={{ paddingVertical: 8 }}
        >
          {editId ? "Update Item" : "Save Item"}
        </Button>

      </View>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={1000}>
        Item {editId ? "updated" : "added"} successfully!
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "purple",
    paddingTop: 55, paddingBottom: 24, paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  body: { padding: 16 },
  card: {
    backgroundColor: "#fff", borderRadius: 16,
    padding: 16, marginBottom: 16, elevation: 3,
  },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "purple", marginBottom: 10 },
  fieldLabel: { fontSize: 13, color: "#555", marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: "#fff", marginBottom: 4 },
  chip: { marginRight: 6, marginBottom: 6, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
  chipSelected: { backgroundColor: "purple", borderColor: "purple" },
  chipText: { color: "#555" },
  chipTextSelected: { color: "#fff" },
  previewImg: { width: "100%", height: 200, borderRadius: 10, marginBottom: 12 },
  outlineBtn: { borderColor: "purple", borderRadius: 10, marginTop: 4 },
  extraItem: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  extraItemText: { flex: 1, color: "#333" },
  extraInputRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  saveBtn: { borderRadius: 12, marginBottom: 20 },
});