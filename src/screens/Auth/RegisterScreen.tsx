import React from "react";
import { Alert, ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "../../store/authStore";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";

type FormValues = {
  name: string;
  surname: string;
  phone: string;
  address: string;
  card: string;
  email: string;
  password: string;
};

const fields: (keyof FormValues)[] = [
  "name", "surname", "phone", "address", "card", "email", "password",
];

const fieldIcons: Record<keyof FormValues, string> = {
  name: "account-outline",
  surname: "account-outline",
  phone: "phone-outline",
  address: "map-marker-outline",
  card: "credit-card-outline",
  email: "email-outline",
  password: "lock-outline",
};

const fieldLabels: Record<keyof FormValues, string> = {
  name: "First Name",
  surname: "Surname",
  phone: "Phone Number",
  address: "Delivery Address",
  card: "Card Number (optional)",
  email: "Email Address",
  password: "Password",
};

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { register: registerUser, loading } = useAuthStore();

  const {
    control, handleSubmit,
    formState: { errors },
    getValues, reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "", surname: "", phone: "",
      address: "", card: "", email: "", password: "",
    },
    mode: "onBlur",
  });

  const rulesByField: Partial<Record<keyof FormValues, any>> = {
    name: { required: "Name is required", minLength: { value: 2, message: "At least 2 characters" } },
    surname: { required: "Surname is required", minLength: { value: 2, message: "At least 2 characters" } },
    phone: { required: "Phone is required", pattern: { value: /^[0-9+\-() ]{7,}$/, message: "Enter a valid phone number" } },
    address: { required: "Address is required", minLength: { value: 5, message: "At least 5 characters" } },
    card: { pattern: { value: /^[0-9 ]{12,19}$/, message: "Enter a valid card number" } },
    email: { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } },
    password: { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } },
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser(data);
      Alert.alert(
        "Success",
        "Registered successfully. Please log in.",
        [{
          text: "Go to Login",
          onPress: async () => {
            try { await signOut(auth); } finally {
              navigation.navigate("Login", { email: getValues("email") });
            }
          },
        }],
        { cancelable: false }
      );
      reset();
    } catch (e: any) {
      Alert.alert("Register failed", e?.message ?? "Unknown error");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Purple header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSub}>Fill in your details to get started</Text>
      </View>

      {/* Form card */}
      <View style={styles.card}>
        {fields.map((field) => (
          <View key={field} style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{fieldLabels[field]}</Text>
            <Controller
              control={control}
              name={field}
              rules={rulesByField[field]}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={field === "password"}
                  autoCapitalize={field === "email" || field === "password" ? "none" : "words"}
                  keyboardType={
                    field === "email" ? "email-address"
                    : field === "phone" ? "phone-pad"
                    : "default"
                  }
                  error={!!errors[field]}
                  style={styles.input}
                  outlineColor="#ddd"
                  activeOutlineColor="purple"
                  left={<TextInput.Icon icon={fieldIcons[field]} color="purple" />}
                />
              )}
            />
            {!!errors[field] && (
              <Text style={styles.error}>{errors[field]?.message?.toString()}</Text>
            )}
          </View>
        ))}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.btn}
          buttonColor="purple"
          contentStyle={{ paddingVertical: 6 }}
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    backgroundColor: "purple",
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  headerSub: { color: "#e0c9f5", fontSize: 13, marginTop: 6 },

  // Card
  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  fieldWrapper: { marginBottom: 4 },
  fieldLabel: { fontSize: 13, color: "#555", marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: "#fff" },
  error: { color: "red", fontSize: 12, marginTop: 4 },

  // Button
  btn: { marginTop: 24, borderRadius: 10 },

  // Login link
  loginRow: {
    flexDirection: "row", justifyContent: "center",
    alignItems: "center", marginTop: 16,
  },
  loginText: { color: "#888", fontSize: 14 },
  loginLink: { color: "purple", fontWeight: "bold", fontSize: 14 },
});