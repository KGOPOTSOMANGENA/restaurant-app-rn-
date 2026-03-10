import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, ActivityIndicator, Divider } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

// ✅ same safe parser
const parseItems = (raw: any): any[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
};

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalMenuItems, setTotalMenuItems] = useState(0);
  const [topItems, setTopItems] = useState<{ name: string; qty: number }[]>([]);

  useEffect(() => {
    (async () => {
      const [ordersSnap, menuSnap] = await Promise.all([
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "menuItems")),
      ]);

      const orders = ordersSnap.docs.map((d) => d.data());
      const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

      setTotalOrders(orders.length);
      setTotalRevenue(revenue);
      setTotalMenuItems(menuSnap.size);

      // ✅ safe parse items before looping
      const countMap: Record<string, number> = {};
      orders.forEach((o) => {
        parseItems(o.items).forEach((i: any) => {
          countMap[i.name] = (countMap[i.name] || 0) + (i.qty || 1);
        });
      });

      const sorted = Object.entries(countMap)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

      setTopItems(sorted);
      setLoading(false);
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1, marginTop: 40 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>Analytics</Text>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>R {totalRevenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{totalMenuItems}</Text>
            <Text style={styles.statLabel}>Menu Items</Text>
          </Card.Content>
        </Card>
      </View>

      <Divider style={{ marginVertical: 20 }} />

      <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: "bold" }}>
        🏆 Top Selling Items
      </Text>

      {topItems.length === 0 ? (
        <Text style={{ color: "#aaa" }}>No orders yet</Text>
      ) : (
        topItems.map((item, index) => (
          <View key={item.name} style={styles.topItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>{item.qty} sold</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { marginBottom: 20, fontWeight: "bold" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  statCard: { flex: 1, borderRadius: 12 },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#e74c3c" },
  statLabel: { fontSize: 12, color: "#777", marginTop: 4 },
  topItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" },
  rank: { fontSize: 16, fontWeight: "bold", width: 32, color: "#e74c3c" },
  itemName: { flex: 1, fontSize: 15 },
  itemQty: { color: "#888", fontSize: 13 },
});