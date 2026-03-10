import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function AdminHomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Welcome Admin</Text>

      {/* MENU MANAGEMENT */}
      <Card style={styles.card}>
        <Card.Title title="Menu Management" />
        <Card.Content>
          <Text>Add, edit or remove food items</Text>
        </Card.Content>

        <Card.Actions>
          <Button
            mode="contained"
            buttonColor="#6A0DAD"
            onPress={() => navigation.navigate("Menu Items")}
          >
            Manage Menu
          </Button>
        </Card.Actions>
      </Card>

      {/* ORDERS */}
      <Card style={styles.card}>
        <Card.Title title="Orders" />
        <Card.Content>
          <Text>View all customer orders</Text>
        </Card.Content>

        <Card.Actions>
          <Button
            mode="contained"
            buttonColor="#6A0DAD"
            onPress={() => navigation.navigate("Orders")}
          >
            View Orders
          </Button>
        </Card.Actions>
      </Card>

      {/* ANALYTICS */}
      <Card style={styles.card}>
        <Card.Title title="Analytics" />
        <Card.Content>
          <Text>View sales statistics and performance</Text>
        </Card.Content>

        <Card.Actions>
          <Button
            mode="contained"
            buttonColor="#6A0DAD"
            onPress={() => navigation.navigate("Analytics")}
          >
            View Analytics
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    marginBottom: 20,
    color: "gray",
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
  },
});