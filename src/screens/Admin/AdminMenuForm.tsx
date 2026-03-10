import React, { useEffect, useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { Text, TextInput, Button, Chip, Snackbar } from "react-native-paper";
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
      }
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission required to access images.");
      return;
    }

    // ✅ FIX 1: Correct API — no MediaType.Images (this was your crash)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, // We'll compress manually below
    });

    if (!result.canceled) {
      setProcessing(true);
      try {
        // ✅ FIX 2: Resize + compress so base64 stays under Firestore's 1MB limit
        const manipulated = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 400 } }], // shrink to 400px wide
          {
            compress: 0.5,              // 50% quality
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        const base64Img = `data:image/jpeg;base64,${manipulated.base64}`;
        setImg(base64Img);
      } catch (e: any) {
        alert("Failed to process image: " + e.message);
      } finally {
        setProcessing(false);
      }
    }
  };

  const save = async () => {
    if (!name || !price || !categoryId) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);

    const data = {
      name,
      description: desc,
      price: Number(price),
      imageUrl: img,
      categoryId,
      active: true,
      updatedAt: now(),
      ...(editId ? {} : { createdAt: now() }),
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "menuItems", editId), data);
      } else {
        await addDoc(collection(db, "menuItems"), data);
      }

      setSnackbarVisible(true);
      setTimeout(() => nav.goBack(), 1000);
    } catch (e: any) {
      alert("Failed to save item: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="headlineSmall">{editId ? "Edit Item" : "Add New Item"}</Text>

      <TextInput label="Name" value={name} onChangeText={setName} style={{ marginTop: 10 }} />
      <TextInput label="Description" value={desc} onChangeText={setDesc} multiline style={{ marginTop: 10 }} />
      <TextInput label="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={{ marginTop: 10 }} />

      <Text style={{ marginTop: 14 }}>Category</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
        {categories.map((c) => (
          <Chip key={c.id} onPress={() => setCategoryId(c.id)} selected={categoryId === c.id} style={{ marginRight: 6 }}>
            {c.name}
          </Chip>
        ))}
      </View>

      {img && (
        <Image source={{ uri: img }} style={{ width: "100%", height: 200, marginTop: 20, borderRadius: 10 }} />
      )}

      <Button
        mode="outlined"
        onPress={pickImage}
        style={{ marginTop: 10 }}
        loading={processing}
        disabled={saving || processing}
      >
        {processing ? "Processing..." : img ? "Change Image" : "Choose Image"}
      </Button>

      <Button
        mode="contained"
        onPress={save}
        style={{ marginTop: 20 }}
        loading={saving}
        disabled={saving || processing}
      >
        Save
      </Button>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={1000}>
        Item {editId ? "updated" : "added"} successfully!
      </Snackbar>
    </ScrollView>
  );
}