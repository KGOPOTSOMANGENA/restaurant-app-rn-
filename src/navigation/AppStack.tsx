import React from "react"; 
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/HomeScreen";
import AddToCartScreen from "../screens/Cart/AddToCartScreen";
import CartScreen from "../screens/Cart/CartScreen";
import CheckoutScreen from "../screens/Checkout/CheckoutScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import OrderHistoryScreen from "../screens/Profile/OrderHistoryScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddToCart" component={AddToCartScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Profile"   component={ProfileScreen} />
      <Stack.Screen name="Orders" component={OrderHistoryScreen} />
      </Stack.Navigator>
  );
}