import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Chip, Divider, ActivityIndicator } from "react-native-paper";
import { db } from "../../services/firebase";
import { useAuthStore } from "../../store/authStore";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const parseItems = (raw: any): any[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
};

export default function OrderHistoryScreen() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const loadOrders = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "orders"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  if (loading) return <ActivityIndicator color="purple" style={{ flex: 1, marginTop: 40 }} />;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSub}>
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyText}>You have not placed any orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const items = parseItems(item.items);
            const date = item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleString()
              : item.createdAt?.seconds
              ? new Date(item.createdAt.seconds * 1000).toLocaleString()
              : new Date(item.createdAt).toLocaleString();

            return (
              <View style={styles.card}>

                {/* Top row — date + total */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardLabel}>Order Date</Text>
                    <Text style={styles.date}>🕐 {date}</Text>
                  </View>
                  <Chip compact style={styles.chip} textStyle={styles.chipText}>
                    R {item.total}
                  </Chip>
                </View>

                <Divider style={styles.divider} />

                {/* Items */}
                <Text style={styles.itemsLabel}>Items Ordered</Text>
                {items.map((i: any, idx: number) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemName}>• {i.name} x{i.qty}</Text>
                    <Text style={styles.itemPrice}>R {i.price * i.qty}</Text>
                  </View>
                ))}

                <Divider style={styles.divider} />

                {/* Delivery + Payment */}
                <View style={styles.orderFooter}>
                  <Text style={styles.address}>📍 {item.address}</Text>
                  {item.cardLast4 && (
                    <Text style={styles.card4}>
                      💳 Card ending in {item.cardLast4}
                    </Text>
                  )}
                </View>

              </View>
            );
          }}
        />
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
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  backArrow: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSub: {
    color: "#e0c9f5",
    fontSize: 13,
    marginTop: 4,
  },

  // Empty state
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: "#aaa", fontSize: 16 },

  // Order card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: { color: "#555", fontSize: 13 },
  chip: { backgroundColor: "purple" },
  chipText: { color: "#fff", fontWeight: "bold" },
  divider: { backgroundColor: "#f0e6ff", marginVertical: 10 },

  // Items
  itemsLabel: {
    fontWeight: "bold",
    fontSize: 13,
    color: "purple",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  itemName: { color: "#333", fontSize: 14 },
  itemPrice: { fontWeight: "bold", color: "purple" },

  // Order footer
  orderFooter: { marginTop: 4, gap: 4 },
  address: { color: "#555", fontSize: 13 },
  card4: { color: "#888", fontSize: 12 },
});