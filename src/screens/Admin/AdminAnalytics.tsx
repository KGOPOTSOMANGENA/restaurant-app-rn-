import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, ActivityIndicator, Divider } from "react-native-paper";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

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

  if (loading) return <ActivityIndicator color="purple" style={{ flex: 1, marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSub}>Sales overview</Text>
      </View>

      <View style={styles.body}>

        {/* Stat cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statNumber}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statNumber}>R {totalRevenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🍽️</Text>
            <Text style={styles.statNumber}>{totalMenuItems}</Text>
            <Text style={styles.statLabel}>Menu Items</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Top selling */}
        <Text style={styles.sectionTitle}>🏆 Top Selling Items</Text>

        {topItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        ) : (
          topItems.map((item, index) => (
            <View key={item.name} style={styles.topItem}>
              {/* Rank badge */}
              <View style={[
                styles.rankBadge,
                index === 0 && { backgroundColor: "#FFD700" },
                index === 1 && { backgroundColor: "#C0C0C0" },
                index === 2 && { backgroundColor: "#CD7F32" },
              ]}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>

              <Text style={styles.itemName}>{item.name}</Text>

              <View style={styles.soldBadge}>
                <Text style={styles.soldText}>{item.qty} sold</Text>
              </View>
            </View>
          ))
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    backgroundColor: "purple",
    paddingTop: 55, paddingBottom: 30, paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#e0c9f5", fontSize: 13, marginTop: 4 },

  body: { padding: 16 },

  // Stats
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  statCard: {
    flex: 1, backgroundColor: "#fff", borderRadius: 16,
    padding: 14, alignItems: "center", elevation: 3,
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "purple" },
  statLabel: { fontSize: 11, color: "#888", marginTop: 4, textAlign: "center" },

  divider: { backgroundColor: "#f0e6ff", marginVertical: 20 },

  // Top items
  sectionTitle: {
    fontSize: 16, fontWeight: "bold", color: "purple",
    marginBottom: 14,
  },
  emptyBox: { alignItems: "center", marginTop: 20 },
  emptyText: { color: "#aaa", fontSize: 15 },

  topItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 14,
    padding: 14, marginBottom: 10, elevation: 2,
  },
  rankBadge: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "purple",
    justifyContent: "center", alignItems: "center",
    marginRight: 12,
  },
  rankText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  itemName: { flex: 1, fontSize: 15, color: "#1a1a1a", fontWeight: "500" },
  soldBadge: {
    backgroundColor: "#f0e6ff", borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  soldText: { color: "purple", fontWeight: "bold", fontSize: 13 },
});