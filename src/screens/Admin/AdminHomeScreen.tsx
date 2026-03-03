import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function AdminHomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium">Admin Dashboard</Text>
      <Text>You are logged in as Admin</Text>
    </View>
  );
}