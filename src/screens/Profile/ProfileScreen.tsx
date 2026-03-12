import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { db } from "../../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState("");

  const loadProfile = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data: any = snap.data();
      setName(data.name || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setPhone(data.phone || "");
      setCard(data.cardNumber || "");
    } else {
      setEmail(user.email || "");
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const saveProfile = async () => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      address,
      phone,
      cardNumber: card,
      updatedAt: new Date(),
    });
    alert("Profile Updated");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {name ? name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>
        <Text style={styles.avatarName}>{name || "Your Name"}</Text>
        <Text style={styles.avatarEmail}>{email || "your@email.com"}</Text>
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Text style={styles.fieldLabel}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor="purple"
          left={<TextInput.Icon icon="account-outline" color="purple" />}
        />

        <Text style={styles.fieldLabel}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor="purple"
          left={<TextInput.Icon icon="email-outline" color="purple" />}
        />

        <Text style={styles.fieldLabel}>Delivery Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor="purple"
          left={<TextInput.Icon icon="map-marker-outline" color="purple" />}
        />

        <Text style={styles.fieldLabel}>Phone Number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor="purple"
          left={<TextInput.Icon icon="phone-outline" color="purple" />}
        />

        <Text style={styles.fieldLabel}>Card Details</Text>
        <TextInput
          value={card}
          onChangeText={setCard}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor="purple"
          left={<TextInput.Icon icon="credit-card-outline" color="purple" />}
        />
      </View>

      {/* Buttons */}
      <Button
        mode="contained"
        onPress={saveProfile}
        style={styles.saveBtn}
        contentStyle={{ paddingVertical: 6 }}
        buttonColor="purple"
      >
        Save Profile
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Orders")}
        style={styles.ordersBtn}
        contentStyle={{ paddingVertical: 6 }}
        textColor="purple"
      >
        View My Orders
      </Button>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    backgroundColor: "purple",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 70,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  // Avatar
  avatarSection: {
    alignItems: "center",
    marginTop: -50,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "purple",
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  avatarInitial: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  avatarName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  avatarEmail: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "purple",
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    fontSize: 14,
  },

  // Buttons
  saveBtn: {
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  ordersBtn: {
    marginHorizontal: 16,
    borderRadius: 10,
    borderColor: "purple",
  },
});