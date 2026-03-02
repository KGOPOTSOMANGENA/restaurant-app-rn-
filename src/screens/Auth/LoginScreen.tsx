import React from "react";
import { View, TouchableOpacity } from "react-native";
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
    defaultValues: {
      email: prefillEmail,
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      // Success → RootNavigator switches to AppStack automatically
    } catch (error: any) {
      alert(error.message); 
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        Login
      </Text>

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Email"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ marginBottom: 16 }}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            style={{ marginBottom: 16 }}
          />
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 12 }}
      >
        <Text>Don’t have an account? Create one</Text>
      </TouchableOpacity>
    </View>
  );
}