import React, { useContext } from "react";
import { View, FlatList, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { CartContext } from "../../store/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";

export default function CartScreen() {
  const { cart, total, removeItem, clearCart } = useContext(CartContext);
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);

  const handleClearAll = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearCart },
      ]
    );
  };

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      "Remove Item",
      `Remove ${name} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeItem(id) },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Clear all button — only shows when cart has items */}
          {cart.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>🗑 Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.headerSub}>
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <Button
            mode="contained"
            buttonColor="purple"
            style={{ marginTop: 16, borderRadius: 10 }}
            onPress={() => navigation.goBack()}
          >
            Browse Menu
          </Button>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <FlatList
              data={cart}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                    <Text style={styles.price}>R {item.price} x {item.qty}</Text>

                    {/* Show selected extras if any */}
                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                      <Text style={styles.extras}>
                        + {item.selectedExtras.map((e: any) => e.name).join(", ")}
                      </Text>
                    )}
                  </View>

                  <View style={styles.rightCol}>
                    <Text style={styles.subtotal}>R {item.price * item.qty}</Text>

                    {/*  Delete button per item */}
                    <TouchableOpacity
                      onPress={() => handleRemove(item.id, item.name)}
                      style={styles.deleteBtn}
                    >
                      <Text style={styles.deleteBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
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
                icon="cart-check"
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

            {/* Keep shopping button */}
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.keepShoppingBtn}
              textColor="purple"
              contentStyle={{ paddingVertical: 6 }}
              icon="arrow-left"
            >
              Keep Shopping
            </Button>

          </View>
        </ScrollView>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  backBtn: { alignSelf: "flex-start" },
  backArrow: { color: "#fff", fontSize: 26, fontWeight: "bold" },

  // Clear all
  clearBtn: {
    backgroundColor: "#ffffff22",
    borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: "#ffffff44",
  },
  clearBtnText: { color: "#fff", fontSize: 13, fontWeight: "bold" },

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
  extras: { color: "purple", fontSize: 11, marginTop: 2 },

  // Right column — subtotal + delete
  rightCol: { alignItems: "flex-end", gap: 8 },
  subtotal: { fontWeight: "bold", fontSize: 15, color: "purple" },
  deleteBtn: {
    backgroundColor: "#ffe5e5",
    borderRadius: 8, padding: 6,
  },
  deleteBtnText: { color: "#e74c3c", fontWeight: "bold", fontSize: 13 },

  // Total
  divider: { backgroundColor: "#f0e6ff", marginVertical: 14 },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#333" },
  totalAmount: { fontSize: 22, fontWeight: "bold", color: "purple" },

  // Buttons
  btn: { borderRadius: 12, marginBottom: 10 },
  keepShoppingBtn: {
    borderRadius: 12,
    borderColor: "purple", borderWidth: 1.5,
  },
});