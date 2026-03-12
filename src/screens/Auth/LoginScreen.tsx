import React from "react";
import { View, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "../../store/authStore";
import { useRoute, useNavigation } from "@react-navigation/native";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const prefillEmail = route?.params?.email ?? "";
  const { login, loading } = useAuthStore();

  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: prefillEmail, password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>

      {/* Top food image — like inspiration */}
      <View style={styles.topImageContainer}>
        <View style={styles.topImageCircle} />
        <View style={styles.topImageCircle2} />
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome back! Please login to continue.</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.fieldLabel}>Email Address</Text>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="purple"
              placeholder="your@email.com"
            />
          )}
        />

        <Text style={styles.fieldLabel}>Password</Text>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              mode="outlined"
              secureTextEntry
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              style={styles.input}
              outlineColor="#ddd"
              activeOutlineColor="purple"
              placeholder="••••••••"
            />
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.btn}
          buttonColor="purple"
          contentStyle={{ paddingVertical: 6 }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        {/* Register link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom food image — like inspiration */}
      <View style={styles.bottomImageContainer}>
        <View style={styles.bottomImageCircle} />
        <View style={styles.bottomImageCircle2} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Decorative circles top right (mimics food image placement)
  topImageContainer: { position: "absolute", top: -40, right: -40 },
  topImageCircle: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "#f0e6ff", position: "absolute", top: 0, right: 0,
  },
  topImageCircle2: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: "#e0ccff", position: "absolute", top: 30, right: 30,
  },

  // Title
  titleSection: { marginTop: 140, paddingHorizontal: 28 },
  title: { fontSize: 36, fontWeight: "bold", color: "#1a1a1a" },
  subtitle: { color: "#888", marginTop: 6, fontSize: 14 },

  // Form
  form: { paddingHorizontal: 28, marginTop: 30 },
  fieldLabel: { fontSize: 13, color: "#555", marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: "#fff", marginBottom: 4 },

  // Button
  btn: { marginTop: 24, borderRadius: 10 },

  // Register
  registerRow: {
    flexDirection: "row", justifyContent: "center",
    alignItems: "center", marginTop: 20,
  },
  registerText: { color: "#888", fontSize: 14 },
  registerLink: { color: "purple", fontWeight: "bold", fontSize: 14 },

  // Decorative circles bottom left
  bottomImageContainer: { position: "absolute", bottom: -40, left: -40 },
  bottomImageCircle: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "#f0e6ff", position: "absolute", bottom: 0, left: 0,
  },
  bottomImageCircle2: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: "#e0ccff", position: "absolute", bottom: 20, left: 20,
  },
});