import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useAuthStore } from "../../store/authStore";

export default function HomeScreen() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text variant="headlineMedium">Home</Text>
      <Text>Welcome to the Restaurant App</Text>
      <Button mode="contained" onPress={logout} style={{ marginTop: 20 }}>
        Logout
      </Button>
    </View>
  );
}