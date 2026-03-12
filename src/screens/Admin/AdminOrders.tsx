import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Chip, ActivityIndicator, Divider } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const parseItems = (raw: any): any[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    })();
  }, []);

  if (loading) return <ActivityIndicator color="purple" style={{ flex: 1, marginTop: 40 }} />;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSub}>{orders.length} order{orders.length !== 1 ? "s" : ""} total</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const items = parseItems(item.items);
          return (
            <View style={styles.card}>

              {/* Customer + total */}
              <View style={styles.row}>
                <Text style={styles.customerName}>{item.name} {item.surname}</Text>
                <Chip compact style={styles.chip} textStyle={styles.chipText}>
                  R {item.total}
                </Chip>
              </View>

              <Text style={styles.meta}>📧 {item.email}</Text>
              <Text style={styles.meta}>📞 {item.phone}</Text>
              <Text style={styles.meta}>📍 {item.address}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.itemsLabel}>Items Ordered</Text>
              {items.map((i: any, idx: number) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>{i.name} x{i.qty}</Text>
                  <Text style={styles.itemPrice}>R {i.price * i.qty}</Text>
                </View>
              ))}

              <Text style={styles.date}>
                🕐 {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : item.createdAt?.seconds
                  ? new Date(item.createdAt.seconds * 1000).toLocaleString()
                  : new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          );
        }}
      />
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
  card: {
    backgroundColor: "#fff", borderRadius: 16,
    padding: 16, marginBottom: 14, elevation: 3,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  customerName: { fontSize: 16, fontWeight: "bold", color: "#1a1a1a" },
  chip: { backgroundColor: "purple" },
  chipText: { color: "#fff", fontWeight: "bold" },
  meta: { color: "#555", fontSize: 13, marginBottom: 2 },
  divider: { backgroundColor: "#f0e6ff", marginVertical: 10 },
  itemsLabel: { fontWeight: "bold", fontSize: 13, color: "purple", marginBottom: 6 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  itemName: { color: "#333" },
  itemPrice: { fontWeight: "bold", color: "purple" },
  date: { color: "#aaa", fontSize: 12, marginTop: 8 },
});