import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import AdminHomeScreen from "../screens/Admin/AdminHomeScreen";
import AdminMenuList from "../screens/Admin/AdminMenuList";
import AdminMenuForm from "../screens/Admin/AdminMenuForm";
import AdminCategories from "../screens/Admin/AdminCategories";
import AdminOrders from "../screens/Admin/AdminOrders";
import AdminAnalytics from "../screens/Admin/AdminAnalytics";

const Drawer = createDrawerNavigator();

export default function AdminNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">

      <Drawer.Screen
        name="Dashboard"
        component={AdminHomeScreen}
      />

      <Drawer.Screen
        name="Menu Items"
        component={AdminMenuList}
      />

      <Drawer.Screen
        name="Add / Edit Item"
        component={AdminMenuForm}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <Drawer.Screen
        name="Categories"
        component={AdminCategories}
      />

      <Drawer.Screen
        name="Orders"
        component={AdminOrders}
      />

      <Drawer.Screen
        name="Analytics"
        component={AdminAnalytics}
      />

    </Drawer.Navigator>
  );
}