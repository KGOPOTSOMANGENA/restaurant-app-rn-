import React from "react";
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>Mce's Food & BEV</Text>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => navigation.navigate("Menu")}
          >
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
          <TextInput
            mode="outlined"
            placeholder="Search food..."
            style={styles.search}
          />
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
          <FoodCard
            title="Breakfast Buffet"
            image={images.breakfast}
            onPress={() => navigation.navigate("FoodDetails", {
              title: "Breakfast Buffet", image: images.breakfast,
              description: "Self-service breakfast with eggs, bacon, sausages, cereals, fruits, and hot drinks.",
              time: "Mon–Sat | 09:00 – 11:00", price: "180",
            })}
          />
          <FoodCard
            title="Burger Combo"
            image={images.burger}
            onPress={() => navigation.navigate("FoodDetails", {
              title: "Burger Combo", image: images.burger,
              description: "Juicy beef burger served with crispy fries and a cold drink.",
              time: "Daily | 11:00 – 22:00", price: "120",
            })}
          />
          <FoodCard
            title="Pepperoni Pizza"
            image={images.pizza}
            onPress={() => navigation.navigate("FoodDetails", {
              title: "Pepperoni Pizza", image: images.pizza,
              description: "Stone-baked pizza topped with pepperoni and mozzarella cheese.",
              time: "Daily | 12:00 – 23:00", price: "150",
            })}
          />
        </ScrollView>
      </View>

      {/* TOP CHEFS */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Top Chefs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ChefCard name="Chef John" image={images.chef1}
            onPress={() => navigation.navigate("ChefDetails", { name: "Chef John", image: images.chef1, country: "South Africa", rating: 4.8, specialty: "Breakfast & Grills", bio: "Over 12 years experience creating hearty meals." })} />
          <ChefCard name="Chef Maria" image={images.chef2}
            onPress={() => navigation.navigate("ChefDetails", { name: "Chef Maria", image: images.chef2, country: "Italy", rating: 4.9, specialty: "Italian Cuisine", bio: "Master of authentic Italian dishes." })} />
          <ChefCard name="Chef Sipho" image={images.chef3}
            onPress={() => navigation.navigate("ChefDetails", { name: "Chef Sipho", image: images.chef3, country: "South Africa", rating: 4.7, specialty: "African Fusion", bio: "Modern African-inspired cuisine." })} />
          <ChefCard name="Chef Anna" image={images.chef4}
            onPress={() => navigation.navigate("ChefDetails", { name: "Chef Anna", image: images.chef4, country: "France", rating: 4.9, specialty: "Pastry & Desserts", bio: "Award-winning pastry chef." })} />
          <ChefCard name="Chef Lee" image={images.chef5}
            onPress={() => navigation.navigate("ChefDetails", { name: "Chef Lee", image: images.chef5, country: "China", rating: 4.6, specialty: "Asian Cuisine", bio: "Expert in traditional Asian flavours." })} />
          <ChefCard name="Chef Carlos" image={images.chef6}
            onPress={() => navigation.navigate("ChefDetails", { name: "Chef Carlos", image: images.chef6, country: "Mexico", rating: 4.7, specialty: "Mexican Grill", bio: "Bold flavours and grilled specialties." })} />
        </ScrollView>
      </View>

      {/* MAP LOCATION */}
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
      </View>

      {/* HELP US IMPROVE */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Help Us Improve</Text>
        <View style={styles.feedbackBox}>
          <TextInput
            placeholder="Your email"
            keyboardType="email-address"
            mode="outlined"
            outlineColor="#ddd"
            activeOutlineColor="purple"
            style={styles.feedbackInput}
          />
          <TextInput
            placeholder="Your message"
            multiline
            numberOfLines={4}
            mode="outlined"
            outlineColor="#ddd"
            activeOutlineColor="purple"
            style={[styles.feedbackInput, { height: 100 }]}
          />
          <Button mode="contained" buttonColor="purple" onPress={() => {}} style={styles.sendBtn}>
            Send Message
          </Button>
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

  // Top bar — compact height
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "purple",
  },
  brandName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  menuBtnText: {
    color: "purple",
    fontWeight: "bold",
    fontSize: 12,
  },
  profileImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#fff",
  },

  // Hero
  hero: { height: 300, justifyContent: "flex-end" },
  heroImage: { borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroContent: { padding: 20 },
  heroTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  search: { marginTop: 15, backgroundColor: "#ffffffee", borderRadius: 10 },

  // Categories
  categoryScroll: { marginTop: 20, paddingLeft: 20 },

  // Sections
  section: { padding: 20 },
  sectionTitle: { fontWeight: "bold", marginBottom: 12, color: "#1a1a1a" },

  // Location
  locationBox: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locationIcon: { fontSize: 16, marginRight: 8 },
  locationText: { color: "purple", fontSize: 14, textDecorationLine: "underline" },

  // Feedback
  feedbackBox: {
    backgroundColor: "#f9f4ff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e8d5ff",
  },
  feedbackInput: { backgroundColor: "#fff", marginBottom: 12 },
  sendBtn: { borderRadius: 10 },

  // Footer
  footer: { padding: 20, backgroundColor: "#fff" },
  footerLine: { height: 2, backgroundColor: "purple", marginBottom: 15 },
  footerTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#1a1a1a" },
  socials: { flexDirection: "row", gap: 10, marginBottom: 10 },
  socialItem: { flexDirection: "row", alignItems: "center" },
  socialLabel: { color: "#333", fontSize: 13 },
  popia: { fontSize: 11, color: "#555", lineHeight: 18 },
});