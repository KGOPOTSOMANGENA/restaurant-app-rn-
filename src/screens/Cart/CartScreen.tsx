import React, { useContext } from "react";
import { View, FlatList, Image, StyleSheet } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { CartContext } from "../../store/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore"; // ✅ same source as RootNavigator

export default function CartScreen() {
  const { cart, total } = useContext(CartContext);
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user); // ✅ correct user state

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>Your Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
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

          <Divider style={{ marginVertical: 12 }} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>R {total}</Text>
          </View>

          {user ? (
            //  Logged in — go to Checkout
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Checkout")}
              style={styles.btn}
              contentStyle={{ paddingVertical: 6 }}
            >
              Checkout
            </Button>
          ) : (
            // Guest — locked, no navigation, no crash
            <Button
              mode="contained"
              disabled
              icon="lock"
              style={[styles.btn, { backgroundColor: "#ccc" }]}
              contentStyle={{ paddingVertical: 6 }}
            >
              Login to Checkout
            </Button>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontWeight: "bold", marginBottom: 16 },
  empty: { color: "#aaa", textAlign: "center", marginTop: 40 },
  row: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#eee",
    borderRadius: 12, padding: 10, marginBottom: 12,
  },
  image: { width: 70, height: 70, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontWeight: "bold", fontSize: 15 },
  desc: { color: "#888", fontSize: 12, marginTop: 2 },
  price: { color: "#555", marginTop: 4 },
  subtotal: { fontWeight: "bold", fontSize: 15 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalAmount: { fontSize: 18, fontWeight: "bold", color: "#e74c3c" },
  btn: { borderRadius: 10, marginTop: 6 },
});