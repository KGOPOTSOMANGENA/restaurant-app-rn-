import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Chip, ActivityIndicator, Divider } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

// ✅ safely parse items whether stored as string or array
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

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>Orders ({orders.length})</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const items = parseItems(item.items); // ✅ safe parse
          return (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.customerName}>{item.name} {item.surname}</Text>
                <Chip compact style={styles.chip}>R {item.total}</Chip>
              </View>

              <Text style={styles.meta}>📧 {item.email}</Text>
              <Text style={styles.meta}>📞 {item.phone}</Text>
              <Text style={styles.meta}>📍 {item.address}</Text>

              <Divider style={{ marginVertical: 8 }} />

              <Text style={styles.itemsLabel}>Items:</Text>
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
  container: { flex: 1, padding: 16 },
  heading: { marginBottom: 14, fontWeight: "bold" },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 14, marginBottom: 14 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  customerName: { fontSize: 16, fontWeight: "bold" },
  chip: { backgroundColor: "#e8f5e9" },
  meta: { color: "#555", marginTop: 4, fontSize: 13 },
  itemsLabel: { fontWeight: "bold", marginBottom: 4 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemName: { color: "#333" },
  itemPrice: { fontWeight: "bold" },
  date: { color: "#aaa", fontSize: 12, marginTop: 8 },
});