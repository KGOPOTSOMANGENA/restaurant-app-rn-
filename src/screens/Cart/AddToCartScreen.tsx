import React, { useState, useContext } from "react";
import { View, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, Checkbox } from "react-native-paper";
import { CartContext } from "../../store/CartContext";

export default function AddToCartScreen({ route, navigation }: any) {
  const { item } = route.params;
  const { addToCart } = useContext(CartContext);

  const [qty, setQty] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);

  const increase = () => setQty(qty + 1);
  const decrease = () => { if (qty > 1) setQty(qty - 1); };

  const toggleExtra = (extra: any) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((e) => e.name === extra.name);
      if (exists) return prev.filter((e) => e.name !== extra.name);
      return [...prev, extra];
    });
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const totalPrice = (item.price + extrasTotal) * qty;

  const addItem = () => {
    addToCart(item, qty, selectedExtras);
    navigation.navigate("Cart");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Full width image */}
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>

        {/* Name + description */}
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>

        {/* Extras */}
        {item.extras && item.extras.length > 0 && (
          <View style={styles.extrasBox}>
            <Text style={styles.extrasTitle}>✨ Add Extras</Text>
            {item.extras.map((extra: any, index: number) => {
              const checked = !!selectedExtras.find((e) => e.name === extra.name);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.extraRow, checked && styles.extraRowSelected]}
                  onPress={() => toggleExtra(extra)}
                >
                  <Checkbox
                    status={checked ? "checked" : "unchecked"}
                    onPress={() => toggleExtra(extra)}
                    color="purple"
                  />
                  <Text style={styles.extraName}>{extra.name}</Text>
                  <Text style={styles.extraPrice}>+R {extra.price}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Qty + Price row */}
        <View style={styles.bottomRow}>
          <View style={styles.qtyBox}>
            <TouchableOpacity style={styles.qtyBtn} onPress={decrease}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={increase}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>R {totalPrice}</Text>
        </View>

        {/* Add to cart button */}
        <Button
          mode="contained"
          onPress={addItem}
          style={styles.btn}
          buttonColor="purple"
          contentStyle={{ paddingVertical: 6 }}
        >
          Add To Cart
        </Button>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Image
  image: { width: "100%", height: 260, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },

  // Content
  content: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#1a1a1a" },
  desc: { marginTop: 8, fontSize: 14, color: "#888", lineHeight: 20 },

  // Extras
  extrasBox: {
    marginTop: 20, backgroundColor: "#f9f4ff",
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: "#e8d5ff",
  },
  extrasTitle: { fontWeight: "bold", fontSize: 15, color: "purple", marginBottom: 10 },
  extraRow: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, paddingHorizontal: 8,
    borderRadius: 10, marginBottom: 6,
    backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#eee",
  },
  extraRowSelected: {
    backgroundColor: "#f0e6ff",
    borderColor: "purple",
  },
  extraName: { flex: 1, fontSize: 14, color: "#333", marginLeft: 4 },
  extraPrice: { fontWeight: "bold", color: "purple" },

  // Qty + price
  bottomRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginTop: 20,
  },
  qtyBox: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f5f5f5", borderRadius: 12, padding: 4,
  },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "purple", justifyContent: "center", alignItems: "center",
  },
  qtyBtnText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  qty: { marginHorizontal: 16, fontSize: 18, fontWeight: "bold", color: "#333" },
  price: { fontSize: 24, fontWeight: "bold", color: "purple" },

  // Button
  btn: { marginTop: 20, borderRadius: 10 },
});