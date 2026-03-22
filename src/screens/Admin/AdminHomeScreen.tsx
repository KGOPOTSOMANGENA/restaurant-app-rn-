import React from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";

export default function AdminHomeScreen() {
  const navigation = useNavigation<any>();
  const logout = useAuthStore((s) => s.logout);

  const cards = [
    {
      icon: "🍽️",
      title: "Menu Management",
      desc: "Add, edit or remove food items",
      btn: "Manage Menu",
      route: "Menu Items",
    },
    {
      icon: "📦",
      title: "Orders",
      desc: "View all customer orders",
      btn: "View Orders",
      route: "Orders",
    },
    {
      icon: "📊",
      title: "Analytics",
      desc: "View sales statistics and performance",
      btn: "View Analytics",
      route: "Analytics",
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "Landing" }],
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSub}>Welcome back, Admin 👋</Text>
          </View>

          {/* Logout button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>⏻</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        {cards.map((c) => (
          <View key={c.route} style={styles.card}>
            <Text style={styles.cardIcon}>{c.icon}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardDesc}>{c.desc}</Text>
            </View>
            <Button
              mode="contained"
              buttonColor="purple"
              style={styles.cardBtn}
              onPress={() => navigation.navigate(c.route)}
              contentStyle={{ paddingVertical: 2 }}
            >
              {c.btn}
            </Button>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: "purple",
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  headerSub: { color: "#e0c9f5", fontSize: 14, marginTop: 4 },

  // Logout button
  logoutBtn: {
    backgroundColor: "#ffffff22",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffffff44",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  logoutIcon: { fontSize: 16, color: "#fff" },
  logoutText: { color: "#fff", fontSize: 11, fontWeight: "bold", marginTop: 2 },

  body: { padding: 16 },
  card: {
    backgroundColor: "#fff", borderRadius: 16,
    padding: 16, marginBottom: 16, elevation: 3,
  },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardContent: { marginBottom: 14 },
  cardTitle: { fontSize: 17, fontWeight: "bold", color: "#1a1a1a" },
  cardDesc: { color: "#888", marginTop: 4, fontSize: 13 },
  cardBtn: { borderRadius: 10, alignSelf: "flex-start" },
});