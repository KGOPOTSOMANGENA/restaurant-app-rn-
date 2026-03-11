import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from "../screens/LandingPage/LandingPage";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import FoodDetailsScreen from "../screens/FoodDetails/FoodDetailsScreen";
import ChefDetailsScreen from "../screens/ChefDetails/ChefDetailsScreen";
import MenuScreen from "../screens/Menu/MenuScreen";
import AddToCartScreen from "../screens/Cart/AddToCartScreen";
import CartScreen from "../screens/Cart/CartScreen";

const Stack = createNativeStackNavigator();

export default function LandingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
      <Stack.Screen name="ChefDetails" component={ChefDetailsScreen} />

      {/* Guest can browse menu, add to cart, but gets blocked at checkout */}
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="AddToCart" component={AddToCartScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}