import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingStack from "./LandingStack";
import AppStack from "./AppStack";
import AdminStack from "./AdminStack"; 
import { useAuthStore } from "../store/authStore";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // BEFORE LOGIN
          <Stack.Screen name="LandingStack" component={LandingStack} />
        ) : user.role === "admin" ? (
          // ADMIN AFTER LOGIN
          <Stack.Screen name="AdminStack" component={AdminStack} />
        ) : (
          // NORMAL USER AFTER LOGIN
          <Stack.Screen name="AppStack" component={AppStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}