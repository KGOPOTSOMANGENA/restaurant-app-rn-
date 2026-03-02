import React from "react";
import { Alert, ScrollView, View } from "react-native";
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
  "name",
  "surname",
  "phone",
  "address",
  "card",
  "email",
  "password",
];

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register: registerUser, loading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      address: "",
      card: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const rulesByField: Partial<Record<keyof FormValues, any>> = {
    name: { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } },
    surname: { required: "Surname is required", minLength: { value: 2, message: "Surname must be at least 2 characters" } },
    phone: {
      required: "Phone is required",
      pattern: { value: /^[0-9+\-() ]{7,}$/, message: "Enter a valid phone number" },
    },
    address: { required: "Address is required", minLength: { value: 5, message: "Address must be at least 5 characters" } },
    card: {
      pattern: { value: /^[0-9 ]{12,19}$/, message: "Enter a valid card number" },
    },
    email: {
      required: "Email is required",
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
    },
    password: { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } },
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await registerUser(data);

      // Success alert
      Alert.alert(
        "Success",
        "Registered successfully. Please log in.",
        [
          {
            text: "Go to Login",
            onPress: async () => {
              try {
                // Ensure your flow: after registering, sign the user OUT,
                // then navigate to Login and prefill the email.
                await signOut(auth);
              } finally {
                // @ts-ignore – route name from your AuthStack
                navigation.navigate("Login", { email: getValues("email") });
              }
            },
          },
        ],
        { cancelable: false }
      );
      reset();
    } catch (e: any) {
      Alert.alert("Register failed", e?.message ?? "Unknown error");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        Create Account
      </Text>

      {fields.map((field) => (
        <View key={field} style={{ marginBottom: 15 }}>
          <Controller
            control={control}
            name={field}
            rules={rulesByField[field]}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={field.toUpperCase()}
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={field === "password"}
                autoCapitalize={field === "email" || field === "password" ? "none" : "words"}
                keyboardType={
                  field === "email"
                    ? "email-address"
                    : field === "phone"
                    ? "phone-pad"
                    : "default"
                }
                error={!!errors[field]}
              />
            )}
          />
          {!!errors[field] && (
            <Text style={{ color: "red", marginTop: 4 }}>
              {errors[field]?.message?.toString()}
            </Text>
          )}
        </View>
      ))}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
      >
        {loading ? "Creating..." : "Register"}
      </Button>
    </ScrollView>
  );
}