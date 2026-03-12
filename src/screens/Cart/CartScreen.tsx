import React, { useContext } from "react";
import { View, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { CartContext } from "../../store/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";

export default function CartScreen() {
  const { cart, total } = useContext(CartContext);
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.headerSub}>{cart.length} item{cart.length !== 1 ? "s" : ""}</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                  <Text style={styles.price}>R {item.price} x {item.qty}</Text>
                </View>
                <Text style={styles.subtotal}>R {item.price * item.qty}</Text>
              </View>
            )}
          />

          <Divider style={styles.divider} />

          {/* Total row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>R {total}</Text>
          </View>

          {user ? (
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Checkout")}
              style={styles.btn}
              buttonColor="purple"
              contentStyle={{ paddingVertical: 8 }}
            >
              Proceed to Checkout
            </Button>
          ) : (
            <Button
              mode="contained"
              disabled
              icon="lock"
              style={[styles.btn, { backgroundColor: "#ccc" }]}
              contentStyle={{ paddingVertical: 8 }}
            >
              Login to Checkout
            </Button>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    backgroundColor: "purple",
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  backArrow: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#e0c9f5", fontSize: 13, marginTop: 4 },

  // Empty
  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 80 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: "#aaa", fontSize: 16 },

  // Content
  content: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  // Card
  card: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1, borderColor: "#f0e6ff",
    marginBottom: 4,
  },
  image: { width: 70, height: 70, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontWeight: "bold", fontSize: 15, color: "#1a1a1a" },
  desc: { color: "#aaa", fontSize: 12, marginTop: 2 },
  price: { color: "#888", marginTop: 4, fontSize: 13 },
  subtotal: { fontWeight: "bold", fontSize: 15, color: "purple" },

  // Total
  divider: { backgroundColor: "#f0e6ff", marginVertical: 14 },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#333" },
  totalAmount: { fontSize: 22, fontWeight: "bold", color: "purple" },

  // Button
  btn: { borderRadius: 12 },
});