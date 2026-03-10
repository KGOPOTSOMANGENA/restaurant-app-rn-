import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminNavigator from "./AdminNavigator";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminDrawer"
        component={AdminNavigator}
      />
    </Stack.Navigator>
  );
}