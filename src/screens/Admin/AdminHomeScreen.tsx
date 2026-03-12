import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function AdminHomeScreen() {
  const navigation = useNavigation<any>();

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSub}>Welcome back, Admin 👋</Text>
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
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  headerSub: { color: "#e0c9f5", fontSize: 14, marginTop: 4 },
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