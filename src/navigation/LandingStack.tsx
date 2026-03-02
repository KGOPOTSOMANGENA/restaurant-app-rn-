import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from "../screens/LandingPage/LandingPage";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import FoodDetailsScreen from "../screens/FoodDetails/FoodDetailsScreen";
import ChefDetailsScreen from "../screens/ChefDetails/ChefDetailsScreen";

const Stack = createNativeStackNavigator();

export default function LandingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
      <Stack.Screen name="ChefDetails" component={ChefDetailsScreen} />
    </Stack.Navigator>
  );
}