import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import CategoryItem from "../../components/CategoryItem";
import FoodCard from "../../components/FoodCard";
import ChefCard from "../../components/ChefCard";
import { images } from "../../../assets/images";

export default function LandingPage() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigation.navigate("Menu", { prefillSearch: search });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>Mce's Food & BEV</Text>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate("Menu")}>
            <Text style={styles.menuBtnText}>View Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Image source={images.profile} style={styles.profileImg} />
          </TouchableOpacity>
        </View>
      </View>

      {/* HERO */}
      <ImageBackground
        source={images.header}
        style={styles.hero}
        resizeMode="cover"
        imageStyle={styles.heroImage}
      >
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Choose Your Favorite Food</Text>
          {/* ✅ Search now navigates to MenuScreen with search term */}
          <View style={styles.searchRow}>
            <TextInput
              mode="outlined"
              placeholder="Search food..."
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              style={styles.search}
              outlineColor="transparent"
              activeOutlineColor="purple"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Text style={styles.searchBtnText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* CATEGORIES */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        <CategoryItem label="Burger" image={images.burger} />
        <CategoryItem label="Pizza" image={images.pizza} />
        <CategoryItem label="Drinks" image={images.drink} />
        <CategoryItem label="Dessert" image={images.dessert} />
      </ScrollView>

      {/* POPULAR FOOD */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Popular Food</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FoodCard title="Breakfast Buffet" image={images.breakfast}
            onPress={() => navigation.navigate("FoodDetails", { title: "Breakfast Buffet", image: images.breakfast, description: "Self-service breakfast with eggs, bacon, sausages, cereals, fruits, and hot drinks.", time: "Mon–Sat | 09:00 – 11:00", price: "180" })} />
          <FoodCard title="Burger Combo" image={images.burger}
            onPress={() => navigation.navigate("FoodDetails", { title: "Burger Combo", image: images.burger, description: "Juicy beef burger served with crispy fries and a cold drink.", time: "Daily | 11:00 – 22:00", price: "120" })} />
          <FoodCard title="Pepperoni Pizza" image={images.pizza}
            onPress={() => navigation.navigate("FoodDetails", { title: "Pepperoni Pizza", image: images.pizza, description: "Stone-baked pizza topped with pepperoni and mozzarella cheese.", time: "Daily | 12:00 – 23:00", price: "150" })} />
        </ScrollView>
      </View>

      {/* TOP CHEFS */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Top Chefs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ChefCard name="Chef John" image={images.chef1} onPress={() => navigation.navigate("ChefDetails", { name: "Chef John", image: images.chef1, country: "South Africa", rating: 4.8, specialty: "Breakfast & Grills", bio: "Over 12 years experience creating hearty meals." })} />
          <ChefCard name="Chef Maria" image={images.chef2} onPress={() => navigation.navigate("ChefDetails", { name: "Chef Maria", image: images.chef2, country: "Italy", rating: 4.9, specialty: "Italian Cuisine", bio: "Master of authentic Italian dishes." })} />
          <ChefCard name="Chef Sipho" image={images.chef3} onPress={() => navigation.navigate("ChefDetails", { name: "Chef Sipho", image: images.chef3, country: "South Africa", rating: 4.7, specialty: "African Fusion", bio: "Modern African-inspired cuisine." })} />
          <ChefCard name="Chef Anna" image={images.chef4} onPress={() => navigation.navigate("ChefDetails", { name: "Chef Anna", image: images.chef4, country: "France", rating: 4.9, specialty: "Pastry & Desserts", bio: "Award-winning pastry chef." })} />
          <ChefCard name="Chef Lee" image={images.chef5} onPress={() => navigation.navigate("ChefDetails", { name: "Chef Lee", image: images.chef5, country: "China", rating: 4.6, specialty: "Asian Cuisine", bio: "Expert in traditional Asian flavours." })} />
          <ChefCard name="Chef Carlos" image={images.chef6} onPress={() => navigation.navigate("ChefDetails", { name: "Chef Carlos", image: images.chef6, country: "Mexico", rating: 4.7, specialty: "Mexican Grill", bio: "Bold flavours and grilled specialties." })} />
        </ScrollView>
      </View>

      {/* ✅ KIDS PLAYGROUND BLOG */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Kids Playground 🎠</Text>
        <Text style={styles.blogIntro}>
          Bring the whole family! Our dedicated kids playground makes dining out stress-free.
          While you enjoy your meal, the little ones can play safely in our supervised fun zone.
        </Text>

        {/* Kids images scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <Image source={require("../../../assets/categories/kids1.png")} style={styles.kidsImg} />
          <Image source={require("../../../assets/categories/kids2.png")} style={styles.kidsImg} />
          <Image source={require("../../../assets/categories/kids3.png")} style={styles.kidsImg} />
        </ScrollView>

        {/* Highlights */}
        <View style={styles.kidsHighlights}>
          <View style={styles.kidsHighlightItem}>
            <Text style={styles.kidsHighlightIcon}>🎡</Text>
            <Text style={styles.kidsHighlightText}>Safe & Supervised</Text>
          </View>
          <View style={styles.kidsHighlightItem}>
            <Text style={styles.kidsHighlightIcon}>🎨</Text>
            <Text style={styles.kidsHighlightText}>Fun Activities</Text>
          </View>
          <View style={styles.kidsHighlightItem}>
            <Text style={styles.kidsHighlightIcon}>🍦</Text>
            <Text style={styles.kidsHighlightText}>Kids Menu</Text>
          </View>
        </View>
      </View>

      {/* ✅ OUR LOCATION */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Our Location</Text>
        <View style={styles.locationBox}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text
            style={styles.locationText}
            onPress={() => Linking.openURL("https://www.google.com/maps/search/149+Johnston+Street")}
          >
            149 Johnston Street
          </Text>
        </View>

        {/* ✅ Opening hours */}
        <View style={styles.hoursBox}>
          <Text style={styles.hoursTitle}>🕐 Opening Hours</Text>
          {[
            { day: "Monday", hours: "09:00 – 22:00" },
            { day: "Tuesday", hours: "09:00 – 22:00" },
            { day: "Wednesday", hours: "09:00 – 22:00" },
            { day: "Thursday", hours: "09:00 – 22:00" },
            { day: "Friday", hours: "09:00 – 23:00" },
            { day: "Saturday", hours: "08:00 – 23:00" },
            { day: "Sunday", hours: "08:00 – 21:00" },
          ].map((item) => (
            <View key={item.day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{item.day}</Text>
              <Text style={styles.hoursTime}>{item.hours}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerTitle}>Follow Us On</Text>
        <View style={styles.socials}>
          <View style={styles.socialItem}>
            <IconButton icon="facebook" size={18} iconColor="purple"
              onPress={() => Linking.openURL("https://www.facebook.com")} />
            <Text style={styles.socialLabel}>Facebook</Text>
          </View>
          <View style={styles.socialItem}>
            <IconButton icon="instagram" size={18} iconColor="purple"
              onPress={() => Linking.openURL("https://www.instagram.com")} />
            <Text style={styles.socialLabel}>Instagram</Text>
          </View>
          <View style={styles.socialItem}>
            <IconButton icon="twitter" size={18} iconColor="purple"
              onPress={() => Linking.openURL("https://www.twitter.com")} />
            <Text style={styles.socialLabel}>Twitter</Text>
          </View>
        </View>
        <Text style={styles.popia}>
          We comply with POPIA: Your data is safe with us and will only be used for service improvement.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Top bar
  topBar: {
    paddingHorizontal: 16, paddingTop: 44, paddingBottom: 10,
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", backgroundColor: "purple",
  },
  brandName: { color: "#fff", fontSize: 15, fontWeight: "bold", letterSpacing: 0.3 },
  topBarRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  menuBtn: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 5 },
  menuBtnText: { color: "purple", fontWeight: "bold", fontSize: 12 },
  profileImg: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#fff" },

  // Hero
  hero: { height: 300, justifyContent: "flex-end" },
  heroImage: { borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  heroContent: { padding: 20 },
  heroTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  searchRow: { flexDirection: "row", alignItems: "center", marginTop: 15, gap: 8 },
  search: { flex: 1, backgroundColor: "#ffffffee", borderRadius: 10 },
  searchBtn: {
    backgroundColor: "purple", borderRadius: 10,
    width: 44, height: 44, justifyContent: "center", alignItems: "center",
  },
  searchBtnText: { fontSize: 18 },

  // Categories
  categoryScroll: { marginTop: 20, paddingLeft: 20 },

  // Sections
  section: { padding: 20 },
  sectionTitle: { fontWeight: "bold", marginBottom: 12, color: "#1a1a1a" },

  // Kids playground
  blogIntro: { color: "#555", fontSize: 14, lineHeight: 22 },
  kidsImg: {
    width: 200, height: 140, borderRadius: 14,
    marginRight: 12,
  },
  kidsHighlights: {
    flexDirection: "row", justifyContent: "space-between",
    marginTop: 16,
  },
  kidsHighlightItem: {
    flex: 1, alignItems: "center",
    backgroundColor: "#f9f4ff", borderRadius: 12,
    padding: 12, marginHorizontal: 4,
  },
  kidsHighlightIcon: { fontSize: 24, marginBottom: 6 },
  kidsHighlightText: { color: "purple", fontWeight: "bold", fontSize: 12, textAlign: "center" },

  // Location
  locationBox: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  locationIcon: { fontSize: 16, marginRight: 8 },
  locationText: { color: "purple", fontSize: 14, textDecorationLine: "underline" },

  // Hours
  hoursBox: {
    backgroundColor: "#f9f4ff", borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: "#e8d5ff",
  },
  hoursTitle: { fontWeight: "bold", color: "purple", fontSize: 15, marginBottom: 10 },
  hoursRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 6, borderBottomWidth: 1, borderColor: "#efe6ff",
  },
  hoursDay: { color: "#333", fontSize: 14 },
  hoursTime: { color: "purple", fontWeight: "bold", fontSize: 14 },

  // Footer
  footer: { padding: 20, backgroundColor: "#fff" },
  footerLine: { height: 2, backgroundColor: "purple", marginBottom: 15 },
  footerTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#1a1a1a" },
  socials: { flexDirection: "row", gap: 10, marginBottom: 10 },
  socialItem: { flexDirection: "row", alignItems: "center" },
  socialLabel: { color: "#333", fontSize: 13 },
  popia: { fontSize: 11, color: "#555", lineHeight: 18 },
});