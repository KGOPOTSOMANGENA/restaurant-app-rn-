import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { db } from "../../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native"; 

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
      const data:any = snap.data();
      setName(data.name || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setPhone(data.phone || "");
      setCard(data.cardNumber || "");
    } else {
      setEmail(user.email || "");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async () => {

    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      address,
      phone,
      cardNumber: card,
      updatedAt: new Date()
    });

    alert("Profile Updated");
  };

  return (

    <ScrollView contentContainerStyle={{ padding:20 }}>

      <Text variant="headlineMedium">My Profile</Text>

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={{ marginTop:10 }}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginTop:10 }}
      />

      <TextInput
        label="Address"
        value={address}
        onChangeText={setAddress}
        style={{ marginTop:10 }}
      />

      <TextInput
        label="Contact Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ marginTop:10 }}
      />

      <TextInput
        label="Card Details"
        value={card}
        onChangeText={setCard}
        style={{ marginTop:10 }}
      />

      <Button
        mode="contained"
        style={{ marginTop:20 }}
        onPress={saveProfile}
      >
        Save Profile
      </Button>

      <Button
        mode="outlined"
        style={{ marginTop:10 }}
        onPress={() => navigation.navigate("Orders")}
      >
        View My Orders
      </Button>

    </ScrollView>
  );
}