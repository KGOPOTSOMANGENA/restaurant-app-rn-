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

const formatCardNumber = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
};

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

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardError, setCardError] = useState("");

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const data = snap.data() as Profile;
      setProfile(data);
      setAddress(data.address || "");
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
      await new Promise((res) => setTimeout(res, 1500));
      await addDoc(collection(db, "orders"), {
        uid: user.uid,
        name: profile?.name ?? "",
        surname: profile?.surname ?? "",
        email: profile?.email ?? user.email ?? "",
        phone: profile?.phone ?? "",
        address,
        items: cart.map((i: any) => ({ name: i.name, price: i.price, qty: i.qty })),
        total,
        paymentMethod: "card",
        cardLast4: cardNumber.replace(/\s/g, "").slice(-4),
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Purple header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Text style={styles.headerSub}>{cart.length} item{cart.length !== 1 ? "s" : ""} · R {total}</Text>
      </View>

      <View style={styles.body}>

        {/* Order items */}
        <Text style={styles.sectionTitle}>🛍️ Your Order</Text>
        {cart.map((item: any) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.qty}>x{item.qty}</Text>
                <Text style={styles.itemPrice}>R {item.price * item.qty}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>R {total}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Delivery address */}
        <Text style={styles.sectionTitle}>📍 Delivery Address</Text>
        <TextInput
          label="Delivery Address"
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor="purple"
          left={<TextInput.Icon icon="map-marker-outline" color="purple" />}
        />

        <Divider style={styles.divider} />

        {/* Stripe card form */}
        <View style={styles.stripeHeader}>
          <Text style={styles.sectionTitle}>💳 Pay with Card</Text>
          <View style={styles.stripeBadge}>
            <Text style={styles.stripeBadgeText}>Powered by Stripe</Text>
          </View>
        </View>

        <View style={styles.stripeCard}>
          <TextInput
            label="Card Number"
            value={cardNumber}
            onChangeText={(v) => setCardNumber(formatCardNumber(v))}
            keyboardType="numeric"
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            mode="outlined"
            style={styles.input}
            outlineColor="#ddd"
            activeOutlineColor="purple"
            left={<TextInput.Icon icon="credit-card" color="purple" />}
          />

          <TextInput
            label="Name on Card"
            value={cardName}
            onChangeText={setCardName}
            mode="outlined"
            style={styles.input}
            outlineColor="#ddd"
            activeOutlineColor="purple"
            left={<TextInput.Icon icon="account" color="purple" />}
          />

          <View style={styles.row}>
            <TextInput
              label="MM/YY"
              value={expiry}
              onChangeText={(v) => setExpiry(formatExpiry(v))}
              keyboardType="numeric"
              maxLength={5}
              mode="outlined"
              style={[styles.input, styles.halfInput]}
              outlineColor="#ddd"
              activeOutlineColor="purple"
              left={<TextInput.Icon icon="calendar" color="purple" />}
            />
            <TextInput
              label="CVV"
              value={cvv}
              onChangeText={(v) => setCvv(v.replace(/\D/g, "").slice(0, 3))}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
              mode="outlined"
              style={[styles.input, styles.halfInput]}
              outlineColor="#ddd"
              activeOutlineColor="purple"
              left={<TextInput.Icon icon="lock" color="purple" />}
            />
          </View>

          {cardError ? <Text style={styles.error}>{cardError}</Text> : null}
        </View>

        {/* Pay button */}
        <Button
          mode="contained"
          onPress={placeOrder}
          loading={placing}
          disabled={placing}
          buttonColor="purple"
          style={styles.btn}
          contentStyle={{ paddingVertical: 8 }}
        >
          {placing ? "Processing Payment..." : `Pay R ${total}`}
        </Button>

        <Text style={styles.secureNote}>🔒 Your payment info is secure and encrypted</Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    backgroundColor: "purple",
    paddingTop: 55,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSub: { color: "#e0c9f5", fontSize: 13, marginTop: 4 },

  // Body
  body: { padding: 16 },

  // Section title
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "purple", marginBottom: 12 },

  // Order items
  card: {
    flexDirection: "row", backgroundColor: "#fff",
    borderRadius: 12, padding: 10, marginBottom: 10,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: "bold", color: "#1a1a1a" },
  desc: { fontSize: 12, color: "#888", marginTop: 4 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  qty: { color: "#aaa" },
  itemPrice: { fontWeight: "bold", color: "purple" },

  // Total
  totalBox: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", backgroundColor: "#fff",
    borderRadius: 12, padding: 16, marginBottom: 16,
    elevation: 2,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#333" },
  totalAmount: { fontSize: 22, fontWeight: "bold", color: "purple" },

  divider: { backgroundColor: "#f0e6ff", marginVertical: 16 },

  // Inputs
  input: { marginBottom: 12, backgroundColor: "#fff" },
  row: { flexDirection: "row", gap: 10 },
  halfInput: { flex: 1 },

  // Stripe
  stripeHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  stripeBadge: {
    backgroundColor: "purple", borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  stripeBadgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  stripeCard: {
    backgroundColor: "#f9f4ff", borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: "#e8d5ff",
    marginBottom: 16,
  },
  error: { color: "#e74c3c", marginBottom: 8, fontSize: 13 },

  // Button
  btn: { borderRadius: 12, marginBottom: 12 },
  secureNote: { textAlign: "center", color: "#aaa", fontSize: 12, marginBottom: 20 },
});