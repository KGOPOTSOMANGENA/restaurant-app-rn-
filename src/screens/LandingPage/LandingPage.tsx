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

        {/* UPDATED: Menu is now clickable */}
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Text style={styles.menuText}>Menu</Text>
        </TouchableOpacity>

        {/* Profile icon clickable → goes to Login */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Image source={images.profile} style={styles.profileImg} />
        </TouchableOpacity>

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
        <Text variant="titleLarge">Popular Food</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FoodCard
            title="Breakfast Buffet"
            image={images.breakfast}
            onPress={() =>
              navigation.navigate("FoodDetails", {
                title: "Breakfast Buffet",
                image: images.breakfast,
                description:
                  "Self-service breakfast with eggs, bacon, sausages, cereals, fruits, and hot drinks.",
                time: "Mon–Sat | 09:00 – 11:00",
                price: "180",
              })
            }
          />
          <FoodCard
            title="Burger Combo"
            image={images.burger}
            onPress={() =>
              navigation.navigate("FoodDetails", {
                title: "Burger Combo",
                image: images.burger,
                description:
                  "Juicy beef burger served with crispy fries and a cold drink.",
                time: "Daily | 11:00 – 22:00",
                price: "120",
              })
            }
          />
          <FoodCard
            title="Pepperoni Pizza"
            image={images.pizza}
            onPress={() =>
              navigation.navigate("FoodDetails", {
                title: "Pepperoni Pizza",
                image: images.pizza,
                description:
                  "Stone-baked pizza topped with pepperoni and mozzarella cheese.",
                time: "Daily | 12:00 – 23:00",
                price: "150",
              })
            }
          />
        </ScrollView>
      </View>

      {/* TOP CHEFS */}
      <View style={styles.section}>
        <Text variant="titleLarge">Top Chefs</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ChefCard
            name="Chef John"
            image={images.chef1}
            onPress={() =>
              navigation.navigate("ChefDetails", {
                name: "Chef John",
                image: images.chef1,
                country: "South Africa",
                rating: 4.8,
                specialty: "Breakfast & Grills",
                bio: "Over 12 years experience creating hearty meals.",
              })
            }
          />
          <ChefCard
            name="Chef Maria"
            image={images.chef2}
            onPress={() =>
              navigation.navigate("ChefDetails", {
                name: "Chef Maria",
                image: images.chef2,
                country: "Italy",
                rating: 4.9,
                specialty: "Italian Cuisine",
                bio: "Master of authentic Italian dishes.",
              })
            }
          />
          <ChefCard
            name="Chef Sipho"
            image={images.chef3}
            onPress={() =>
              navigation.navigate("ChefDetails", {
                name: "Chef Sipho",
                image: images.chef3,
                country: "South Africa",
                rating: 4.7,
                specialty: "African Fusion",
                bio: "Modern African-inspired cuisine.",
              })
            }
          />
          <ChefCard
            name="Chef Anna"
            image={images.chef4}
            onPress={() =>
              navigation.navigate("ChefDetails", {
                name: "Chef Anna",
                image: images.chef4,
                country: "France",
                rating: 4.9,
                specialty: "Pastry & Desserts",
                bio: "Award-winning pastry chef.",
              })
            }
          />
          <ChefCard
            name="Chef Lee"
            image={images.chef5}
            onPress={() =>
              navigation.navigate("ChefDetails", {
                name: "Chef Lee",
                image: images.chef5,
                country: "China",
                rating: 4.6,
                specialty: "Asian Cuisine",
                bio: "Expert in traditional Asian flavours.",
              })
            }
          />
          <ChefCard
            name="Chef Carlos"
            image={images.chef6}
            onPress={() =>
              navigation.navigate("ChefDetails", {
                name: "Chef Carlos",
                image: images.chef6,
                country: "Mexico",
                rating: 4.7,
                specialty: "Mexican Grill",
                bio: "Bold flavours and grilled specialties.",
              })
            }
          />
        </ScrollView>
      </View>

      {/* MAP LOCATION */}
      <View style={styles.section}>
        <Text variant="titleLarge">Our Location</Text>
        <Text
          style={{ color: "blue", marginTop: 5 }}
          onPress={() =>
            Linking.openURL(
              "https://www.google.com/maps/search/149+Johnston+Street"
            )
          }
        >
          149 Johnston Street
        </Text>
      </View>

      {/* HELP US IMPROVE */}
      <View style={styles.section}>
        <Text variant="titleLarge">Help us to improve</Text>

        <TextInput
          placeholder="Your email"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          placeholder="Your message"
          multiline
          numberOfLines={4}
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        />

        <Button mode="contained" onPress={() => {}}>
          Send Message
        </Button>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerTitle}>Follow Us On</Text>
        <View style={styles.socials}>
          <View style={styles.socialItem}>
            <IconButton
              icon="facebook"
              size={20}
              onPress={() => Linking.openURL("https://www.facebook.com")}
            />
            <Text>Facebook</Text>
          </View>
          <View style={styles.socialItem}>
            <IconButton
              icon="instagram"
              size={20}
              onPress={() => Linking.openURL("https://www.instagram.com")}
            />
            <Text>Instagram</Text>
          </View>
          <View style={styles.socialItem}>
            <IconButton
              icon="twitter"
              size={20}
              onPress={() => Linking.openURL("https://www.twitter.com")}
            />
            <Text>Twitter</Text>
          </View>
        </View>
        <Text style={styles.popia}>
          We comply with POPIA: Your data is safe with us and will only be used
          for service improvement.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: { fontSize: 18, fontWeight: "bold", color: "red" },
  profileImg: { width: 40, height: 40, borderRadius: 20 },
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
  categoryScroll: { marginTop: 20, paddingLeft: 20 },
  section: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    height: 45,
  },
  footer: { padding: 20, backgroundColor: "#fff" },
  footerLine: { height: 2, backgroundColor: "purple", marginBottom: 15 },
  footerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  socials: { flexDirection: "row", gap: 15, marginBottom: 10 },
  socialItem: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  socialLink: { color: "blue", textDecorationLine: "underline" },
  popia: { fontSize: 12, color: "#555" },
});