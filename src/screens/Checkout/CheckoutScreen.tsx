import React, { useState, useContext, useEffect } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Divider } from "react-native-paper";
import { CartContext } from "../../store/CartContext";
import { db, auth } from "../../services/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

type Profile = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  cardNumber?: string;
};

// ✅ Format card number with spaces: 4242 4242 4242 4242
const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

// ✅ Format expiry: 12/26
const formatExpiry = (value: string) => {
  const clean = value.replace(/\D/g, "").slice(0, 4);
  if (clean.length >= 3) return clean.slice(0, 2) + "/" + clean.slice(2);
  return clean;
};

export default function CheckoutScreen() {
  const { cart, total, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [placing, setPlacing] = useState(false);
  const user = auth.currentUser;

  // Card fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardError, setCardError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const data = snap.data() as Profile;
      setProfile(data);
      setAddress(data.address || "");
      // Pre-fill card name from profile
      setCardName(`${data.name ?? ""} ${data.surname ?? ""}`.trim());
    }
  };

  const validateCard = () => {
    const rawNumber = cardNumber.replace(/\s/g, "");
    if (!cardName) { setCardError("Please enter the name on card."); return false; }
    if (rawNumber.length !== 16) { setCardError("Card number must be 16 digits."); return false; }
    if (expiry.length !== 5) { setCardError("Please enter a valid expiry date."); return false; }
    if (cvv.length < 3) { setCardError("CVV must be 3 digits."); return false; }
    setCardError("");
    return true;
  };

  const placeOrder = async () => {
    if (!user) { alert("You must login first"); return; }
    if (!address) { alert("Please enter a delivery address"); return; }
    if (!validateCard()) return;

    setPlacing(true);
    try {
      // Mock payment processing delay
      await new Promise((res) => setTimeout(res, 1500));

      await addDoc(collection(db, "orders"), {
        uid: user.uid,
        name: profile?.name ?? "",
        surname: profile?.surname ?? "",
        email: profile?.email ?? user.email ?? "",
        phone: profile?.phone ?? "",
        address,
        items: cart.map((i: any) => ({
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        total,
        paymentMethod: "card",
        cardLast4: cardNumber.replace(/\s/g, "").slice(-4), // save only last 4 digits
        createdAt: new Date(),
      });

      clearCart();
      alert("✅ Payment successful! Your order has been placed.");
    } catch (e: any) {
      alert("Failed to place order: " + e.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Order Items */}
      <Text variant="headlineSmall" style={styles.heading}>Your Order</Text>

      {cart.map((item: any) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.qty}>x{item.qty}</Text>
              <Text style={styles.price}>R {item.price * item.qty}</Text>
            </View>
          </View>
        </View>
      ))}

      <Divider style={{ marginVertical: 16 }} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>R {total}</Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      {/* Delivery */}
      <Text variant="titleMedium" style={styles.sectionTitle}>📍 Delivery Address</Text>
      <TextInput
        label="Delivery Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <Divider style={{ marginVertical: 16 }} />

      {/* Stripe Mock Card Form */}
      <View style={styles.stripeHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>💳 Pay with Card</Text>
        <View style={styles.stripeBadge}>
          <Text style={styles.stripeBadgeText}>Powered by Stripe</Text>
        </View>
      </View>

      <View style={styles.stripeCard}>
        {/* Card number */}
        <TextInput
          label="Card Number"
          value={cardNumber}
          onChangeText={(v) => setCardNumber(formatCardNumber(v))}
          keyboardType="numeric"
          placeholder="4242 4242 4242 4242"
          maxLength={19}
          style={styles.input}
          left={<TextInput.Icon icon="credit-card" />}
        />

        {/* Name on card */}
        <TextInput
          label="Name on Card"
          value={cardName}
          onChangeText={setCardName}
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />

        {/* Expiry + CVV side by side */}
        <View style={styles.row}>
          <TextInput
            label="MM/YY"
            value={expiry}
            onChangeText={(v) => setExpiry(formatExpiry(v))}
            keyboardType="numeric"
            maxLength={5}
            style={[styles.input, styles.halfInput]}
            left={<TextInput.Icon icon="calendar" />}
          />
          <TextInput
            label="CVV"
            value={cvv}
            onChangeText={(v) => setCvv(v.replace(/\D/g, "").slice(0, 3))}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
            style={[styles.input, styles.halfInput]}
            left={<TextInput.Icon icon="lock" />}
          />
        </View>

        {/* Inline error */}
        {cardError ? <Text style={styles.error}>{cardError}</Text> : null}
      </View>

      {/* Place Order Button */}
      <Button
        mode="contained"
        onPress={placeOrder}
        loading={placing}
        disabled={placing}
        style={styles.btn}
        contentStyle={{ paddingVertical: 6 }}
      >
        {placing ? "Processing Payment..." : `Pay R ${total}`}
      </Button>

      <Text style={styles.secureNote}>🔒 Your payment info is secure and encrypted</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { marginBottom: 16, fontWeight: "bold" },
  card: {
    flexDirection: "row", borderWidth: 1, borderColor: "#ddd",
    borderRadius: 12, padding: 10, marginBottom: 12, alignItems: "center",
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "bold" },
  desc: { fontSize: 13, color: "#666", marginTop: 4 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  qty: { color: "#888" },
  price: { fontWeight: "bold" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: "#e74c3c" },
  sectionTitle: { marginBottom: 10, fontWeight: "bold" },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  stripeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  stripeBadge: {
    backgroundColor: "#635bff", borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  stripeBadgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  stripeCard: {
    backgroundColor: "#f9f9f9", borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 10 },
  halfInput: { flex: 1 },
  error: { color: "#e74c3c", marginBottom: 8, fontSize: 13 },
  btn: { borderRadius: 10, backgroundColor: "#635bff" },
  secureNote: { textAlign: "center", color: "#aaa", fontSize: 12, marginTop: 12 },
});